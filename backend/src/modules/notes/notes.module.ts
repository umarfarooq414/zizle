import { CloudinaryConfigService } from './../../config/cloudinary.config';
import { NotesService } from './notes.service';
import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Notes } from './entities/notes.entity';
import { NotesController } from './notes.controller';
import { MailService } from '../mail/mail.service';
import { Email } from '../mail/entities/email.entity';
import { UserModule } from '../user/user.module';
@Module({
  imports: [TypeOrmModule.forFeature([User, Notes, Email]), AuthModule, UserModule],
  controllers: [NotesController],
  providers: [NotesService, MailService, CloudinaryConfigService],
})
export class NotesModule {}
