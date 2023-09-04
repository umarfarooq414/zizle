import { SubscriptionsService } from './../subscriptions/subscriptions.service';
import { MailService } from './../mail/mail.service';
import { UserService } from './../user/user.service';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Payments } from './entities/payment.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { UserAccountTransaction } from '../user/entities/user.account.transaction.entity';
import { UserTransactionActionTypes } from '../user/entities/user.transaction.actiontypes.entity';
import { CloudinaryConfigService } from '@config/cloudinary.config';
import { Email } from '../mail/entities/email.entity';
import { UserModule } from '../user/user.module';
import { UserSubscription } from '../subscriptions/entities/user.subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Payments,
      Subscription,
      UserAccountTransaction,
      UserTransactionActionTypes,
      Email,
      UserSubscription,
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, MailService, SubscriptionsService, CloudinaryConfigService],
})
export class PaymentsModule {}
