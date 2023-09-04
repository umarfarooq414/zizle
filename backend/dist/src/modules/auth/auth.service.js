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
exports.AuthService = void 0;
const payment_entity_1 = require("../payments/entities/payment.entity");
const email_entity_1 = require("./../mail/entities/email.entity");
const fakeChat_entity_1 = require("../fake/entities/fakeChat.entity");
const chat_service_1 = require("./../chat/chat.service");
const user_account_transaction_entity_1 = require("./../user/entities/user.account.transaction.entity");
const typeorm_1 = require("typeorm");
const customer_profiledata_entity_1 = require("../user/entities/customer.profiledata.entity");
const schedule = require("node-schedule");
const dtos_1 = require("../../../libs/dtos/src");
const facebook_client_1 = require("./clients/facebook.client");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const auth_helper_1 = require("./auth.helper");
const types_1 = require("../../../libs/types/src");
const common_2 = require("../../../libs/dtos/src/common");
const mail_service_1 = require("../mail/mail.service");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const user_transaction_actiontypes_entity_1 = require("../user/entities/user.transaction.actiontypes.entity");
const token_entity_1 = require("./entities/token.entity");
const uuid_1 = require("uuid");
const google_client_1 = require("./clients/google.client");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const chat_entity_1 = require("../chat/entities/chat.entity");
const bonusCode_entity_1 = require("./entities/bonusCode.entity");
const attachment_entity_1 = require("../chat/entities/attachment.entity");
const scheduleMessage_entity_1 = require("./entities/scheduleMessage.entity");
const contactSupport_entity_1 = require("../user/entities/contactSupport.entity");
let AuthService = class AuthService {
    constructor(jwt, entity, cloudinary) {
        this.entity = entity;
        this.cloudinary = cloudinary;
        this.jwt = jwt;
        this.scheduleStarterMessage();
    }
    async registerUser(body) {
        const { email, password, age } = body;
        let user = await this.repository.findOne({ where: { email } });
        if (user) {
            throw new common_1.HttpException('User already exit!', common_1.HttpStatus.CONFLICT);
        }
        user = new user_entity_1.User(Object.assign({}, body));
        const hashedPassword = await this.helper.encodePassword(password);
        user.setPassword(hashedPassword);
        const profile = new customer_profiledata_entity_1.CustomerProfileData();
        this.userService.validateAndSaveDOB(profile, this.helper.calculateBirthday(age));
        user.profile = profile;
        await this.profile.save(profile);
        const newUser = await this.repository.save(user);
        await this.userService.validateAndSaveAddress(body.zipCode, user);
        await this.userService.addTransactions(types_1.TransactionActionTypes.ACCOUNTCREATION, newUser, this.entity, user_account_transaction_entity_1.UserAccountTransaction, user_transaction_actiontypes_entity_1.UserTransactionActionTypes);
        const { productName, backendUrl } = this.configService.get(types_1.ConfigEnum.SERVER);
        const token = this.jwt.sign({ id: (await newUser).id });
        this.mailService.sendVerificationMail(user.email, {
            authLoginLink: `${backendUrl}/auth/verify?token=${token}`,
            firstName: user.userName,
            productName,
        });
        return newUser;
    }
    async socialLogin(body) {
        const { socialProvider } = body;
        if (socialProvider == types_1.SocialProviderEnum.GOOGLE) {
            return this.googleClient.validate(body);
        }
        if (socialProvider == types_1.SocialProviderEnum.FACEBOOK) {
            return await this.facebookClient.saveUserInfo(body);
        }
    }
    async registerAdminMod(body) {
        const { email, password } = body;
        let user = await this.repository.findOne({ where: { email } });
        if (user) {
            throw new common_1.HttpException('User already exit!', common_1.HttpStatus.CONFLICT);
        }
        user = new user_entity_1.User(Object.assign({}, body));
        const hashedPassword = await this.helper.encodePassword(password);
        user.setPassword(hashedPassword);
        const newUser = this.repository.save(user);
        const { productName, backendUrl } = this.configService.get(types_1.ConfigEnum.SERVER);
        const token = this.jwt.sign({ id: (await newUser).id });
        this.mailService.sendVerificationMail(user.email, {
            authLoginLink: `${backendUrl}/auth/verify?token=${token}`,
            firstName: user.firstName,
            productName,
        });
        return await newUser;
    }
    async login(body) {
        const { email, password } = body;
        const user = await this.repository.findOne({ where: { email } });
        if (!user || (user.role === types_1.UserRoleEnum.CUSTOMER && user.disable === true)) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!user || (user.role === types_1.UserRoleEnum.CUSTOMER && user.status === types_1.UserStatusEnum.UNVERIFIED)) {
            return user;
        }
        if (user.role === types_1.UserRoleEnum.MODERATOR && user.status === types_1.UserStatusEnum.BLOCK) {
            throw new common_1.HttpException('User is Blocked', common_1.HttpStatus.NOT_FOUND);
        }
        const isPasswordValid = this.helper.isPasswordValid(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.HttpException('Password Invalid!', common_1.HttpStatus.NOT_FOUND);
        }
        delete user.password;
        return new dtos_1.AuthorizeResponseDto(user, this.helper.generateToken(user));
    }
    async updateUserAccess(updateAccessDto) {
        const user = await this.repository.findOne({
            where: { id: updateAccessDto.userId },
        });
        if (!user)
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        user.setRole(updateAccessDto.role);
        await this.repository.save(user);
        let message = '';
        if (updateAccessDto.role === types_1.UserRoleEnum.MODERATOR) {
            message = 'User Role Successfully updated to Moderator!';
        }
        if (updateAccessDto.role === types_1.UserRoleEnum.ADMIN) {
            message = 'User Role Successfully updated to Admin!';
        }
        if (updateAccessDto.role === types_1.UserRoleEnum.CUSTOMER) {
            message = 'User Role Successfully updated to Member!';
        }
        return new common_2.GlobalResponseDto(message);
    }
    async updateUserStatus(updateStatusDto) {
        const user = await this.repository.findOne({
            where: { id: updateStatusDto.userId },
        });
        if (!user)
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        user.setStatus(updateStatusDto.status);
        await this.repository.save(user);
        const message = updateStatusDto.status === types_1.UserStatusEnum.VERIFIED
            ? 'User Successfully activated!'
            : 'User Successfully deactivated!';
        return new common_2.GlobalResponseDto(message);
    }
    async updateModeratorStatus(updateStatusDto) {
        let message = '';
        const user = await this.repository.findOne({
            where: {
                id: updateStatusDto.userId,
            },
        });
        if (!user)
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        if (user.role === types_1.UserRoleEnum.MODERATOR) {
            user.setStatus(updateStatusDto.status);
            await this.repository.save(user);
            if (updateStatusDto.status === types_1.UserStatusEnum.BLOCK) {
                message = 'Moderator Successfully blocked!';
            }
            else {
                throw new common_1.HttpException('Status can only be Block!', common_1.HttpStatus.CONFLICT);
            }
            return new common_2.GlobalResponseDto(message);
        }
        else {
            throw new common_1.HttpException('Blocking user must be moderator!', common_1.HttpStatus.CONFLICT);
        }
    }
    async getAllUsers() {
        const users = await this.repository.find({
            where: { disable: false, role: (0, typeorm_1.In)([types_1.UserRoleEnum.FAKE, types_1.UserRoleEnum.CUSTOMER]) },
        });
        users.forEach((user) => {
            delete user.password;
        });
        return users;
    }
    async getUserByMail(email) {
        const user = await this.repository.findOne({
            where: { disable: false, role: types_1.UserRoleEnum.CUSTOMER, email },
        });
        return user;
    }
    async getUserByVerificationToken(token) {
        const secret = this.configService.get(types_1.ConfigEnum.JWT_TOKEN).secret;
        const user = this.jwt.verify(token, { secret });
        return await this.repository.findOneBy({ id: user === null || user === void 0 ? void 0 : user.id });
    }
    async verifyEmail(token, res) {
        var _a;
        try {
            const user = await this.getUserByVerificationToken(token);
            if (!user) {
                throw new common_1.HttpException('No user found', common_1.HttpStatus.NOT_FOUND);
            }
            const pid = (_a = user === null || user === void 0 ? void 0 : user.profile) === null || _a === void 0 ? void 0 : _a.id;
            const data = await this.profile.findOneBy({ id: pid });
            if (user.profile.isEmailVerified === types_1.UserStatusEnum.UNVERIFIED) {
                let currentCoins = await this.userService.getCurrentCoinsFromDB(user);
                currentCoins += await this.userService.getActionTypeCostFromDB(types_1.TransactionActionTypes.EMAILCONFIRMED);
                await this.userService.transaction(user, currentCoins, types_1.TransactionActionTypes.EMAILCONFIRMED);
            }
            data.isEmailVerified = types_1.UserStatusEnum.VERIFIED;
            await this.profile.save(data);
            const updateStatusDto = {
                userId: user.id,
                status: types_1.UserStatusEnum.VERIFIED,
            };
            await this.updateUserStatus(updateStatusDto);
            const { frontendUrlClient, frontendUrlAdmin, frontendUrlModerator, authLoginLink, productName } = this.configService.get(types_1.ConfigEnum.SERVER);
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
            if (user.role === types_1.UserRoleEnum.CUSTOMER) {
                return res.redirect(`${frontendUrlClient}`);
            }
            if (user.role === types_1.UserRoleEnum.MODERATOR) {
                return res.redirect(`${frontendUrlModerator}`);
            }
            if (user.role === types_1.UserRoleEnum.ADMIN) {
                return res.redirect(`${frontendUrlAdmin}`);
            }
        }
        catch (error) {
            return res.status(500).send('Internal server error');
        }
    }
    async verifyProfile(id) {
        try {
            const user = await this.repository.findOneBy({ id });
            if (!user) {
                throw new common_1.HttpException('No user found', common_1.HttpStatus.NOT_FOUND);
            }
            const pid = user.profile.id;
            const data = await this.profile.findOneBy({ id: pid });
            data.isProfileVerified = types_1.CustomerProfileEnum.VERIFIED;
            let currentCoins = await this.userService.getCurrentCoinsFromDB(user);
            currentCoins += await this.userService.getActionTypeCostFromDB(types_1.TransactionActionTypes.PROFILEVERIFIED);
            await this.userService.transaction(user, currentCoins, types_1.TransactionActionTypes.PROFILEVERIFIED);
            return await this.profile.save(data);
        }
        catch (error) {
        }
    }
    async forget(email) {
        const user = await this.repository.findOne({ where: { email } });
        if (user && user.role === types_1.UserRoleEnum.CUSTOMER && user.status === types_1.UserStatusEnum.UNVERIFIED) {
            console.log(user);
            throw new common_1.HttpException('User needs Verification!', common_1.HttpStatus.NOT_FOUND);
        }
        if (!user || (user.role === types_1.UserRoleEnum.CUSTOMER && user.disable === true)) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const oldToken = await this.tokenRepository.find({
            where: { userId: user.id },
        });
        await this.tokenRepository.remove(oldToken);
        const newToken = (0, uuid_1.v4)();
        const token = new token_entity_1.Token({
            userId: user.id,
            token: newToken,
        });
        await this.tokenRepository.save(token);
        const { productName, frontendUrlClient } = this.configService.get(types_1.ConfigEnum.SERVER);
        this.mailService.sendResetPasswordMail(user.email, {
            authOtpVerificationLink: `${frontendUrlClient}/auth/reset-password?token=${token.token}`,
            firstName: user.firstName,
            productName,
        });
        return new common_2.GlobalResponseDto(`Please check email. Reset Password link sent to ${user.email}, If not wait for a few minutes`);
    }
    async resetPassword(token, { newPassword }) {
        try {
            const verifyToken = await this.tokenRepository.findOne({ where: { token } });
            const user = await this.repository.findOne({ where: { id: verifyToken.userId } });
            if (!user || (user.role === types_1.UserRoleEnum.CUSTOMER && user.disable === true)) {
                throw new common_1.HttpException('No user found', common_1.HttpStatus.NOT_FOUND);
            }
            if (user.role === types_1.UserRoleEnum.CUSTOMER && user.status === types_1.UserStatusEnum.UNVERIFIED) {
                throw new common_1.HttpException('User needs approval!', common_1.HttpStatus.NOT_FOUND);
            }
            const hashedPassword = await this.helper.encodePassword(newPassword);
            user.setPassword(hashedPassword);
            await this.repository.save(user);
            const oldToken = await this.tokenRepository.find({
                where: { userId: user.id },
            });
            await this.tokenRepository.remove(oldToken);
        }
        catch (err) {
            throw new common_1.HttpException('Invalid or expired token', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        return new common_2.GlobalResponseDto('Password reset successfully!');
    }
    async onlineUsers(token) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('user must be admin', common_1.HttpStatus.UNAUTHORIZED);
            const users = await this.repository.find({
                where: {
                    role: (0, typeorm_1.In)([types_1.UserRoleEnum.CUSTOMER, types_1.UserRoleEnum.MODERATOR]),
                    online: true,
                    disable: false,
                },
            });
            const obj = {
                moderators: users.filter((user) => user.role === types_1.UserRoleEnum.MODERATOR),
                customers: users.filter((user) => user.role === types_1.UserRoleEnum.CUSTOMER),
            };
            return obj;
        }
        catch (error) {
            throw new common_1.HttpException('Could not find online users', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async saveEmojis(token, file) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('user must be admin', common_1.HttpStatus.UNAUTHORIZED);
            let result;
            let url;
            if (file) {
                result = await this.cloudinary.uploadImage(file, 'emojis').catch(() => {
                    throw new common_1.HttpException('Invalid file type.', common_1.HttpStatus.BAD_REQUEST);
                });
                url = result.url;
            }
        }
        catch (error) {
            throw new common_1.HttpException('Could not find online users', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getEmojis(token) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.CUSTOMER)
                throw new common_1.HttpException('user must be Customer', common_1.HttpStatus.UNAUTHORIZED);
            const result = await this.cloudinary.getFolderImagesUrls('emojis').catch(() => {
                throw new common_1.HttpException('Invalid file type.', common_1.HttpStatus.BAD_REQUEST);
            });
            return result;
        }
        catch (error) {
            throw new common_1.HttpException('Could not find Emojis', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getUserStats(token) {
        try {
            const tokenValue = token.split(' ')[1];
            const duration = 'monthly';
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            const mods = await this.getMods(token);
            return await Promise.all(mods.map(async (mod) => {
                const repliesFromUser = await this.chatService.statsModGotRepliesFromUser({ mod, duration });
                const sentToUser = await this.chatService.statsModGotSentToUser({ mod, duration });
                return {
                    mod: mod,
                    repliesFromUser: repliesFromUser,
                    sentToUser: sentToUser,
                };
            }));
        }
        catch (error) {
            throw new common_1.HttpException('Could not fetch data', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getMods(token) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('user must be Customer', common_1.HttpStatus.UNAUTHORIZED);
            return await this.repository.find({
                where: {
                    role: types_1.UserRoleEnum.MODERATOR,
                    disable: false,
                },
            });
        }
        catch (error) {
            throw new common_1.HttpException('Could not find users', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getModSendMessageStats(token, params) {
        try {
            const { mod, duration } = params;
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            const mods = await this.getMods(token);
            return await Promise.all(mods.map(async (mod) => {
                return await this.chatService.statsModGotSentToUser({ mod, duration });
            }));
        }
        catch (error) {
            throw new common_1.HttpException('Could not fetch data', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createBulkMessages(token, fakeUserId, customerUserIds, message, file) {
        try {
            token = token.includes('Bearer') ? token.split(' ')[1] : token;
            const decoded = await this.helper.decode(token);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('User must be Admin!', common_1.HttpStatus.NOT_FOUND);
            const customerUsers = await this.repository.find({ where: { id: (0, typeorm_1.In)(customerUserIds.split(',')) } });
            const fakeUser = await this.userService.getCustomer(fakeUserId);
            if (fakeUser.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('User must be Admin Support Account!', common_1.HttpStatus.UNAUTHORIZED);
            const Chats = [];
            for (const customerUser of customerUsers) {
                const chat = new chat_entity_1.Chat();
                const fakeChat = new fakeChat_entity_1.FakeChat();
                chat.sender = fakeUser.id;
                chat.receiver = customerUser.id;
                chat.message = message;
                chat.seen = false;
                const savedChat = await this.chatRepo.save(chat);
                fakeChat.moderatorId = user.id;
                fakeChat.chat = savedChat;
                fakeChat.type = user.role;
                if (file) {
                    const res = await this.cloudinary.uploadFile(file === null || file === void 0 ? void 0 : file.buffer, 'chat');
                    const attachmentEntity = new attachment_entity_1.Attachment();
                    attachmentEntity.fileUrl = res === null || res === void 0 ? void 0 : res.url;
                    attachmentEntity.fileName = file === null || file === void 0 ? void 0 : file.originalname;
                    attachmentEntity.fileType = file === null || file === void 0 ? void 0 : file.mimetype;
                    attachmentEntity.chat = savedChat;
                    await this.attachmentRepository.save(attachmentEntity);
                }
                Chats.push(savedChat);
                await this.fakeChat.save(fakeChat);
                this.chatService.detectFakeAndSendMail(fakeUser === null || fakeUser === void 0 ? void 0 : fakeUser.id, customerUser === null || customerUser === void 0 ? void 0 : customerUser.id, message);
            }
            return await this.chatRepo.save(Chats);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async createMod(token, modDto) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = await this.helper.validateUser(decoded);
        if (!user)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        if (modDto.email === '')
            throw new common_1.HttpException('Email should not be empty!', common_1.HttpStatus.BAD_REQUEST);
        if (user.role !== types_1.UserRoleEnum.ADMIN)
            throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
        const mod = await this.repository.findOne({ where: { email: modDto.email } });
        if (mod) {
            throw new common_1.HttpException('User already exit!', common_1.HttpStatus.CONFLICT);
        }
        const newMod = new user_entity_1.User({
            userName: modDto === null || modDto === void 0 ? void 0 : modDto.userName,
            email: modDto === null || modDto === void 0 ? void 0 : modDto.email,
            role: types_1.UserRoleEnum.MODERATOR,
            status: types_1.UserStatusEnum.ACTIVE,
        });
        const hashedPassword = await this.helper.encodePassword(modDto === null || modDto === void 0 ? void 0 : modDto.password);
        newMod.setPassword(hashedPassword);
        return await this.repository.save(newMod);
    }
    async getMod(token, id) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = await this.helper.validateUser(decoded);
        if (!user)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        if (user.role !== types_1.UserRoleEnum.ADMIN)
            throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
        const mod = await this.repository.findOne({ where: { id } });
        if (!mod) {
            throw new common_1.HttpException('Moderator not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return mod;
    }
    async deleteModById(token, id) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = await this.helper.validateUser(decoded);
        if (!user)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        if (user.role !== types_1.UserRoleEnum.ADMIN)
            throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
        const mod = await this.repository.findOneBy({ id });
        if (mod == null) {
            throw new common_1.HttpException('Mod Account not found!', common_1.HttpStatus.NOT_FOUND);
        }
        await this.repository.remove(mod);
        return new common_2.GlobalResponseDto('User Deleted successfully');
    }
    async updateModById(token, id, body) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = await this.helper.validateUser(decoded);
        if (!user)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        if (user.role !== types_1.UserRoleEnum.ADMIN)
            throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
        const mod = await this.repository.findOneBy({ id });
        if (mod == null) {
            throw new common_1.HttpException('Mod Account not found!', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            if (body.userName)
                mod.setUserName(body.userName);
            if (body.email) {
                if (body.email !== mod.email) {
                    const exists = await this.repository.findOneBy({ email: body.email });
                    if (!exists) {
                        mod.setEmail(body.email);
                    }
                    else {
                        throw new common_1.HttpException('Email already taken!', common_1.HttpStatus.CONFLICT);
                    }
                }
            }
        }
        return await this.repository.save(mod);
    }
    async createBonusCode(token, bonusCodeDto) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = await this.helper.validateUser(decoded);
        if (!user)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        if (user.role !== types_1.UserRoleEnum.ADMIN)
            throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
        const bonus = await this.bonusRepo.findOne({ where: { bonusCode: bonusCodeDto.bonusCode } });
        if (bonus) {
            throw new common_1.HttpException('Bonus Code already exit!', common_1.HttpStatus.CONFLICT);
        }
        const bonusCode = new bonusCode_entity_1.BonusCode();
        bonusCode.bonusCode = bonusCodeDto.bonusCode;
        bonusCode.coins = bonusCodeDto.bonusCoins;
        bonusCode.expiryDate = bonusCodeDto.expiryDate;
        bonusCode.creator = user;
        return await this.bonusRepo.save(bonusCode);
    }
    async updateBonusCode(token, id, expiryDate) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = await this.helper.validateUser(decoded);
        if (!user)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        if (user.role !== types_1.UserRoleEnum.ADMIN)
            throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
        const bonus = await this.bonusRepo.findOne({ where: { id } });
        if (bonus) {
            bonus.setExpiryDate(expiryDate);
            return await this.bonusRepo.save(bonus);
        }
        else {
            throw new common_1.HttpException('Bonus Code not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getAllBonusCodes(token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = await this.helper.validateUser(decoded);
        if (!user)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        if (user.role !== types_1.UserRoleEnum.ADMIN)
            throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
        return await this.bonusRepo.find();
    }
    async deleteBonusCodeById(token, id) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = await this.helper.validateUser(decoded);
        if (!user)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        if (user.role !== types_1.UserRoleEnum.ADMIN)
            throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
        const bonus = await this.bonusRepo.findOne({ where: { id } });
        if (!bonus)
            throw new common_1.HttpException('Bonus Code NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        const res = await this.bonusRepo.remove(bonus);
        if (res)
            return new common_2.GlobalResponseDto('Bonus Code Deleted Successfully');
        else {
            return new common_2.GlobalResponseDto('Bonus Code Could not be deleted');
        }
    }
    async scheduleMessage(token, body) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
            const { gender, nickname, online, startAge, endAge, distanceInMiles, newUsers, fsk, postalCode } = body;
            const filters = JSON.parse(`{"gender": "${gender !== null && gender !== void 0 ? gender : null}", "nickname": "${nickname !== null && nickname !== void 0 ? nickname : null}", "online": "${online !== null && online !== void 0 ? online : null}", "startAge": "${startAge !== null && startAge !== void 0 ? startAge : null}", "endAge": "${endAge !== null && endAge !== void 0 ? endAge : null}", "distanceInMiles": "${distanceInMiles !== null && distanceInMiles !== void 0 ? distanceInMiles : null}", "newUsers": "${newUsers !== null && newUsers !== void 0 ? newUsers : null}", "fsk": "${fsk !== null && fsk !== void 0 ? fsk : null}", "postalCode": "${postalCode !== null && postalCode !== void 0 ? postalCode : null}"}`);
            const scheduleMessage = this.scheduleMessageRepo.create(Object.assign(Object.assign({}, body), { filters }));
            return await this.scheduleMessageRepo.save(scheduleMessage);
        }
        catch (error) {
            throw new common_1.HttpException('could not schedule message', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getScheduledMessage(token) {
        try {
            if (token) {
                const tokenValue = token.split(' ')[1];
                const decoded = await this.helper.decode(tokenValue);
                const user = await this.helper.validateUser(decoded);
                if (!user)
                    throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
                if (user.role !== types_1.UserRoleEnum.ADMIN)
                    throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
            }
            return await this.scheduleMessageRepo.find();
        }
        catch (error) {
            throw new common_1.HttpException('could not get scheduled message', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteScheduledMessage(token, id) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
            const scheduleMessage = await this.scheduleMessageRepo.findOne({ where: { id } });
            if (!scheduleMessage)
                throw new common_1.HttpException('Schedule Message NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            const res = await this.scheduleMessageRepo.remove(scheduleMessage);
            if (res)
                return new common_2.GlobalResponseDto('Schedule Message Deleted Successfully');
            else {
                return new common_2.GlobalResponseDto('Schedule Message deleted');
            }
        }
        catch (error) {
            throw new common_1.HttpException('Schedule Message not be deleted', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendSpamMessages(token, body, file) {
        try {
            const { message, fakeUserId, customerUserIds } = body;
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
            const usernameRegex = /%username%/gi;
            const userCityRegex = /%usercity%/gi;
            const userAgeRegex = /%userage%/gi;
            const mods = await this.repository.find({ where: { role: types_1.UserRoleEnum.MODERATOR } });
            if (mods.length === 0)
                throw new common_1.HttpException('Create at least a Moderator first!', common_1.HttpStatus.SEE_OTHER);
            const customerUsers = await this.repository.find({ where: { id: (0, typeorm_1.In)(customerUserIds.split(',')) } });
            const fake = await this.chatService.findUserById(fakeUserId);
            for (const customerUser of customerUsers) {
                let userAgeMessage = message;
                if (customerUser.userName) {
                    userAgeMessage = userAgeMessage.replace(usernameRegex, customerUser.userName);
                }
                if (customerUser.address && customerUser.address.address) {
                    const coordinates = await this.userService.getCoordinatesFromAddress(customerUser.address.address);
                    const cityName = coordinates[2];
                    userAgeMessage = userAgeMessage.replace(userCityRegex, cityName);
                }
                if (customerUser.profile && customerUser.profile.dateOfBirth) {
                    const now = new Date();
                    const ageInMs = now.getTime() - customerUser.profile.dateOfBirth.getTime();
                    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
                    userAgeMessage = userAgeMessage.replace(userAgeRegex, ageInYears.toString());
                }
                const chat = new chat_entity_1.Chat();
                const fakeChat = new fakeChat_entity_1.FakeChat();
                chat.sender = fake.id;
                chat.receiver = customerUser.id;
                chat.message = userAgeMessage;
                chat.seen = false;
                const savedChat = await this.chatRepo.save(chat);
                fakeChat.moderatorId = user.id;
                fakeChat.chat = savedChat;
                fakeChat.type = user.role;
                await this.fakeChat.save(fakeChat);
                if (file) {
                    const res = await this.cloudinary.uploadFile(file === null || file === void 0 ? void 0 : file.buffer, 'chat');
                    const attachmentEntity = new attachment_entity_1.Attachment();
                    attachmentEntity.fileUrl = res === null || res === void 0 ? void 0 : res.url;
                    attachmentEntity.fileName = file === null || file === void 0 ? void 0 : file.originalname;
                    attachmentEntity.fileType = file === null || file === void 0 ? void 0 : file.mimetype;
                    attachmentEntity.chat = savedChat;
                    await this.attachmentRepository.save(attachmentEntity);
                }
                this.chatService.detectFakeAndSendMail(fakeUserId, customerUser === null || customerUser === void 0 ? void 0 : customerUser.id, message);
            }
            return new common_2.GlobalResponseDto('Messages Sent Successfully');
        }
        catch (error) {
            throw new common_1.HttpException(error.response, error.status);
        }
    }
    scheduleStarterMessage() {
        schedule.scheduleJob('* * * * *', async () => {
            try {
                await this.cleanQueries();
                this.sendMessageToUsers();
            }
            catch (error) {
                console.error('An error occurred:', error);
            }
        });
    }
    async detectAndReturnNewUser() {
        const adminUserIds = await this.getAdminUserIds();
        const usersWithoutAdminSender = await this.repository
            .createQueryBuilder('user')
            .where('user.role = :role', { role: types_1.UserRoleEnum.CUSTOMER })
            .andWhere('user.id NOT IN (SELECT chat.receiver FROM chat WHERE chat.sender = :adminId)', {
            adminId: adminUserIds,
        })
            .getMany();
        return usersWithoutAdminSender;
    }
    async getAdminUserIds() {
        const adminUsers = await this.repository.findBy({ role: types_1.UserRoleEnum.ADMIN });
        const adminUserIds = adminUsers.map((adminUser) => adminUser.id);
        return adminUserIds;
    }
    async sendMessageToUsers() {
        var _a;
        const users = await this.detectAndReturnNewUser();
        const scheduledMessages = await this.getScheduledMessage();
        for (const scheduledMessage of scheduledMessages) {
            const { time, message, filters } = scheduledMessage;
            const minutes = parseInt(time);
            const params = {
                nickname: filters === null || filters === void 0 ? void 0 : filters.nickname,
                endAge: filters === null || filters === void 0 ? void 0 : filters.endAge,
                startAge: filters === null || filters === void 0 ? void 0 : filters.startAge,
                postalCode: filters === null || filters === void 0 ? void 0 : filters.postalCode,
                gender: filters === null || filters === void 0 ? void 0 : filters.gender,
                schedule: true,
            };
            const queryUsers = await this.userService.findAll(null, params);
            const fakeUsers = (_a = queryUsers === null || queryUsers === void 0 ? void 0 : queryUsers.data) === null || _a === void 0 ? void 0 : _a.filter((user) => user.role === types_1.UserRoleEnum.FAKE);
            const randFake = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
            for (const user of users) {
                const createdTime = new Date(user.createdAt);
                const currentTime = new Date();
                const elapsedMinutes = Math.floor((currentTime - createdTime) / (1000 * 60));
                if (elapsedMinutes === minutes) {
                    await this.sendMessage(user, message, randFake);
                }
            }
        }
    }
    async sendMessage(receiver, message, sender) {
        const usernameRegex = /%username%/gi;
        const userCityRegex = /%usercity%/gi;
        const userAgeRegex = /%userage%/gi;
        let userAgeMessage = message;
        if (receiver.userName) {
            userAgeMessage = userAgeMessage.replace(usernameRegex, receiver.userName);
        }
        if (receiver.address && receiver.address.address) {
            const coordinates = await this.userService.getCoordinatesFromAddress(receiver.address.address);
            const cityName = coordinates[2];
            userAgeMessage = userAgeMessage.replace(userCityRegex, cityName);
        }
        if (receiver.profile && receiver.profile.dateOfBirth) {
            const now = new Date();
            const ageInMs = now.getTime() - receiver.profile.dateOfBirth.getTime();
            const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
            userAgeMessage = userAgeMessage.replace(userAgeRegex, ageInYears.toString());
        }
        const chat = new chat_entity_1.Chat();
        chat.sender = sender.id;
        chat.receiver = receiver.id;
        chat.message = userAgeMessage;
        chat.seen = false;
        await this.chatRepo.save(chat);
    }
    async getStats(token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = await this.helper.validateUser(decoded);
        if (!user)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        if (user.role !== types_1.UserRoleEnum.ADMIN)
            throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
        const { moderators, customers } = await this.onlineUsers(token);
        const newVerifiedUsers = await this.newVerifiedCustomers();
        const emailsSentToday = await this.emailsSentToday();
        const { today, currentMonth, lastMonth, percentageChange, yesterday } = await this.getSales();
        const stats = await this.getUserStats(token);
        const openMessages = await this.getOpenMessages();
        return {
            onlineMods: moderators,
            onlineUsers: customers,
            newVerifiedUsers,
            emailsSentToday,
            sales: {
                today,
                yesterday,
                percentageChange: `${percentageChange}%`,
                currentMonth,
                lastMonth,
            },
            MessageStats: stats,
            openMessages,
        };
    }
    async newVerifiedCustomers() {
        const currentTime = new Date();
        const startOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 0, 0, 0);
        const endOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 23, 59, 59);
        const newVerifiedUsers = await this.repository
            .createQueryBuilder('user')
            .where('user.status = :status', { status: types_1.UserStatusEnum.VERIFIED })
            .andWhere('user.createdAt >= :startOfDay', { startOfDay })
            .andWhere('user.createdAt <= :endOfDay', { endOfDay })
            .getMany();
        return newVerifiedUsers;
    }
    async emailsSentToday() {
        const currentTime = new Date();
        const startOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 0, 0, 0);
        const endOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 23, 59, 59);
        const emails = await this.emailRepo
            .createQueryBuilder('email')
            .andWhere('email.createdAt >= :startOfDay', { startOfDay })
            .andWhere('email.createdAt <= :endOfDay', { endOfDay })
            .getCount();
        return emails;
    }
    async getSales() {
        const currentTime = new Date();
        const startOfToday = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 0, 0, 0);
        const endOfToday = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 23, 59, 59);
        const startOfCurrentMonth = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1, 0, 0, 0);
        const endOfCurrentMonth = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0, 23, 59, 59);
        const startOfLastMonth = new Date(currentTime.getFullYear(), currentTime.getMonth() - 1, 1, 0, 0, 0);
        const endOfLastMonth = new Date(currentTime.getFullYear(), currentTime.getMonth(), 0, 23, 59, 59);
        const startOfYesterday = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() - 1, 0, 0, 0);
        const endOfYesterday = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() - 1, 23, 59, 59);
        const todayQuery = await this.paymentsRepo
            .createQueryBuilder('payments')
            .select('SUM(payments.amount)', 'totalAmount')
            .where('payments.timestamp >= :startOfDay AND payments.timestamp <= :endOfDay', {
            startOfDay: startOfToday,
            endOfDay: endOfToday,
        })
            .getRawOne();
        const todayTotalAmount = todayQuery ? todayQuery.totalAmount : 0;
        const yesterdayQuery = await this.paymentsRepo
            .createQueryBuilder('payments')
            .select('SUM(payments.amount)', 'totalAmount')
            .where('payments.timestamp >= :startOfYesterday AND payments.timestamp <= :endOfYesterday', {
            startOfYesterday,
            endOfYesterday,
        })
            .getRawOne();
        const yesterdayTotalAmount = yesterdayQuery ? yesterdayQuery.totalAmount : 0;
        const currentMonthQuery = await this.paymentsRepo
            .createQueryBuilder('payments')
            .select('SUM(payments.amount)', 'totalAmount')
            .where('payments.timestamp >= :startOfMonth AND payments.timestamp <= :endOfMonth', {
            startOfMonth: startOfCurrentMonth,
            endOfMonth: endOfCurrentMonth,
        })
            .getRawOne();
        const currentMonthTotalAmount = currentMonthQuery ? currentMonthQuery.totalAmount : 0;
        const lastMonthQuery = await this.paymentsRepo
            .createQueryBuilder('payments')
            .select('SUM(payments.amount)', 'totalAmount')
            .where('payments.timestamp >= :startOfMonth AND payments.timestamp <= :endOfMonth', {
            startOfMonth: startOfLastMonth,
            endOfMonth: endOfLastMonth,
        })
            .getRawOne();
        const lastMonthTotalAmount = lastMonthQuery ? lastMonthQuery.totalAmount : 0;
        const percentageChange = ((todayTotalAmount - yesterdayTotalAmount) / yesterdayTotalAmount) * 100;
        return {
            today: todayTotalAmount,
            yesterday: yesterdayTotalAmount,
            percentageChange,
            currentMonth: currentMonthTotalAmount,
            lastMonth: lastMonthTotalAmount,
        };
    }
    async getQueries(token) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN && user.role !== types_1.UserRoleEnum.CUSTOMER)
                throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
            return await this.contactSupportRepo.find({
                relations: ['user'],
            });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async getSpecifiCustomerQueries(token) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN && user.role !== types_1.UserRoleEnum.CUSTOMER)
                throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
            return await this.contactSupportRepo.find({
                where: {
                    user: { id: user.id },
                },
            });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async updateQueryStatus(token, body) {
        try {
            const { id, status } = body;
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('user must be Admin', common_1.HttpStatus.UNAUTHORIZED);
            const foundQuery = await this.contactSupportRepo.findOne({
                where: {
                    id,
                },
                relations: ['user'],
            });
            if (!foundQuery)
                throw new common_1.HttpException('Query not found', common_1.HttpStatus.NOT_FOUND);
            foundQuery.status = status;
            return await this.contactSupportRepo.save(foundQuery);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async cleanQueries() {
        try {
            const queries = await this.contactSupportRepo.find();
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 7);
            for (const query of queries) {
                const createdAt = new Date(query.createdAt);
                const diff = createdAt <= currentDate;
                if (diff) {
                    await this.contactSupportRepo.remove(query);
                }
            }
        }
        catch (error) {
            console.error('An error occurred:', error);
        }
    }
    async getOpenMessages() {
        try {
            const mods = await this.repository.find({ where: { role: types_1.UserRoleEnum.MODERATOR } });
            const chats = await Promise.all(mods.map(async (mod) => {
                return await this.chatService.getModChatUsers(null, mod.id);
            }));
            return chats.length;
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException(error.status, error.message);
        }
    }
};
__decorate([
    (0, typeorm_2.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_3.Repository)
], AuthService.prototype, "repository", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(contactSupport_entity_1.ContactSupport),
    __metadata("design:type", typeorm_3.Repository)
], AuthService.prototype, "contactSupportRepo", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(email_entity_1.Email),
    __metadata("design:type", typeorm_3.Repository)
], AuthService.prototype, "emailRepo", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(customer_profiledata_entity_1.CustomerProfileData),
    __metadata("design:type", typeorm_3.Repository)
], AuthService.prototype, "profile", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(token_entity_1.Token),
    __metadata("design:type", typeorm_3.Repository)
], AuthService.prototype, "tokenRepository", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(chat_entity_1.Chat),
    __metadata("design:type", typeorm_3.Repository)
], AuthService.prototype, "chatRepo", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(fakeChat_entity_1.FakeChat),
    __metadata("design:type", typeorm_3.Repository)
], AuthService.prototype, "fakeChat", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(scheduleMessage_entity_1.ScheduleMessage),
    __metadata("design:type", typeorm_3.Repository)
], AuthService.prototype, "scheduleMessageRepo", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(attachment_entity_1.Attachment),
    __metadata("design:type", typeorm_3.Repository)
], AuthService.prototype, "attachmentRepository", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(bonusCode_entity_1.BonusCode),
    __metadata("design:type", typeorm_3.Repository)
], AuthService.prototype, "bonusRepo", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(payment_entity_1.Payments),
    __metadata("design:type", typeorm_3.Repository)
], AuthService.prototype, "paymentsRepo", void 0);
__decorate([
    (0, common_1.Inject)(auth_helper_1.AuthHelper),
    __metadata("design:type", auth_helper_1.AuthHelper)
], AuthService.prototype, "helper", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], AuthService.prototype, "mailService", void 0);
__decorate([
    (0, common_1.Inject)(user_service_1.UserService),
    __metadata("design:type", user_service_1.UserService)
], AuthService.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(chat_service_1.ChatService),
    __metadata("design:type", chat_service_1.ChatService)
], AuthService.prototype, "chatService", void 0);
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], AuthService.prototype, "configService", void 0);
__decorate([
    (0, common_1.Inject)(facebook_client_1.FacebookClient),
    __metadata("design:type", facebook_client_1.FacebookClient)
], AuthService.prototype, "facebookClient", void 0);
__decorate([
    (0, common_1.Inject)(google_client_1.GoogleClient),
    __metadata("design:type", google_client_1.GoogleClient)
], AuthService.prototype, "googleClient", void 0);
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, typeorm_1.EntityManager, cloudinary_config_1.CloudinaryConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map