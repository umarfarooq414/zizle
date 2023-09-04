import { MailService } from './../mail/mail.service';
import { UserAccountTransaction } from './entities/user.account.transaction.entity';
import { CustomerProfileData } from './entities/customer.profiledata.entity';
import { AuthModule } from './../auth/auth.module';
import { Global, Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserTransactionActionTypes } from './entities/user.transaction.actiontypes.entity';
import { VisitProfile } from './entities/visit.profile.entity';
import { Favorite } from './entities/customer.favourite.entity';
import { Address } from './entities/user.address.entity';
import { Block } from './entities/user.block.entity';
import { Photo } from './entities/user.photos.entity';
import { Payments } from '../payments/entities/payment.entity';
import { CloudinaryConfigService } from '@config/cloudinary.config';
import { BonusCode } from '../auth/entities/bonusCode.entity';
import { AuthService } from '../auth/auth.service';
import { Email } from '../mail/entities/email.entity';
import { FakeService } from '../fake/fake.service';
import { FakeModule } from '../fake/fake.module';
import { ContactSupport } from './entities/contactSupport.entity';
import { Notifications } from './entities/notifications.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      CustomerProfileData,
      UserTransactionActionTypes,
      UserAccountTransaction,
      VisitProfile,
      Favorite,
      Address,
      Block,
      Photo,
      Payments,
      BonusCode,
      Email,
      ContactSupport,
      Notifications,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, MailService, CloudinaryConfigService],
  exports: [UserService],
})
export class UserModule {}
