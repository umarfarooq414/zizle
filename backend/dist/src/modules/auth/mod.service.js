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
exports.ModService = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const auth_helper_1 = require("./auth.helper");
const types_1 = require("../../../libs/types/src");
const chat_entity_1 = require("../chat/entities/chat.entity");
const visit_profile_entity_1 = require("../user/entities/visit.profile.entity");
const chat_gateway_1 = require("../chat/chat.gateway");
const notifications_entity_1 = require("../user/entities/notifications.entity");
let ModService = class ModService {
    async getUsers(token) {
        const tokenValue = token.includes('Bearer') ? token.split(' ')[1] : token;
        const decoded = await this.helper.decode(tokenValue);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (!user)
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        if (user.role !== types_1.UserRoleEnum.MODERATOR)
            throw new common_1.HttpException('User must be Moderator!', common_1.HttpStatus.NOT_FOUND);
        const users = await this.repository.find({
            where: {
                role: (0, typeorm_1.In)([types_1.UserRoleEnum.FAKE, types_1.UserRoleEnum.CUSTOMER]),
            },
        });
        const fakeUsers = { usersList: users, unseenFakeIds: await this.getUnseenMessageCount(token) };
        return fakeUsers;
    }
    async getUnseenMessageCount(token) {
        token = token.includes('Bearer') ? token.split(' ')[1] : token;
        const decoded = await this.helper.decode(token);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (!user)
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        if (user.role !== types_1.UserRoleEnum.MODERATOR)
            throw new common_1.HttpException('User must be Moderator!', common_1.HttpStatus.NOT_FOUND);
        const customerRoleUsers = await this.repository.find({ where: { role: types_1.UserRoleEnum.CUSTOMER } });
        const fakeRoleUsers = await this.repository.find({ where: { role: types_1.UserRoleEnum.FAKE } });
        const fakeRoleUserIds = fakeRoleUsers.map((user) => user.id);
        const userRoleUserIds = customerRoleUsers.map((user) => user.id);
        const messagesToFakeRoleUsers = await this.chatRepository
            .createQueryBuilder('chat')
            .where('chat.sender IN (:...userRoleUserIds)', { userRoleUserIds })
            .andWhere('chat.receiver IN (:...fakeRoleUserIds)', { fakeRoleUserIds })
            .andWhere('chat.seen = :seen', { seen: false })
            .getMany();
        const fakesIds = messagesToFakeRoleUsers.map((user) => user.receiver);
        const distinctFake = [...new Set(fakesIds.map((item) => item))];
        return distinctFake;
    }
    async createBulkProfileVisits(token, fakeUserIds, customerUserIds) {
        try {
            token = token.includes('Bearer') ? token.split(' ')[1] : token;
            const decoded = await this.helper.decode(token);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.MODERATOR)
                throw new common_1.HttpException('User must be Moderator!', common_1.HttpStatus.NOT_FOUND);
            const allUserIds = [...fakeUserIds, ...customerUserIds];
            const allUsers = await this.repository.find({ where: { id: (0, typeorm_1.In)(allUserIds) } });
            let fakeUsers = allUsers === null || allUsers === void 0 ? void 0 : allUsers.filter((user) => fakeUserIds === null || fakeUserIds === void 0 ? void 0 : fakeUserIds.includes(user.id));
            const customerUsers = allUsers === null || allUsers === void 0 ? void 0 : allUsers.filter((user) => customerUserIds === null || customerUserIds === void 0 ? void 0 : customerUserIds.includes(user.id));
            const profileVisits = [];
            if ((customerUsers === null || customerUsers === void 0 ? void 0 : customerUsers.length) < (fakeUsers === null || fakeUsers === void 0 ? void 0 : fakeUsers.length)) {
                const numFakeUsersToUse = customerUsers === null || customerUsers === void 0 ? void 0 : customerUsers.length;
                const shuffledFakeUserIds = fakeUserIds === null || fakeUserIds === void 0 ? void 0 : fakeUserIds.sort(() => 0.5 - Math.random());
                const selectedFakeUserIds = shuffledFakeUserIds === null || shuffledFakeUserIds === void 0 ? void 0 : shuffledFakeUserIds.slice(0, numFakeUsersToUse);
                fakeUsers = allUsers === null || allUsers === void 0 ? void 0 : allUsers.filter((user) => selectedFakeUserIds === null || selectedFakeUserIds === void 0 ? void 0 : selectedFakeUserIds.includes(user.id));
            }
            for (const customerUser of customerUsers) {
                const fakeUserIndex = (profileVisits === null || profileVisits === void 0 ? void 0 : profileVisits.length) % (fakeUsers === null || fakeUsers === void 0 ? void 0 : fakeUsers.length);
                const fakeUser = fakeUsers[fakeUserIndex];
                const profileVisit = new visit_profile_entity_1.VisitProfile();
                profileVisit.visitor = fakeUser;
                profileVisit.visited = customerUser;
                profileVisit.creatorId = user.id;
                profileVisits.push(profileVisit);
                const notification = new notifications_entity_1.Notifications();
                notification.category = types_1.NotificationAction.VISITED;
                notification.seen = false;
                notification.notifier = fakeUser;
                notification.notified = customerUser;
                const message = `${fakeUser.userName} ${notification.category.toLowerCase()} your profile`;
                notification.message = message;
                await this.notificationsRepo.save(notification);
            }
            const res = await this.visitProfileRepo.save(profileVisits);
            if (res) {
                this.chatGateway.sendBulk(customerUserIds, res);
                return res;
            }
        }
        catch (error) {
            throw new common_1.HttpException('could not send bulk visits', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAvailableUsers(token) {
        token = token.includes('Bearer') ? token.split(' ')[1] : token;
        const decoded = await this.helper.decode(token);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (!user)
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        if (user.role !== types_1.UserRoleEnum.MODERATOR)
            throw new common_1.HttpException('User must be Moderator!', common_1.HttpStatus.NOT_FOUND);
        return await this.repository.find({
            where: {
                role: types_1.UserRoleEnum.CUSTOMER,
                online: true,
            },
        });
    }
};
__decorate([
    (0, typeorm_2.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_3.Repository)
], ModService.prototype, "repository", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(notifications_entity_1.Notifications),
    __metadata("design:type", typeorm_3.Repository)
], ModService.prototype, "notificationsRepo", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(chat_entity_1.Chat),
    __metadata("design:type", typeorm_3.Repository)
], ModService.prototype, "chatRepository", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(visit_profile_entity_1.VisitProfile),
    __metadata("design:type", typeorm_3.Repository)
], ModService.prototype, "visitProfileRepo", void 0);
__decorate([
    (0, common_1.Inject)(auth_helper_1.AuthHelper),
    __metadata("design:type", auth_helper_1.AuthHelper)
], ModService.prototype, "helper", void 0);
__decorate([
    (0, common_1.Inject)(chat_gateway_1.ChatsGateway),
    __metadata("design:type", chat_gateway_1.ChatsGateway)
], ModService.prototype, "chatGateway", void 0);
ModService = __decorate([
    (0, common_1.Injectable)()
], ModService);
exports.ModService = ModService;
//# sourceMappingURL=mod.service.js.map