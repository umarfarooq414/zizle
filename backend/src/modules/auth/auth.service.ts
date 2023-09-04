import { Payments } from 'src/modules/payments/entities/payment.entity';
import { Email } from './../mail/entities/email.entity';
import { CreateBonusCodeDto } from './../../../libs/dtos/src/auth/bonusCode.dto';
import { UpdateModDto } from './../../../libs/dtos/src/auth/updateMod.dto';
import { CreateModDto } from './../../../libs/dtos/src/auth/createMod.dto';
import { FakeChat } from 'src/modules/fake/entities/fakeChat.entity';
import { GetModsStatsQueryParamsDto } from './../../../libs/dtos/src/auth/mod.stats.dto';
import { ChatService } from './../chat/chat.service';
import { UserAccountTransaction } from './../user/entities/user.account.transaction.entity';
import { EntityManager, In } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
import { CustomerProfileData } from '../user/entities/customer.profiledata.entity';
import * as schedule from 'node-schedule';

import {
  type AdminModRegisterRequestDto,
  AuthorizeResponseDto,
  type LoginRequestDto,
  type UserRegisterRequestDto,
  ResetPasswordRequestDto,
  SocialLoginRequestDto,
  ScheduleMessageDto,
  SpamMessagesDto,
  UpdateQueryStatusDto,
} from '@lib/dtos';
import { FacebookClient } from './clients/facebook.client';

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';
import {
  ConfigEnum,
  CustomerProfileEnum,
  type IJwtConfig,
  type IServerConfig,
  UserRoleEnum,
  UserStatusEnum,
  TransactionActionTypes,
  SocialProviderEnum,
} from '@lib/types';
import { type UpdateAccessDto } from '@lib/dtos/auth/updateAccess';
import { GlobalResponseDto } from '@lib/dtos/common';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { type UpdateStatusDto } from '@lib/dtos/auth/updateStatus';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserTransactionActionTypes } from '../user/entities/user.transaction.actiontypes.entity';
import { Token } from './entities/token.entity';
import { v4 as uuidv4 } from 'uuid';
import { GoogleClient } from './clients/google.client';
import { CloudinaryConfigService } from '@config/cloudinary.config';
import { Chat } from '../chat/entities/chat.entity';
import { BonusCode } from './entities/bonusCode.entity';
import { Attachment } from '../chat/entities/attachment.entity';
import { ScheduleMessage } from './entities/scheduleMessage.entity';
import { ContactSupport } from '../user/entities/contactSupport.entity';
@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @InjectRepository(ContactSupport)
  private readonly contactSupportRepo: Repository<ContactSupport>;

  @InjectRepository(Email)
  private readonly emailRepo: Repository<Email>;

  @InjectRepository(CustomerProfileData)
  private readonly profile: Repository<CustomerProfileData>;

  @InjectRepository(Token)
  private readonly tokenRepository: Repository<Token>;
  @InjectRepository(Chat)
  private readonly chatRepo: Repository<Chat>;

  @InjectRepository(FakeChat)
  private readonly fakeChat: Repository<FakeChat>;

  @InjectRepository(ScheduleMessage)
  private readonly scheduleMessageRepo: Repository<ScheduleMessage>;

  @InjectRepository(Attachment)
  private readonly attachmentRepository: Repository<Attachment>;

  @InjectRepository(BonusCode)
  private readonly bonusRepo: Repository<BonusCode>;

  @InjectRepository(Payments)
  private readonly paymentsRepo: Repository<Payments>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  @Inject(MailService)
  private readonly mailService: MailService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(ChatService)
  private readonly chatService: ChatService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;
  @Inject(FacebookClient)
  private readonly facebookClient: FacebookClient;
  @Inject(GoogleClient)
  private readonly googleClient: GoogleClient;

  private readonly jwt: JwtService;
  constructor(jwt: JwtService, private readonly entity: EntityManager, private cloudinary: CloudinaryConfigService) {
    this.jwt = jwt;
    this.scheduleStarterMessage();
  }

  public async registerUser(body: UserRegisterRequestDto): Promise<User | never> {
    const { email, password, age }: UserRegisterRequestDto = body;
    let user: User = await this.repository.findOne({ where: { email } });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (user) {
      throw new HttpException('User already exit!', HttpStatus.CONFLICT);
    }
    user = new User({
      ...body,
    });
    const hashedPassword = await this.helper.encodePassword(password);
    user.setPassword(hashedPassword);
    const profile = new CustomerProfileData();
    this.userService.validateAndSaveDOB(profile, this.helper.calculateBirthday(age));
    user.profile = profile;
    await this.profile.save(profile);
    const newUser = await this.repository.save(user);
    await this.userService.validateAndSaveAddress(body.zipCode, user);
    await this.userService.addTransactions(
      TransactionActionTypes.ACCOUNTCREATION,
      newUser,
      this.entity,
      UserAccountTransaction,
      UserTransactionActionTypes
    );
    const { productName, backendUrl } = this.configService.get<IServerConfig>(ConfigEnum.SERVER);
    const token = this.jwt.sign({ id: (await newUser).id });
    this.mailService.sendVerificationMail(user.email, {
      authLoginLink: `${backendUrl}/auth/verify?token=${token}`,
      firstName: user.userName,
      productName,
    });

    return newUser;
  }

  async socialLogin(body: SocialLoginRequestDto): Promise<AuthorizeResponseDto | User> {
    const { socialProvider } = body;
    if (socialProvider == SocialProviderEnum.GOOGLE) {
      return this.googleClient.validate(body);
    }
    if (socialProvider == SocialProviderEnum.FACEBOOK) {
      return await this.facebookClient.saveUserInfo(body);
    }
  }

  public async registerAdminMod(body: AdminModRegisterRequestDto): Promise<User | never> {
    const { email, password }: AdminModRegisterRequestDto = body;
    let user: User = await this.repository.findOne({ where: { email } });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (user) {
      throw new HttpException('User already exit!', HttpStatus.CONFLICT);
    }
    user = new User({
      ...body,
    });
    const hashedPassword = await this.helper.encodePassword(password);
    user.setPassword(hashedPassword);
    const newUser = this.repository.save(user);
    const { productName, backendUrl } = this.configService.get<IServerConfig>(ConfigEnum.SERVER);
    const token = this.jwt.sign({ id: (await newUser).id });
    this.mailService.sendVerificationMail(user.email, {
      authLoginLink: `${backendUrl}/auth/verify?token=${token}`,
      firstName: user.firstName,
      productName,
    });
    return await newUser;
  }

  public async login(body: LoginRequestDto): Promise<AuthorizeResponseDto | never> {
    const { email, password }: LoginRequestDto = body;
    const user: User | any = await this.repository.findOne({ where: { email } });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!user || (user.role === UserRoleEnum.CUSTOMER && user.disable === true)) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!user || (user.role === UserRoleEnum.CUSTOMER && user.status === UserStatusEnum.UNVERIFIED)) {
      return user;
      // throw new HttpException('User needs Verification', HttpStatus.NOT_FOUND);
    }
    if (user.role === UserRoleEnum.MODERATOR && user.status === UserStatusEnum.BLOCK) {
      throw new HttpException('User is Blocked', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid: boolean = this.helper.isPasswordValid(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Password Invalid!', HttpStatus.NOT_FOUND);
    }
    delete user.password;
    return new AuthorizeResponseDto(user, this.helper.generateToken(user));
  }

  public async updateUserAccess(updateAccessDto: UpdateAccessDto): Promise<GlobalResponseDto> {
    const user = await this.repository.findOne({
      where: { id: updateAccessDto.userId },
    });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    user.setRole(updateAccessDto.role);
    await this.repository.save(user);
    let message = '';
    if (updateAccessDto.role === UserRoleEnum.MODERATOR) {
      message = 'User Role Successfully updated to Moderator!';
    }
    if (updateAccessDto.role === UserRoleEnum.ADMIN) {
      message = 'User Role Successfully updated to Admin!';
    }
    if (updateAccessDto.role === UserRoleEnum.CUSTOMER) {
      message = 'User Role Successfully updated to Member!';
    }
    return new GlobalResponseDto(message);
  }

  async updateUserStatus(updateStatusDto: UpdateStatusDto): Promise<GlobalResponseDto> {
    const user = await this.repository.findOne({
      where: { id: updateStatusDto.userId },
    });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    user.setStatus(updateStatusDto.status);
    await this.repository.save(user);
    const message =
      updateStatusDto.status === UserStatusEnum.VERIFIED
        ? 'User Successfully activated!'
        : 'User Successfully deactivated!';
    return new GlobalResponseDto(message);
  }

  async updateModeratorStatus(updateStatusDto: UpdateStatusDto): Promise<GlobalResponseDto> {
    let message = '';
    const user = await this.repository.findOne({
      where: {
        id: updateStatusDto.userId,
      },
    });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    if (user.role === UserRoleEnum.MODERATOR) {
      user.setStatus(updateStatusDto.status);
      await this.repository.save(user);
      if (updateStatusDto.status === UserStatusEnum.BLOCK) {
        message = 'Moderator Successfully blocked!';
      } else {
        throw new HttpException('Status can only be Block!', HttpStatus.CONFLICT);
      }
      return new GlobalResponseDto(message);
    } else {
      throw new HttpException('Blocking user must be moderator!', HttpStatus.CONFLICT);
    }
  }

  public async getAllUsers(): Promise<User[]> {
    const users = await this.repository.find({
      where: { disable: false, role: In([UserRoleEnum.FAKE, UserRoleEnum.CUSTOMER]) },
    });
    users.forEach((user) => {
      delete user.password;
    });
    return users;
  }

  public async getUserByMail(email: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { disable: false, role: UserRoleEnum.CUSTOMER, email },
    });
    return user;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public async getUserByVerificationToken(token: string) {
    const secret = this.configService.get<IJwtConfig>(ConfigEnum.JWT_TOKEN).secret;
    const user = this.jwt.verify(token, { secret });
    return await this.repository.findOneBy({ id: user?.id });
    // Use userId to retrieve user from database
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public async verifyEmail(token: string, res) {
    try {
      const user: User = await this.getUserByVerificationToken(token);
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!user) {
        // console.log('no user found')
        throw new HttpException('No user found', HttpStatus.NOT_FOUND);
      }
      const pid = user?.profile?.id;
      const data = await this.profile.findOneBy({ id: pid });
      if (user.profile.isEmailVerified === UserStatusEnum.UNVERIFIED) {
        let currentCoins = await this.userService.getCurrentCoinsFromDB(user);
        currentCoins += await this.userService.getActionTypeCostFromDB(TransactionActionTypes.EMAILCONFIRMED);
        await this.userService.transaction(user, currentCoins, TransactionActionTypes.EMAILCONFIRMED);
      }
      data.isEmailVerified = UserStatusEnum.VERIFIED;

      await this.profile.save(data);
      const updateStatusDto: UpdateStatusDto = {
        userId: user.id,
        status: UserStatusEnum.VERIFIED,
      };
      await this.updateUserStatus(updateStatusDto);
      const { frontendUrlClient, frontendUrlAdmin, frontendUrlModerator, authLoginLink, productName } =
        this.configService.get<IServerConfig>(ConfigEnum.SERVER);
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

      if (user.role === UserRoleEnum.CUSTOMER) {
        return res.redirect(`${frontendUrlClient}`);
      }
      if (user.role === UserRoleEnum.MODERATOR) {
        return res.redirect(`${frontendUrlModerator}`);
      }
      if (user.role === UserRoleEnum.ADMIN) {
        return res.redirect(`${frontendUrlAdmin}`);
      }
    } catch (error) {
      // console.error(error);
      return res.status(500).send('Internal server error');
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public async verifyProfile(id: string) {
    try {
      const user: User = await this.repository.findOneBy({ id });
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!user) {
        // console.log('no user found');
        throw new HttpException('No user found', HttpStatus.NOT_FOUND);
      }
      const pid = user.profile.id;
      const data = await this.profile.findOneBy({ id: pid });
      data.isProfileVerified = CustomerProfileEnum.VERIFIED;
      let currentCoins = await this.userService.getCurrentCoinsFromDB(user);
      currentCoins += await this.userService.getActionTypeCostFromDB(TransactionActionTypes.PROFILEVERIFIED);
      await this.userService.transaction(user, currentCoins, TransactionActionTypes.PROFILEVERIFIED);
      return await this.profile.save(data);
    } catch (error) {
      // console.error(error);
    }
  }

  public async forget(email: string): Promise<GlobalResponseDto> {
    const user: User = await this.repository.findOne({ where: { email } });

    if (user && user.role === UserRoleEnum.CUSTOMER && user.status === UserStatusEnum.UNVERIFIED) {
      console.log(user);
      throw new HttpException('User needs Verification!', HttpStatus.NOT_FOUND);
    }
    if (!user || (user.role === UserRoleEnum.CUSTOMER && user.disable === true)) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const oldToken = await this.tokenRepository.find({
      where: { userId: user.id },
    });
    await this.tokenRepository.remove(oldToken);

    const newToken = uuidv4();
    const token = new Token({
      userId: user.id,
      token: newToken,
    });
    await this.tokenRepository.save(token);
    const { productName, frontendUrlClient } = this.configService.get<IServerConfig>(ConfigEnum.SERVER);

    this.mailService.sendResetPasswordMail(user.email, {
      authOtpVerificationLink: `${frontendUrlClient}/auth/reset-password?token=${token.token}`,
      firstName: user.firstName,
      productName,
    });

    return new GlobalResponseDto(
      `Please check email. Reset Password link sent to ${user.email}, If not wait for a few minutes`
    );
  }

  public async resetPassword(token: string, { newPassword }: ResetPasswordRequestDto): Promise<GlobalResponseDto> {
    try {
      const verifyToken: Token = await this.tokenRepository.findOne({ where: { token } });
      const user: User = await this.repository.findOne({ where: { id: verifyToken.userId } });

      if (!user || (user.role === UserRoleEnum.CUSTOMER && user.disable === true)) {
        throw new HttpException('No user found', HttpStatus.NOT_FOUND);
      }
      if (user.role === UserRoleEnum.CUSTOMER && user.status === UserStatusEnum.UNVERIFIED) {
        throw new HttpException('User needs approval!', HttpStatus.NOT_FOUND);
      }
      const hashedPassword = await this.helper.encodePassword(newPassword);
      user.setPassword(hashedPassword);
      await this.repository.save(user);
      const oldToken = await this.tokenRepository.find({
        where: { userId: user.id },
      });
      await this.tokenRepository.remove(oldToken);
    } catch (err) {
      throw new HttpException('Invalid or expired token', HttpStatus.NOT_ACCEPTABLE);
    }
    return new GlobalResponseDto('Password reset successfully!');
  }

  public async onlineUsers(token: string): Promise<{ moderators: User[]; customers: User[] }> {
    try {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be admin', HttpStatus.UNAUTHORIZED);
      const users: User[] = await this.repository.find({
        where: {
          role: In([UserRoleEnum.CUSTOMER, UserRoleEnum.MODERATOR]),
          online: true,
          disable: false,
        },
      });
      const obj = {
        moderators: users.filter((user) => user.role === UserRoleEnum.MODERATOR),
        customers: users.filter((user) => user.role === UserRoleEnum.CUSTOMER),
      };
      return obj;
    } catch (error) {
      throw new HttpException('Could not find online users', HttpStatus.BAD_REQUEST);
    }
  }

  public async saveEmojis(token: string, file) {
    try {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be admin', HttpStatus.UNAUTHORIZED);
      let result;
      let url;
      if (file) {
        result = await this.cloudinary.uploadImage(file, 'emojis').catch(() => {
          throw new HttpException('Invalid file type.', HttpStatus.BAD_REQUEST);
        });
        url = result.url;
      }
    } catch (error) {
      throw new HttpException('Could not find online users', HttpStatus.BAD_REQUEST);
    }
  }

  public async getEmojis(token: string) {
    try {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.CUSTOMER)
        throw new HttpException('user must be Customer', HttpStatus.UNAUTHORIZED);
      const result = await this.cloudinary.getFolderImagesUrls('emojis').catch(() => {
        throw new HttpException('Invalid file type.', HttpStatus.BAD_REQUEST);
      });
      return result;
    } catch (error) {
      throw new HttpException('Could not find Emojis', HttpStatus.BAD_REQUEST);
    }
  }

  public async getUserStats(token: string) {
    try {
      const tokenValue = token.split(' ')[1];
      const duration = 'monthly';
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      const mods = await this.getMods(token);
      return await Promise.all(
        mods.map(async (mod) => {
          const repliesFromUser = await this.chatService.statsModGotRepliesFromUser({ mod, duration });
          const sentToUser = await this.chatService.statsModGotSentToUser({ mod, duration });

          return {
            mod: mod,
            repliesFromUser: repliesFromUser,
            sentToUser: sentToUser,
          };
        })
      );
    } catch (error) {
      throw new HttpException('Could not fetch data', HttpStatus.BAD_REQUEST);
    }
  }
  public async getMods(token: string): Promise<User[]> {
    try {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Customer', HttpStatus.UNAUTHORIZED);
      return await this.repository.find({
        where: {
          role: UserRoleEnum.MODERATOR,
          disable: false,
        },
      });
    } catch (error) {
      throw new HttpException('Could not find users', HttpStatus.BAD_REQUEST);
    }
  }

  public async getModSendMessageStats(token: string, params?: GetModsStatsQueryParamsDto) {
    try {
      const { mod, duration } = params;

      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      const mods = await this.getMods(token);
      return await Promise.all(
        mods.map(async (mod) => {
          return await this.chatService.statsModGotSentToUser({ mod, duration });
        })
      );
    } catch (error) {
      throw new HttpException('Could not fetch data', HttpStatus.BAD_REQUEST);
    }
  }

  async createBulkMessages(token, fakeUserId: string, customerUserIds: string, message: string, file) {
    try {
      // console.log(fakeUserIds, customerUserIds);
      token = token.includes('Bearer') ? token.split(' ')[1] : token;
      const decoded = await this.helper.decode(token as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('User must be Admin!', HttpStatus.NOT_FOUND);
      // const query= await this.repository.createQueryBuilder('user')
      //  .select('user')
      // .where('user.id IN (:...userRoleUserIds)', { userRoleUserIds:[customerUserIds] })
      // .where('user.role IN (:...userRoleUserIds)', { userRoleUserIds:[UserRoleEnum.ADMIN,UserRoleEnum.FAKE,UserRoleEnum.] })
      // .getCount();
      // console.log(query,customerUserIds.)

      const customerUsers = await this.repository.find({ where: { id: In(customerUserIds.split(',')) } });

      const fakeUser = await this.userService.getCustomer(fakeUserId);
      if (fakeUser.role !== UserRoleEnum.ADMIN)
        throw new HttpException('User must be Admin Support Account!', HttpStatus.UNAUTHORIZED);
      const Chats: Chat[] = [];

      for (const customerUser of customerUsers) {
        const chat = new Chat();
        const fakeChat = new FakeChat();
        chat.sender = fakeUser.id;
        chat.receiver = customerUser.id;
        chat.message = message;
        chat.seen = false;

        const savedChat = await this.chatRepo.save(chat);

        fakeChat.moderatorId = user.id;
        fakeChat.chat = savedChat;
        fakeChat.type = user.role;
        if (file) {
          const res: any = await this.cloudinary.uploadFile(file?.buffer, 'chat');
          const attachmentEntity = new Attachment();
          attachmentEntity.fileUrl = res?.url;
          attachmentEntity.fileName = file?.originalname;
          attachmentEntity.fileType = file?.mimetype;
          attachmentEntity.chat = savedChat;
          await this.attachmentRepository.save(attachmentEntity);
        }
        Chats.push(savedChat);
        await this.fakeChat.save(fakeChat);
        this.chatService.detectFakeAndSendMail(fakeUser?.id, customerUser?.id, message);
      }
      return await this.chatRepo.save(Chats);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async createMod(token: string, modDto: CreateModDto): Promise<User> {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string);
    const user = await this.helper.validateUser(decoded);
    if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    if (modDto.email === '') throw new HttpException('Email should not be empty!', HttpStatus.BAD_REQUEST);
    if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
    const mod: User = await this.repository.findOne({ where: { email: modDto.email } });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (mod) {
      throw new HttpException('User already exit!', HttpStatus.CONFLICT);
    }
    const newMod = new User({
      userName: modDto?.userName,
      email: modDto?.email,
      role: UserRoleEnum.MODERATOR,
      status: UserStatusEnum.ACTIVE,
    });
    const hashedPassword = await this.helper.encodePassword(modDto?.password);
    newMod.setPassword(hashedPassword);
    return await this.repository.save(newMod);
  }

  public async getMod(token: string, id: string): Promise<User> {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string);
    const user = await this.helper.validateUser(decoded);
    if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
    const mod: User = await this.repository.findOne({ where: { id } });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!mod) {
      throw new HttpException('Moderator not found!', HttpStatus.NOT_FOUND);
    }
    return mod;
  }
  public async deleteModById(token: string, id: string): Promise<GlobalResponseDto> {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string);
    const user = await this.helper.validateUser(decoded);
    if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
    const mod = await this.repository.findOneBy({ id });
    if (mod == null) {
      throw new HttpException('Mod Account not found!', HttpStatus.NOT_FOUND);
    }
    await this.repository.remove(mod);
    return new GlobalResponseDto('User Deleted successfully');
  }

  public async updateModById(token: string, id: string, body: UpdateModDto): Promise<User> {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string);
    const user = await this.helper.validateUser(decoded);
    if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
    const mod = await this.repository.findOneBy({ id });
    if (mod == null) {
      throw new HttpException('Mod Account not found!', HttpStatus.NOT_FOUND);
    } else {
      if (body.userName) mod.setUserName(body.userName);
      if (body.email) {
        if (body.email !== mod.email) {
          const exists = await this.repository.findOneBy({ email: body.email });
          if (!exists) {
            mod.setEmail(body.email);
          } else {
            throw new HttpException('Email already taken!', HttpStatus.CONFLICT);
          }
        }
      }
    }
    return await this.repository.save(mod);
  }

  public async createBonusCode(token: string, bonusCodeDto: CreateBonusCodeDto): Promise<BonusCode> {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string);
    const user = await this.helper.validateUser(decoded);
    if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
    const bonus: BonusCode = await this.bonusRepo.findOne({ where: { bonusCode: bonusCodeDto.bonusCode } });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (bonus) {
      throw new HttpException('Bonus Code already exit!', HttpStatus.CONFLICT);
    }
    const bonusCode = new BonusCode();
    bonusCode.bonusCode = bonusCodeDto.bonusCode;
    bonusCode.coins = bonusCodeDto.bonusCoins;
    bonusCode.expiryDate = bonusCodeDto.expiryDate;
    bonusCode.creator = user;
    return await this.bonusRepo.save(bonusCode);
  }

  public async updateBonusCode(token: string, id: string, expiryDate: Date): Promise<BonusCode> {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string);
    const user = await this.helper.validateUser(decoded);
    if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
    const bonus: BonusCode = await this.bonusRepo.findOne({ where: { id } });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (bonus) {
      bonus.setExpiryDate(expiryDate);
      return await this.bonusRepo.save(bonus);
    } else {
      throw new HttpException('Bonus Code not found', HttpStatus.NOT_FOUND);
    }
  }

  public async getAllBonusCodes(token: string): Promise<BonusCode[]> {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string);
    const user = await this.helper.validateUser(decoded);
    if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
    return await this.bonusRepo.find();
  }

  public async deleteBonusCodeById(token: string, id: string): Promise<GlobalResponseDto> {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string);
    const user = await this.helper.validateUser(decoded);
    if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
    const bonus: BonusCode = await this.bonusRepo.findOne({ where: { id } });
    if (!bonus) throw new HttpException('Bonus Code NOT FOUND', HttpStatus.NOT_FOUND);
    const res = await this.bonusRepo.remove(bonus);
    if (res) return new GlobalResponseDto('Bonus Code Deleted Successfully');
    else {
      return new GlobalResponseDto('Bonus Code Could not be deleted');
    }
  }

  public async scheduleMessage(token: string, body: ScheduleMessageDto) {
    try {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
      const { gender, nickname, online, startAge, endAge, distanceInMiles, newUsers, fsk, postalCode } = body;
      const filters = JSON.parse(
        `{"gender": "${gender ?? null}", "nickname": "${nickname ?? null}", "online": "${
          online ?? null
        }", "startAge": "${startAge ?? null}", "endAge": "${endAge ?? null}", "distanceInMiles": "${
          distanceInMiles ?? null
        }", "newUsers": "${newUsers ?? null}", "fsk": "${fsk ?? null}", "postalCode": "${postalCode ?? null}"}`
      );
      const scheduleMessage = this.scheduleMessageRepo.create({
        ...body,
        filters,
      });
      return await this.scheduleMessageRepo.save(scheduleMessage);
    } catch (error) {
      throw new HttpException('could not schedule message', HttpStatus.BAD_REQUEST);
    }
  }

  public async getScheduledMessage(token?: string): Promise<ScheduleMessage[]> {
    try {
      if (token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue as string);
        const user = await this.helper.validateUser(decoded);
        if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
        if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
      }
      return await this.scheduleMessageRepo.find();
    } catch (error) {
      throw new HttpException('could not get scheduled message', HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteScheduledMessage(token: string, id: string): Promise<GlobalResponseDto> {
    try {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
      const scheduleMessage: ScheduleMessage = await this.scheduleMessageRepo.findOne({ where: { id } });
      if (!scheduleMessage) throw new HttpException('Schedule Message NOT FOUND', HttpStatus.NOT_FOUND);
      const res = await this.scheduleMessageRepo.remove(scheduleMessage);
      if (res) return new GlobalResponseDto('Schedule Message Deleted Successfully');
      else {
        return new GlobalResponseDto('Schedule Message deleted');
      }
    } catch (error) {
      throw new HttpException('Schedule Message not be deleted', HttpStatus.BAD_REQUEST);
    }
  }

  public async sendSpamMessages(token: string, body: SpamMessagesDto, file): Promise<GlobalResponseDto> {
    try {
      const { message, fakeUserId, customerUserIds } = body;
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
      const usernameRegex = /%username%/gi;
      const userCityRegex = /%usercity%/gi;
      const userAgeRegex = /%userage%/gi;
      const mods = await this.repository.find({ where: { role: UserRoleEnum.MODERATOR } });
      if (mods.length === 0) throw new HttpException('Create at least a Moderator first!', HttpStatus.SEE_OTHER);
      // const customerUsers = await this.repository.find({ where: { id: In(customerUserIds) } });
      const customerUsers = await this.repository.find({ where: { id: In(customerUserIds.split(',')) } });
      const fake = await this.chatService.findUserById(fakeUserId);
      for (const customerUser of customerUsers) {
        let userAgeMessage = message;
        if (customerUser.userName) {
          userAgeMessage = userAgeMessage.replace(usernameRegex, customerUser.userName);
        }

        if (customerUser.address && customerUser.address.address) {
          const coordinates = await this.userService.getCoordinatesFromAddress(customerUser.address.address);
          const cityName = coordinates[2];
          userAgeMessage = userAgeMessage.replace(userCityRegex, cityName);
        }

        if (customerUser.profile && customerUser.profile.dateOfBirth) {
          const now = new Date();
          const ageInMs: number = now.getTime() - customerUser.profile.dateOfBirth.getTime();
          const ageInYears: number = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
          userAgeMessage = userAgeMessage.replace(userAgeRegex, ageInYears.toString());
        }
        const chat = new Chat();
        const fakeChat = new FakeChat();
        chat.sender = fake.id;
        chat.receiver = customerUser.id;
        chat.message = userAgeMessage;
        chat.seen = false;
        const savedChat = await this.chatRepo.save(chat);
        fakeChat.moderatorId = user.id;
        fakeChat.chat = savedChat;
        fakeChat.type = user.role;
        await this.fakeChat.save(fakeChat);
        if (file) {
          const res: any = await this.cloudinary.uploadFile(file?.buffer, 'chat');
          const attachmentEntity = new Attachment();
          attachmentEntity.fileUrl = res?.url;
          attachmentEntity.fileName = file?.originalname;
          attachmentEntity.fileType = file?.mimetype;
          attachmentEntity.chat = savedChat;
          await this.attachmentRepository.save(attachmentEntity);
        }
        this.chatService.detectFakeAndSendMail(fakeUserId, customerUser?.id, message);
      }
      return new GlobalResponseDto('Messages Sent Successfully');
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  scheduleStarterMessage() {
    schedule.scheduleJob('* * * * *', async () => {
      try {
        await this.cleanQueries();
        this.sendMessageToUsers();
      } catch (error) {
        console.error('An error occurred:', error);
      }
    });
  }

  async detectAndReturnNewUser(): Promise<User[]> {
    const adminUserIds: string[] = await this.getAdminUserIds();
    const usersWithoutAdminSender: User[] = await this.repository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRoleEnum.CUSTOMER })
      .andWhere('user.id NOT IN (SELECT chat.receiver FROM chat WHERE chat.sender = :adminId)', {
        adminId: adminUserIds,
      })
      .getMany();
    return usersWithoutAdminSender;
  }

  async getAdminUserIds(): Promise<string[]> {
    const adminUsers: User[] = await this.repository.findBy({ role: UserRoleEnum.ADMIN });
    const adminUserIds: string[] = adminUsers.map((adminUser) => adminUser.id);
    return adminUserIds;
  }

  async sendMessageToUsers() {
    const users = await this.detectAndReturnNewUser();
    const scheduledMessages = await this.getScheduledMessage();
    for (const scheduledMessage of scheduledMessages) {
      const { time, message, filters }: any = scheduledMessage;
      const minutes = parseInt(time);
      const params = {
        nickname: filters?.nickname,
        endAge: filters?.endAge,
        startAge: filters?.startAge,
        postalCode: filters?.postalCode,
        gender: filters?.gender,
        schedule: true,
      };
      const queryUsers = await this.userService.findAll(null, params);
      const fakeUsers = queryUsers?.data?.filter((user) => user.role === UserRoleEnum.FAKE);
      const randFake = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
      for (const user of users) {
        const createdTime: any = new Date(user.createdAt);
        const currentTime: any = new Date();

        const elapsedMinutes: number = Math.floor((currentTime - createdTime) / (1000 * 60));
        if (elapsedMinutes === minutes) {
          await this.sendMessage(user, message, randFake);
        }
      }
    }
  }

  async sendMessage(receiver: User, message: string, sender: User) {
    const usernameRegex = /%username%/gi;
    const userCityRegex = /%usercity%/gi;
    const userAgeRegex = /%userage%/gi;

    let userAgeMessage = message;
    if (receiver.userName) {
      userAgeMessage = userAgeMessage.replace(usernameRegex, receiver.userName);
    }

    if (receiver.address && receiver.address.address) {
      const coordinates = await this.userService.getCoordinatesFromAddress(receiver.address.address);
      const cityName = coordinates[2];
      userAgeMessage = userAgeMessage.replace(userCityRegex, cityName);
    }

    if (receiver.profile && receiver.profile.dateOfBirth) {
      const now = new Date();
      const ageInMs: number = now.getTime() - receiver.profile.dateOfBirth.getTime();
      const ageInYears: number = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
      userAgeMessage = userAgeMessage.replace(userAgeRegex, ageInYears.toString());
    }
    const chat = new Chat();
    chat.sender = sender.id;
    chat.receiver = receiver.id;
    chat.message = userAgeMessage;
    chat.seen = false;
    await this.chatRepo.save(chat);
  }

  public async getStats(token: string) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string);
    const user = await this.helper.validateUser(decoded);
    if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
    const { moderators, customers } = await this.onlineUsers(token);
    const newVerifiedUsers = await this.newVerifiedCustomers();
    const emailsSentToday = await this.emailsSentToday();
    const { today, currentMonth, lastMonth, percentageChange, yesterday } = await this.getSales();
    const stats = await this.getUserStats(token);
    const openMessages = await this.getOpenMessages();

    return {
      onlineMods: moderators,
      onlineUsers: customers,
      newVerifiedUsers,
      emailsSentToday,
      sales: {
        today,
        yesterday,
        percentageChange: `${percentageChange}%`,
        currentMonth,
        lastMonth,
      },
      MessageStats: stats,
      openMessages,
    };
  }
  async newVerifiedCustomers(): Promise<User[]> {
    const currentTime = new Date();
    const startOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 0, 0, 0);
    const endOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 23, 59, 59);
    const newVerifiedUsers = await this.repository
      .createQueryBuilder('user')
      .where('user.status = :status', { status: UserStatusEnum.VERIFIED })
      .andWhere('user.createdAt >= :startOfDay', { startOfDay })
      .andWhere('user.createdAt <= :endOfDay', { endOfDay })
      .getMany();
    return newVerifiedUsers;
  }

  async emailsSentToday(): Promise<number> {
    const currentTime = new Date();
    const startOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 0, 0, 0);
    const endOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 23, 59, 59);
    const emails = await this.emailRepo
      .createQueryBuilder('email')
      .andWhere('email.createdAt >= :startOfDay', { startOfDay })
      .andWhere('email.createdAt <= :endOfDay', { endOfDay })
      .getCount();
    return emails;
  }
  async getSales(): Promise<{
    today: number;
    yesterday: number;
    percentageChange: number;
    currentMonth: number;
    lastMonth: number;
  }> {
    const currentTime = new Date();

    const startOfToday = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 0, 0, 0);
    const endOfToday = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 23, 59, 59);

    const startOfCurrentMonth = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1, 0, 0, 0);
    const endOfCurrentMonth = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0, 23, 59, 59);

    const startOfLastMonth = new Date(currentTime.getFullYear(), currentTime.getMonth() - 1, 1, 0, 0, 0);
    const endOfLastMonth = new Date(currentTime.getFullYear(), currentTime.getMonth(), 0, 23, 59, 59);

    const startOfYesterday = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate() - 1,
      0,
      0,
      0
    );
    const endOfYesterday = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate() - 1,
      23,
      59,
      59
    );

    const todayQuery = await this.paymentsRepo
      .createQueryBuilder('payments')
      .select('SUM(payments.amount)', 'totalAmount')
      .where('payments.timestamp >= :startOfDay AND payments.timestamp <= :endOfDay', {
        startOfDay: startOfToday,
        endOfDay: endOfToday,
      })
      .getRawOne();
    const todayTotalAmount = todayQuery ? todayQuery.totalAmount : 0;

    const yesterdayQuery = await this.paymentsRepo
      .createQueryBuilder('payments')
      .select('SUM(payments.amount)', 'totalAmount')
      .where('payments.timestamp >= :startOfYesterday AND payments.timestamp <= :endOfYesterday', {
        startOfYesterday,
        endOfYesterday,
      })
      .getRawOne();
    const yesterdayTotalAmount = yesterdayQuery ? yesterdayQuery.totalAmount : 0;

    const currentMonthQuery = await this.paymentsRepo
      .createQueryBuilder('payments')
      .select('SUM(payments.amount)', 'totalAmount')
      .where('payments.timestamp >= :startOfMonth AND payments.timestamp <= :endOfMonth', {
        startOfMonth: startOfCurrentMonth,
        endOfMonth: endOfCurrentMonth,
      })
      .getRawOne();
    const currentMonthTotalAmount = currentMonthQuery ? currentMonthQuery.totalAmount : 0;

    const lastMonthQuery = await this.paymentsRepo
      .createQueryBuilder('payments')
      .select('SUM(payments.amount)', 'totalAmount')
      .where('payments.timestamp >= :startOfMonth AND payments.timestamp <= :endOfMonth', {
        startOfMonth: startOfLastMonth,
        endOfMonth: endOfLastMonth,
      })
      .getRawOne();
    const lastMonthTotalAmount = lastMonthQuery ? lastMonthQuery.totalAmount : 0;

    const percentageChange = ((todayTotalAmount - yesterdayTotalAmount) / yesterdayTotalAmount) * 100;

    return {
      today: todayTotalAmount,
      yesterday: yesterdayTotalAmount,
      percentageChange,
      currentMonth: currentMonthTotalAmount,
      lastMonth: lastMonthTotalAmount,
    };
  }

  public async getQueries(token: string): Promise<ContactSupport[]> {
    try {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN && user.role !== UserRoleEnum.CUSTOMER)
        throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
      return await this.contactSupportRepo.find({
        relations: ['user'],
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async getSpecifiCustomerQueries(token: string): Promise<ContactSupport[]> {
    try {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN && user.role !== UserRoleEnum.CUSTOMER)
        throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
      return await this.contactSupportRepo.find({
        where: {
          user: { id: user.id },
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async updateQueryStatus(token: string, body: UpdateQueryStatusDto): Promise<ContactSupport> {
    try {
      const { id, status } = body;
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('user must be Admin', HttpStatus.UNAUTHORIZED);
      const foundQuery = await this.contactSupportRepo.findOne({
        where: {
          id,
        },
        relations: ['user'],
      });
      if (!foundQuery) throw new HttpException('Query not found', HttpStatus.NOT_FOUND);
      foundQuery.status = status;
      return await this.contactSupportRepo.save(foundQuery);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async cleanQueries() {
    try {
      const queries: ContactSupport[] = await this.contactSupportRepo.find();
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 7);
      for (const query of queries) {
        const createdAt = new Date(query.createdAt);
        const diff = createdAt <= currentDate;
        if (diff) {
          await this.contactSupportRepo.remove(query);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  async getOpenMessages() {
    try {
      const mods = await this.repository.find({ where: { role: UserRoleEnum.MODERATOR } });
      const chats = await Promise.all(
        mods.map(async (mod) => {
          return await this.chatService.getModChatUsers(null, mod.id);
        })
      );
      return chats.length;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.status, error.message);
    }
  }
}
