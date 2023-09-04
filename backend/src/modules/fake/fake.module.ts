import { FakeCreator } from './../user/entities/fakeUser.entity';
import { MailService } from './../mail/mail.service';
import { UserService } from './../user/user.service';
import { CustomerProfileData } from './../user/entities/customer.profiledata.entity';
import { AuthModule } from './../auth/auth.module';
import { ChatModule } from './../chat/chat.module';
import { ChatsGateway } from './../chat/chat.gateway';
import { Module } from '@nestjs/common';
import { FakeController } from './fake.controller';
import { FakeService } from './fake.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { CloudinaryConfigService } from '@config/cloudinary.config';
import { Email } from '../mail/entities/email.entity';
import { UserModule } from '../user/user.module';
import { Photo } from '../user/entities/user.photos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CustomerProfileData, FakeCreator, Email, Photo]),
    ChatModule,
    AuthModule,
    UserModule,
  ],
  controllers: [FakeController],
  providers: [FakeService, MailService, CloudinaryConfigService],
  exports: [FakeService],
})
export class FakeModule {}
