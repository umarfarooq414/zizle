import { CoinsService } from './coins.service';
import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CoinsController } from './coins.controller';
import { UserTransactionActionTypes } from '../user/entities/user.transaction.actiontypes.entity';
import { MailService } from '../mail/mail.service';
import { CloudinaryConfigService } from '@config/cloudinary.config';
import { Email } from '../mail/entities/email.entity';
import { UserModule } from '../user/user.module';
@Module({
  imports: [TypeOrmModule.forFeature([User, UserTransactionActionTypes, Email]), AuthModule, UserModule],
  controllers: [CoinsController],
  providers: [CoinsService, MailService, CloudinaryConfigService],
})
export class CoinsModule {}
