import { UserModule } from './../user/user.module';
import { FakeModule } from './../fake/fake.module';
import { MailService } from './../mail/mail.service';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Attachment } from './entities/attachment.entity';
import { Chat } from './entities/chat.entity';
import { ChatsGateway } from './chat.gateway';
import { FakeChat } from '../fake/entities/fakeChat.entity';
import { CloudinaryConfigService } from '@config/cloudinary.config';
import { FallOutUsers } from '../user/entities/user.fallout.entity';
import { Email } from '../mail/entities/email.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chat, Attachment, FakeChat, FallOutUsers, Email]),
    forwardRef(() => AuthModule),
    forwardRef(() => FakeModule),
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatsGateway, MailService, CloudinaryConfigService],
  exports: [ChatsGateway, ChatService],
})
export class ChatModule {}
