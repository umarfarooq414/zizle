"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const email_entity_1 = require("./entities/email.entity");
const typeorm_2 = require("typeorm");
let MailService = class MailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendResetPasswordMail(email, resetPasswordTemplate) {
        try {
            const res = await this.mailerService.sendMail({
                to: email,
                subject: `${resetPasswordTemplate.productName}: Reset your password! `,
                template: './resetPasswordTemplate',
                context: Object.assign({}, resetPasswordTemplate),
            });
            if (res) {
                const mail = new email_entity_1.Email();
                mail.message = 'Reset Password email';
                mail.receiver = email;
                await this.emailRepository.save(mail);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async sendVerificationMail(email, verificationTemplate) {
        try {
            const res = await this.mailerService.sendMail({
                to: email,
                subject: `${verificationTemplate.productName}: Account Verification! `,
                template: './verificationTemplate',
                context: Object.assign({}, verificationTemplate),
            });
            if (res) {
                const mail = new email_entity_1.Email();
                mail.message = 'Verification Email';
                mail.receiver = email;
                await this.emailRepository.save(mail);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async sendSupportMail(theme, contactTemplate, adminEmail) {
        try {
            const res = await this.mailerService.sendMail({
                to: adminEmail,
                from: contactTemplate.email,
                subject: `${theme}`,
                template: './contactTemplate',
                context: Object.assign({}, contactTemplate),
            });
            if (res) {
                const mail = new email_entity_1.Email();
                mail.message = contactTemplate.message;
                mail.receiver = adminEmail;
                await this.emailRepository.save(mail);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async sendFakeMessageMail(subject, fakeTemplate, receiver) {
        try {
            const res = await this.mailerService.sendMail({
                to: receiver,
                subject: `Zizile : ${subject}`,
                template: './fakeTemplate',
                context: Object.assign({}, fakeTemplate),
            });
            if (res) {
                const mail = new email_entity_1.Email();
                mail.message = fakeTemplate.message;
                mail.receiver = receiver;
                await this.emailRepository.save(mail);
            }
        }
        catch (error) {
        }
    }
    async sendWelcomeMail(email, welcomeTemplate) {
        try {
            const res = await this.mailerService.sendMail({
                to: email,
                subject: `${welcomeTemplate.productName}: Welcome! `,
                template: './welcomeTemplate',
                context: Object.assign({}, welcomeTemplate),
            });
            if (res) {
                const mail = new email_entity_1.Email();
                mail.message = welcomeTemplate.message;
                mail.receiver = email;
                await this.emailRepository.save(mail);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
__decorate([
    (0, typeorm_1.InjectRepository)(email_entity_1.Email),
    __metadata("design:type", typeorm_2.Repository)
], MailService.prototype, "emailRepository", void 0);
MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map