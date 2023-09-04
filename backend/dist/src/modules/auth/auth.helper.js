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
exports.AuthHelper = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const bcrypt = require("bcryptjs");
const config_1 = require("@nestjs/config");
const types_1 = require("../../../libs/types/src");
const google_auth_library_1 = require("google-auth-library");
const bonusCode_entity_1 = require("./entities/bonusCode.entity");
const userBonusCode_entity_1 = require("./entities/userBonusCode.entity");
const chat_entity_1 = require("../chat/entities/chat.entity");
let AuthHelper = class AuthHelper {
    constructor(jwt) {
        this.jwt = jwt;
    }
    async decode(token) {
        return this.jwt.decode(token, null);
    }
    async validateUser(decoded) {
        const user = await this.repository.findOne({ where: { id: decoded.id } });
        if (user) {
            delete user.password;
            return user;
        }
    }
    generateToken(user) {
        return this.jwt.sign({ id: user.id, email: user.email, role: user.role }, {
            secret: process.env.JWT_SECRET || this.configService.get(types_1.ConfigEnum.JWT_TOKEN).secret,
        });
    }
    calculateBirthday(age) {
        const today = new Date();
        const currentYear = today.getFullYear();
        const birthYear = currentYear - age;
        const pastBirthday = new Date(birthYear, today.getMonth(), today.getDate());
        const year = pastBirthday.getFullYear();
        const month = pastBirthday.getMonth() + 1;
        const date = pastBirthday.getDate();
        return year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
    }
    isPasswordValid(password, userPassword) {
        return bcrypt.compareSync(password, userPassword);
    }
    async encodePassword(password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }
    async validate(token) {
        const decoded = this.jwt.verify(token);
        if (!decoded) {
            throw new common_1.HttpException('Forbidden', common_1.HttpStatus.FORBIDDEN);
        }
        const user = await this.validateUser(decoded);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return true;
    }
    GoogleClient() {
        const client = new google_auth_library_1.OAuth2Client(this.configService.get('GOOGLE_APP_ID'), this.configService.get('GOOGLE_APP_SECRET'));
        return client;
    }
    async verifyBonusCode(token, bonusCode) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.decode(tokenValue);
        const user = await this.validateUser(decoded);
        if (!user)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        const bonus = await this.bonusRepo.findOne({ where: { bonusCode } });
        if (bonus) {
            const currentTime = new Date();
            const expiryDateTime = new Date(bonus.expiryDate);
            return currentTime <= expiryDateTime;
        }
        else {
            throw new common_1.HttpException('Bonus Code not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getBonusCode(token, id, bonusCode) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.decode(tokenValue);
        const user = await this.validateUser(decoded);
        if (!user)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        const bonus = id
            ? await this.bonusRepo.findOne({ where: { id } })
            : await this.bonusRepo.findOne({ where: { bonusCode } });
        if (!bonus)
            throw new common_1.HttpException('Bonus Code NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        return bonus;
    }
    async useBonusCode(user, bonusCode) {
        const userBonusCode = await this.userBonusRepo.findOne({
            where: {
                user: { id: user.id },
                bonusCode: { id: bonusCode.id },
            },
        });
        if (userBonusCode) {
            throw new common_1.HttpException('This user has already used this bonus code.', common_1.HttpStatus.CONFLICT);
        }
        const newUserBonusCode = new userBonusCode_entity_1.UserBonusCode();
        newUserBonusCode.user = user;
        newUserBonusCode.bonusCode = bonusCode;
        return await this.userBonusRepo.save(newUserBonusCode);
    }
    async sendWelcomeMessage(receiver) {
        const admin = await this.repository.findOneBy({ role: types_1.UserRoleEnum.ADMIN });
        const welcomeMessage = `Thank you very much for registering with ZIZLE. To make your
profile even more attractive and to receive more inquiries, please upload a profile picture.
This will make your profile more visible to others. We will always keep you up to date stand
and inform you about voucher codes and much more. Your ZIZLE support team.`;
        const chat = new chat_entity_1.Chat();
        chat.sender = admin.id;
        chat.receiver = receiver.id;
        chat.message = welcomeMessage;
        chat.seen = false;
        await this.chatRepo.save(chat);
    }
};
__decorate([
    (0, typeorm_1.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], AuthHelper.prototype, "repository", void 0);
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], AuthHelper.prototype, "configService", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(bonusCode_entity_1.BonusCode),
    __metadata("design:type", typeorm_2.Repository)
], AuthHelper.prototype, "bonusRepo", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(chat_entity_1.Chat),
    __metadata("design:type", typeorm_2.Repository)
], AuthHelper.prototype, "chatRepo", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(userBonusCode_entity_1.UserBonusCode),
    __metadata("design:type", typeorm_2.Repository)
], AuthHelper.prototype, "userBonusRepo", void 0);
AuthHelper = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthHelper);
exports.AuthHelper = AuthHelper;
//# sourceMappingURL=auth.helper.js.map