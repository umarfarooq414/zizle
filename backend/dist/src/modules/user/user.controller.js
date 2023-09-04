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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const constants_1 = require("../../../libs/constants/src");
const dtos_1 = require("../../../libs/dtos/src");
const profile_1 = require("../../../libs/dtos/src/profile");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const user_1 = require("./../../../libs/types/src/db/entities/user");
const user_service_1 = require("./user.service");
const guards_1 = require("../../guards");
const types_1 = require("../../../libs/types/src");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async updateProfileById(id, body, files) {
        return await this.userService.updateInfoById(id, body, files);
    }
    async create(id, token, fakeId) {
        return this.userService.addToVisit(id, token, fakeId);
    }
    async getVisits(token) {
        return this.userService.getVisits(token);
    }
    async markFavorite(favoriteId, token) {
        return await this.userService.markFavorite(favoriteId, token);
    }
    async getFavorites(token) {
        return this.userService.getFavorites(token);
    }
    async getRandom(token) {
        return this.userService.getRandom(token);
    }
    async findAll(token, params) {
        return this.userService.findAll(token, params);
    }
    async getUser(userId) {
        return this.userService.getCustomer(userId);
    }
    async getEmailforoauth({ email }) {
        return await this.userService.getCustomerData(email);
    }
    async findDistance(userId, token) {
        return this.userService.getUsersDistance(userId, token);
    }
    async markBlock(userId, reason, token) {
        return await this.userService.markBlock(userId, token, reason);
    }
    async getBlockUsers(token) {
        return await this.userService.getBlocked(token);
    }
    async removeBlockUsers(userId, token) {
        return await this.userService.removeBlocked(userId, token);
    }
    async removeUser(token) {
        return await this.userService.removeUser(token);
    }
    async removePhoto(id, token) {
        return await this.userService.removePhoto(id, token);
    }
    async contactSupport(body) {
        return await this.userService.contactSupport(body);
    }
    async getCoins(token) {
        return await this.userService.getCoins(token);
    }
    async makeTransaction(token, body, bonus) {
        return await this.userService.makeTransaction(token, body.actionType, body.receiverId, body.subAction, bonus);
    }
    async getNotifications(token, params) {
        return this.userService.getNotifications(token, params);
    }
    async removeNotification(token, id) {
        return this.userService.seenNotification(token, id);
    }
    async removeNotifications(token) {
        return this.userService.seenNotifications(token);
    }
};
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter user id',
        type: 'string',
    }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'avatar' }, { name: 'photos' }])),
    (0, common_1.Put)('updateProfile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, profile_1.UpdateProfileRequestDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfileById", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter visiting profile id',
        type: 'string',
    }),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER, user_1.UserRoleEnum.MODERATOR),
    (0, common_1.Post)('visit-profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Query)('fake')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.Get)('profiles'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getVisits", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter favorite profile id',
        type: 'string',
    }),
    (0, common_1.Post)('favorite/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "markFavorite", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.Get)('favorites'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFavorites", null);
__decorate([
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER, user_1.UserRoleEnum.ADMIN),
    (0, common_1.Get)('getRandomUser'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getRandom", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER, user_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'gender', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'nickname', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'startAge', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endAge', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'distanceInKms', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'newUsers', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'fsk', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'postalCode', required: false, type: String }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.GetUsersQueryParamsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter user id',
        type: 'string',
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.Put)('email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.OauthRequestDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getEmailforoauth", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter user id',
        type: 'string',
    }),
    (0, common_1.Get)('distance/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findDistance", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter user id',
        type: 'string',
    }),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.Post)('block/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "markBlock", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.Post)('blockUsers'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getBlockUsers", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter user id',
        type: 'string',
    }),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.Put)('block/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeBlockUsers", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeUser", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter photo id',
        type: 'string',
    }),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.Delete)('deletePhoto/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removePhoto", null);
__decorate([
    (0, common_1.Post)('contact-support'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ContactSupportDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "contactSupport", null);
__decorate([
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.Post)('get-coins'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getCoins", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.Post)('make-transaction'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)('bonus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.TransactionActionTypesDto, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "makeTransaction", null);
__decorate([
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: String }),
    (0, common_1.Post)('notifications'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.GetNotificationsQueryParamsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please notification id',
        type: 'string',
    }),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.Put)('seen-notification/:id'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeNotification", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(user_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CUSTOMER),
    (0, common_1.Put)('seen-notifications'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeNotifications", null);
UserController = __decorate([
    (0, common_1.Controller)('customer'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map