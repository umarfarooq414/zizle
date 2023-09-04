import { IWelcomeTemplate } from './../../../libs/types/src/email/welcomeTemplate';
import { IFakeMessageTemplate } from './../../../libs/types/src/email/fakeMessage';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { type IAccountVerificationTemplate } from '@lib/types/email/verificationTemplate';
import { type IResetPasswordTemplate } from '@lib/types/email/resetPasswordTemplate';
import { type IContactTemplate } from '@lib/types/email/contactTemplate';
import { ContactSupportDto } from '@lib/dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';
import { Repository } from 'typeorm';
@Injectable()
export class MailService {
  @InjectRepository(Email)
  private readonly emailRepository: Repository<Email>;
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordMail(email: string, resetPasswordTemplate: IResetPasswordTemplate) {
    try {
      const res = await this.mailerService.sendMail({
        to: email,
        // from: 'testing@coderzhunt.com', // override default from
        subject: `${resetPasswordTemplate.productName}: Reset your password! `,
        template: './resetPasswordTemplate', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          ...resetPasswordTemplate,
        },
      });
      if (res) {
        const mail = new Email();
        mail.message = 'Reset Password email';
        mail.receiver = email;
        await this.emailRepository.save(mail);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sendVerificationMail(email: string, verificationTemplate: IAccountVerificationTemplate) {
    try {
      const res = await this.mailerService.sendMail({
        to: email,
        // from: 'testing@coderzhunt.com', // override default from
        subject: `${verificationTemplate.productName}: Account Verification! `,
        template: './verificationTemplate', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          ...verificationTemplate,
        },
      });
      if (res) {
        const mail = new Email();
        mail.message = 'Verification Email';
        mail.receiver = email;
        await this.emailRepository.save(mail);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sendSupportMail(theme: string, contactTemplate: IContactTemplate, adminEmail) {
    try {
      const res = await this.mailerService.sendMail({
        to: adminEmail, // email,
        from: contactTemplate.email, // override default from
        subject: `${theme}`,
        template: './contactTemplate', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          ...contactTemplate,
        },
      });
      if (res) {
        const mail = new Email();
        mail.message = contactTemplate.message;
        mail.receiver = adminEmail;
        await this.emailRepository.save(mail);
      }
    } catch (error) {
      console.log(error);
    }

    //  console.log('template:', 'verificationTemplate.hbs');
  }
  async sendFakeMessageMail(subject: string, fakeTemplate: IFakeMessageTemplate, receiver) {
    try {
      const res = await this.mailerService.sendMail({
        to: receiver, // email,
        // from: fakeTemplate.email, // override default from
        subject: `Zizile : ${subject}`,
        template: './fakeTemplate', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          ...fakeTemplate,
        },
      });
      if (res) {
        const mail = new Email();
        mail.message = fakeTemplate.message;
        mail.receiver = receiver;
        await this.emailRepository.save(mail);
      }
      //  console.log('template:', 'verificationTemplate.hbs');
    } catch (error) {
      // throw new HttpException('mail could not be sent', HttpStatus.NOT_FOUND);
    }
  }

  async sendWelcomeMail(email: string, welcomeTemplate: IWelcomeTemplate) {
    try {
      const res = await this.mailerService.sendMail({
        to: email,
        // from: 'testing@coderzhunt.com', // override default from
        subject: `${welcomeTemplate.productName}: Welcome! `,
        template: './welcomeTemplate', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          ...welcomeTemplate,
        },
      });
      if (res) {
        const mail = new Email();
        mail.message = welcomeTemplate.message;
        mail.receiver = email;
        await this.emailRepository.save(mail);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
