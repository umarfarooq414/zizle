import { Payments } from 'src/modules/payments/entities/payment.entity';
import { Email } from './../mail/entities/email.entity';
import { FakeChat } from 'src/modules/fake/entities/fakeChat.entity';
import { GoogleClient } from './clients/google.client';
import { FacebookClient } from './clients/facebook.client';
import { ChatsGateway } from './../chat/chat.gateway';
import { ChatModule } from './../chat/chat.module';
import { FakeModule } from './../fake/fake.module';
import { FakeService } from './../fake/fake.service';
import { UserAccountTransaction } from './../user/entities/user.account.transaction.entity';
import { UserService } from './../user/user.service';
import { CustomerProfileData } from '../user/entities/customer.profiledata.entity';
import { JwtStrategy } from './../../strategies/jwt.strategy';
import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { OauthUser } from '../user/entities/useroauth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum, type IJwtConfig } from '@lib/types';
import { MailModule } from '../mail/mail.module';
import { UserTransactionActionTypes } from '../user/entities/user.transaction.actiontypes.entity';
import { Token } from './entities/token.entity';
import { ChatService } from '../chat/chat.service';
import { Chat } from '../chat/entities/chat.entity';
import { Attachment } from '../chat/entities/attachment.entity';
import { CloudinaryConfigService } from '@config/cloudinary.config';
import { ModService } from './mod.service';
import { ModController } from './mod.controller';
import { FallOutUsers } from '../user/entities/user.fallout.entity';
import { VisitProfile } from '../user/entities/visit.profile.entity';
import { BonusCode } from './entities/bonusCode.entity';
import { UserBonusCode } from './entities/userBonusCode.entity';
import { ScheduleMessage } from './entities/scheduleMessage.entity';
import { ContactSupport } from '../user/entities/contactSupport.entity';
import { Notifications } from '../user/entities/notifications.entity';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      OauthUser,
      CustomerProfileData,
      UserAccountTransaction,
      UserTransactionActionTypes,
      Token,
      FallOutUsers,
      Chat,
      VisitProfile,
      BonusCode,
      FakeChat,
      Attachment,
      UserBonusCode,
      ScheduleMessage,
      Email,
      Payments,
      ContactSupport,
      Notifications,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: process.env.JWT_SECRET || config.get<IJwtConfig>(ConfigEnum.JWT_TOKEN).secret,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES || config.get<IJwtConfig>(ConfigEnum.JWT_TOKEN).expireIn,
        },
      }),
    }),
    MailModule,
    forwardRef(() => ChatModule),
    UserModule,
  ],
  controllers: [AuthController, ModController],
  providers: [
    AuthHelper,
    AuthService,
    JwtStrategy,
    // UserService,
    CloudinaryConfigService,
    FacebookClient,
    GoogleClient,
    ModService,
    ChatService,
  ],
  exports: [AuthService, AuthHelper],
})
export class AuthModule {}
