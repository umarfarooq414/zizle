import { UserService } from './../../user/user.service';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { AuthHelper } from '../auth.helper';
import {
  ConfigEnum,
  IServerConfig,
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
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/modules/mail/mail.service';
import { CustomerProfileData } from 'src/modules/user/entities/customer.profiledata.entity';
import { UserAccountTransaction } from 'src/modules/user/entities/user.account.transaction.entity';
import { UserTransactionActionTypes } from 'src/modules/user/entities/user.transaction.actiontypes.entity';

@Injectable()
export class GoogleClient {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  @InjectRepository(CustomerProfileData)
  private readonly profile: Repository<CustomerProfileData>;
  @Inject(ConfigService)
  private readonly configService: ConfigService;
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(MailService)
  private readonly mailService: MailService;
  private readonly jwt: JwtService;

  constructor(jwt: JwtService, private readonly entity: EntityManager) {
    this.jwt = jwt;
  }
  public async validate(body: SocialLoginRequestDto): Promise<AuthorizeResponseDto | User> {
    const { token, socialProvider, age, zipCode } = body;
    const client = this.helper.GoogleClient();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GOOGLE_APP_ID'),
    });
    const payload = ticket.getPayload();
    const { email, family_name, given_name, name } = payload;
    delete body.token;
    const user: User = await this.repository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      const newUser: User = this.repository.create({
        email,
        firstName: given_name,
        lastName: family_name,
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

      if (
        (newUser.role === UserRoleEnum.CUSTOMER && newUser.status === UserStatusEnum.INACTIVE) ||
        newUser.status === UserStatusEnum.UNVERIFIED
      ) {
        throw new HttpException('User needs Verification!', HttpStatus.NOT_FOUND);
      }
      const { frontendUrlClient, authLoginLink, productName } = this.configService.get<IServerConfig>(
        ConfigEnum.SERVER
      );
      const message = `Thank you very much for registering with ZIZLE. To make your
profile even more attractive and to receive more inquiries, please upload a profile picture.
This will make your profile more visible to others. We will always keep you up to date stand
and inform you about voucher codes and much more. Your ZIZLE support team.`;
      this.mailService.sendWelcomeMail(user?.email, {
        authLoginLink: frontendUrlClient,
        firstName: user?.firstName,
        productName,
        message,
      });
      await this.helper.sendWelcomeMessage(user);

      return new AuthorizeResponseDto(savedUser, this.helper.generateToken(savedUser));
    }
    return new AuthorizeResponseDto(user, this.helper.generateToken(user));
  }
}
