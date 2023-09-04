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
exports.GoogleClient = void 0;
const user_service_1 = require("./../../user/user.service");
const decorators_1 = require("@nestjs/common/decorators");
const config_1 = require("@nestjs/config");
const auth_helper_1 = require("../auth.helper");
const types_1 = require("../../../../libs/types/src");
const dtos_1 = require("../../../../libs/dtos/src");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../../mail/mail.service");
const customer_profiledata_entity_1 = require("../../user/entities/customer.profiledata.entity");
const user_account_transaction_entity_1 = require("../../user/entities/user.account.transaction.entity");
const user_transaction_actiontypes_entity_1 = require("../../user/entities/user.transaction.actiontypes.entity");
let GoogleClient = class GoogleClient {
    constructor(jwt, entity) {
        this.entity = entity;
        this.jwt = jwt;
    }
    async validate(body) {
        const { token, socialProvider, age, zipCode } = body;
        const client = this.helper.GoogleClient();
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: this.configService.get('GOOGLE_APP_ID'),
        });
        const payload = ticket.getPayload();
        const { email, family_name, given_name, name } = payload;
        delete body.token;
        const user = await this.repository.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            const newUser = this.repository.create({
                email,
                firstName: given_name,
                lastName: family_name,
                userName: body.userName,
                SocialProvider: socialProvider,
                password: body.password,
                status: types_1.UserStatusEnum.VERIFIED,
                selfGender: body.selfGender,
                interestedGender: body.interestedGender,
            });
            const hashedPassword = await this.helper.encodePassword(body.password);
            newUser.setPassword(hashedPassword);
            const profile = new customer_profiledata_entity_1.CustomerProfileData();
            newUser.profile = profile;
            this.userService.validateAndSaveDOB(profile, this.helper.calculateBirthday(age));
            await this.profile.save(profile);
            const savedUser = await this.repository.save(newUser);
            await this.userService.validateAndSaveAddress(zipCode, savedUser);
            await this.userService.addTransactions(types_1.TransactionActionTypes.ACCOUNTCREATION, savedUser, this.entity, user_account_transaction_entity_1.UserAccountTransaction, user_transaction_actiontypes_entity_1.UserTransactionActionTypes);
            if ((newUser.role === types_1.UserRoleEnum.CUSTOMER && newUser.status === types_1.UserStatusEnum.INACTIVE) ||
                newUser.status === types_1.UserStatusEnum.UNVERIFIED) {
                throw new common_1.HttpException('User needs Verification!', common_1.HttpStatus.NOT_FOUND);
            }
            const { frontendUrlClient, authLoginLink, productName } = this.configService.get(types_1.ConfigEnum.SERVER);
            const message = `Thank you very much for registering with ZIZLE. To make your
profile even more attractive and to receive more inquiries, please upload a profile picture.
This will make your profile more visible to others. We will always keep you up to date stand
and inform you about voucher codes and much more. Your ZIZLE support team.`;
            this.mailService.sendWelcomeMail(user === null || user === void 0 ? void 0 : user.email, {
                authLoginLink: frontendUrlClient,
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                productName,
                message,
            });
            await this.helper.sendWelcomeMessage(user);
            return new dtos_1.AuthorizeResponseDto(savedUser, this.helper.generateToken(savedUser));
        }
        return new dtos_1.AuthorizeResponseDto(user, this.helper.generateToken(user));
    }
};
__decorate([
    (0, typeorm_2.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_1.Repository)
], GoogleClient.prototype, "repository", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(customer_profiledata_entity_1.CustomerProfileData),
    __metadata("design:type", typeorm_1.Repository)
], GoogleClient.prototype, "profile", void 0);
__decorate([
    (0, decorators_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], GoogleClient.prototype, "configService", void 0);
__decorate([
    (0, decorators_1.Inject)(auth_helper_1.AuthHelper),
    __metadata("design:type", auth_helper_1.AuthHelper)
], GoogleClient.prototype, "helper", void 0);
__decorate([
    (0, decorators_1.Inject)(user_service_1.UserService),
    __metadata("design:type", user_service_1.UserService)
], GoogleClient.prototype, "userService", void 0);
__decorate([
    (0, decorators_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], GoogleClient.prototype, "mailService", void 0);
GoogleClient = __decorate([
    (0, decorators_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, typeorm_1.EntityManager])
], GoogleClient);
exports.GoogleClient = GoogleClient;
//# sourceMappingURL=google.client.js.map