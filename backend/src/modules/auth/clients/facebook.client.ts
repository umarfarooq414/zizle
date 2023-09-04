import { Inject, Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { AuthHelper } from '../auth.helper';
import {
  ConfigEnum,
  IServerConfig,
  ISocialConfig,
  SocialProviderEnum,
  TransactionActionTypes,
  UserInterestedGenderEnum,
  UserRoleEnum,
  UserSelfGenderEnum,
  UserStatusEnum,
} from '@lib/types';
import { AuthorizeResponseDto, SocialLoginRequestDto } from '@lib/dtos';
import { User } from 'src/modules/user/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { CustomerProfileData } from 'src/modules/user/entities/customer.profiledata.entity';
import { UserAccountTransaction } from 'src/modules/user/entities/user.account.transaction.entity';
import { UserTransactionActionTypes } from 'src/modules/user/entities/user.transaction.actiontypes.entity';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/modules/mail/mail.service';

@Injectable()
export class FacebookClient {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  @Inject(ConfigService)
  private readonly configService: ConfigService;
  @InjectRepository(CustomerProfileData)
  private readonly profile: Repository<CustomerProfileData>;
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;
  @Inject(MailService)
  private readonly mailService: MailService;
  @Inject(UserService)
  private readonly userService: UserService;
  private readonly jwt: JwtService;
  constructor(jwt: JwtService, private readonly entity: EntityManager) {
    this.jwt = jwt;
  }
  public async verify(body: SocialLoginRequestDto): Promise<any> {
    const { token } = body;
    try {
      const appId = this.configService.get<ISocialConfig>(ConfigEnum.SOCIAL).FACEBOOK_APP_ID;
      const appSecret = this.configService.get<ISocialConfig>(ConfigEnum.SOCIAL).FACEBOOK_APP_SECRET;
      const appAccessToken = `${appId}|${appSecret}`;
      const url = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${appAccessToken}`;
      const response = await axios.get(url);
      const { data } = response;
      return data;
    } catch (error) {
      throw new Error('Could not verify Facebook access token');
    }
  }

  public async saveUserInfo(body: SocialLoginRequestDto): Promise<any> {
    const { token, socialProvider, age, zipCode } = body;
    const url = `https://graph.facebook.com/v15.0/me?fields=last_name,first_name,email,short_name&access_token=${token}`;
    const response = await axios.get(url);
    const { data } = response;
    const { email, short_name, last_name, first_name } = data;
    const user: User = await this.repository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      const newUser: User = this.repository.create({
        email,

        userName: body.userName,
        SocialProvider: socialProvider as SocialProviderEnum,
        password: body.password,
        status: UserStatusEnum.VERIFIED,
        selfGender: body.selfGender as UserSelfGenderEnum,
        interestedGender: body.interestedGender as UserInterestedGenderEnum,
      });
      const hashedPassword = await this.helper.encodePassword(body.password);
      newUser.setPassword(hashedPassword);
      const profile = new CustomerProfileData();
      newUser.profile = profile;
      this.userService.validateAndSaveDOB(profile, this.helper.calculateBirthday(age));
      await this.profile.save(profile);
      const savedUser = await this.repository.save(newUser);
      await this.userService.validateAndSaveAddress(zipCode, savedUser);
      await this.userService.addTransactions(
        TransactionActionTypes.ACCOUNTCREATION,
        savedUser,
        this.entity,
        UserAccountTransaction,
        UserTransactionActionTypes
      );

      if (newUser.role === UserRoleEnum.CUSTOMER && newUser.status === UserStatusEnum.INACTIVE) {
        throw new HttpException('User needs approval!', HttpStatus.NOT_FOUND);
      }
      const { frontendUrlClient, authLoginLink, productName } = this.configService.get<IServerConfig>(
        ConfigEnum.SERVER
      );
      const message = `Thank you very much for registering with ZIZLE. To make your
profile even more attractive and to receive more inquiries, please upload a profile picture.
This will make your profile more visible to others. We will always keep you up to date stand
and inform you about voucher codes and much more. Your ZIZLE support team.`;
      await this.mailService.sendWelcomeMail(savedUser?.email, {
        authLoginLink: frontendUrlClient,
        firstName: savedUser?.firstName,
        productName,
        message,
      });
      await this.helper.sendWelcomeMessage(savedUser);

      return new AuthorizeResponseDto(savedUser, this.helper.generateToken(savedUser));
    }
    if (!user || (user.role === UserRoleEnum.CUSTOMER && user.status === UserStatusEnum.DEACTIVATE)) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
    if (user.role === UserRoleEnum.CUSTOMER && user.status === UserStatusEnum.INACTIVE) {
      throw new HttpException('User needs approval!', HttpStatus.NOT_FOUND);
    }
    return new AuthorizeResponseDto(user, this.helper.generateToken(user));
  }
}
