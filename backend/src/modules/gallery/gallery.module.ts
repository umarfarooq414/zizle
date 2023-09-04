import { Categories } from './entities/categories.entity';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { Images } from './entities/images.entity';
import { AuthHelper } from '../auth/auth.helper';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { BonusCode } from '../auth/entities/bonusCode.entity';
import { UserBonusCode } from '../auth/entities/userBonusCode.entity';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { CloudinaryConfigService } from '@config/cloudinary.config';
import { Email } from '../mail/entities/email.entity';
import { UserModule } from '../user/user.module';
import { Chat } from '../chat/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categories, Images, User, BonusCode, UserBonusCode, Email, Chat]), UserModule],
  controllers: [GalleryController],
  providers: [GalleryService, AuthHelper, JwtService, MailService, CloudinaryConfigService],
})
export class GalleryModule {}
