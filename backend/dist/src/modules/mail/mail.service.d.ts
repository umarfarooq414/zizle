import { IWelcomeTemplate } from './../../../libs/types/src/email/welcomeTemplate';
import { IFakeMessageTemplate } from './../../../libs/types/src/email/fakeMessage';
import { MailerService } from '@nestjs-modules/mailer';
import { type IAccountVerificationTemplate } from '@lib/types/email/verificationTemplate';
import { type IResetPasswordTemplate } from '@lib/types/email/resetPasswordTemplate';
import { type IContactTemplate } from '@lib/types/email/contactTemplate';
export declare class MailService {
    private readonly mailerService;
    private readonly emailRepository;
    constructor(mailerService: MailerService);
    sendResetPasswordMail(email: string, resetPasswordTemplate: IResetPasswordTemplate): Promise<void>;
    sendVerificationMail(email: string, verificationTemplate: IAccountVerificationTemplate): Promise<void>;
    sendSupportMail(theme: string, contactTemplate: IContactTemplate, adminEmail: any): Promise<void>;
    sendFakeMessageMail(subject: string, fakeTemplate: IFakeMessageTemplate, receiver: any): Promise<void>;
    sendWelcomeMail(email: string, welcomeTemplate: IWelcomeTemplate): Promise<void>;
}
