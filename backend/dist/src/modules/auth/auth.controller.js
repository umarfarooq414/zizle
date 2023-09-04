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
exports.AuthController = void 0;
const updateBonusCode_dto_1 = require("./../../../libs/dtos/src/auth/updateBonusCode.dto");
const bonusCode_dto_1 = require("./../../../libs/dtos/src/auth/bonusCode.dto");
const updateMod_dto_1 = require("./../../../libs/dtos/src/auth/updateMod.dto");
const createMod_dto_1 = require("./../../../libs/dtos/src/auth/createMod.dto");
const createBulkMessages_dto_1 = require("./../../../libs/dtos/src/auth/createBulkMessages.dto");
const mod_stats_dto_1 = require("./../../../libs/dtos/src/auth/mod.stats.dto");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../../libs/constants/src");
const auth_service_1 = require("./auth.service");
const user_entity_1 = require("../user/entities/user.entity");
const dtos_1 = require("../../../libs/dtos/src");
const types_1 = require("../../../libs/types/src");
const guards_1 = require("../../guards");
const updateAccess_1 = require("../../../libs/dtos/src/auth/updateAccess");
const updateStatus_1 = require("../../../libs/dtos/src/auth/updateStatus");
const platform_express_1 = require("@nestjs/platform-express");
const auth_helper_1 = require("./auth.helper");
const chat_service_1 = require("../chat/chat.service");
let AuthController = class AuthController {
    constructor(authService, authHelper, chatService) {
        this.authService = authService;
        this.authHelper = authHelper;
        this.chatService = chatService;
    }
    async getUsersemail(email) {
        return await this.authService.getUserByMail(email);
    }
    async RegisterUser(registerDto) {
        return await this.authService.registerUser(registerDto);
    }
    async RegisterAdminMod(registerDto) {
        return await this.authService.registerAdminMod(registerDto);
    }
    async login(loginRequestDto) {
        return await this.authService.login(loginRequestDto);
    }
    async approveAccessUser(updateAccessDto) {
        return await this.authService.updateUserAccess(updateAccessDto);
    }
    async approveStatusUser(updateStatusDto) {
        return await this.authService.updateUserStatus(updateStatusDto);
    }
    async updateModeratorStatus(updateStatusDto) {
        return await this.authService.updateModeratorStatus(updateStatusDto);
    }
    async getUsers() {
        return await this.authService.getAllUsers();
    }
    async verifyEmail(token, res) {
        return await this.authService.verifyEmail(token, res);
    }
    async verifyProfile(id) {
        return await this.authService.verifyProfile(id);
    }
    forgetPassword({ email }) {
        return this.authService.forget(email);
    }
    resetPassword(token, resetPasswordRequestDto) {
        return this.authService.resetPassword(token, resetPasswordRequestDto);
    }
    async RegisteroauthUser(registerDto) {
        return await this.authService.socialLogin(registerDto);
    }
    async onlineUsers(token) {
        return await this.authService.onlineUsers(token);
    }
    async saveEmojis(token, file) {
        return await this.authService.saveEmojis(token, file);
    }
    async getEmojis(token) {
        return await this.authService.getEmojis(token);
    }
    async statsUserReplies(token) {
        return await this.authService.getUserStats(token);
    }
    async statsUserSendMessages(token, params) {
        return await this.authService.getModSendMessageStats(token, params);
    }
    async getModeratorMessages(token, params) {
        return await this.chatService.statsModGotSentToUser(params, token);
    }
    async getModeratorReplies(token, params) {
        return await this.chatService.statsModGotRepliesFromUser(params, token);
    }
    async getMods(token) {
        return await this.authService.getMods(token);
    }
    async bulkVisits(token, { fakeUserIds, customerUserIds, message }, file) {
        return await this.authService.createBulkMessages(token, fakeUserIds, customerUserIds, message, file);
    }
    async createdFake(token, modDto) {
        return await this.authService.createMod(token, modDto);
    }
    async findOne(token, id) {
        return await this.authService.getMod(token, id);
    }
    async updateById(token, id, body) {
        return await this.authService.updateModById(token, id, body);
    }
    async deleteById(token, id) {
        return await this.authService.deleteModById(token, id);
    }
    async createBonusCode(token, bonusCodeDto) {
        return await this.authService.createBonusCode(token, bonusCodeDto);
    }
    async verifyBonusCode(token, bonusCode) {
        return await this.authHelper.verifyBonusCode(token, bonusCode);
    }
    async updateBonusCode(token, id, { expiryDate }) {
        return await this.authService.updateBonusCode(token, id, expiryDate);
    }
    async getBonusCodes(token) {
        return await this.authService.getAllBonusCodes(token);
    }
    async getBonusCodeById(token, id) {
        return await this.authHelper.getBonusCode(token, id);
    }
    async deleteBonusCodeById(token, id) {
        return await this.authService.deleteBonusCodeById(token, id);
    }
    async scheduleMessage(token, body) {
        return this.authService.scheduleMessage(token, body);
    }
    async findAll(token) {
        return this.authService.getScheduledMessage(token);
    }
    async deleteScheduleMessage(token, id) {
        return this.authService.deleteScheduledMessage(token, id);
    }
    async spamMessage(token, body, file) {
        return this.authService.sendSpamMessages(token, body, file);
    }
    async getStats(token) {
        return this.authService.getStats(token);
    }
    async getQueries(token) {
        return this.authService.getQueries(token);
    }
    async getSpecificCustomerQueries(token) {
        return this.authService.getSpecifiCustomerQueries(token);
    }
    async updateQueryStatus(token, body) {
        return this.authService.updateQueryStatus(token, body);
    }
};
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUsersemail", null);
__decorate([
    (0, common_1.Post)('registerUser'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Register User' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User created!',
        type: user_entity_1.User,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserRegisterRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "RegisterUser", null);
__decorate([
    (0, common_1.Post)('registerAdminMod'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Register User' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User created!',
        type: user_entity_1.User,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.AdminModRegisterRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "RegisterAdminMod", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login User' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully login!' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found!' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.LoginRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Put)('/update-access'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateAccess_1.UpdateAccessDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "approveAccessUser", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Put)('/update-status'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateStatus_1.UpdateStatusDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "approveStatusUser", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Put)('/block-mod'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateStatus_1.UpdateStatusDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateModeratorStatus", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter Notes id',
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Post)('verify-profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyProfile", null);
__decorate([
    (0, common_1.Post)('forget'),
    (0, swagger_1.ApiOperation)({ summary: 'Forget password' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Please check email. Otp sent to xyz@mail.com',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found!' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ForgetRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset successfully!',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found!' }),
    __param(0, (0, common_1.Headers)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.ResetPasswordRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('social-join'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Register User' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User created!',
        type: user_entity_1.User,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "RegisteroauthUser", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('online-stats'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "onlineUsers", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('emoji')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Post)('save-emojis'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "saveEmojis", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.CUSTOMER, types_1.UserRoleEnum.MODERATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('get-emojis'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getEmojis", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN, types_1.UserRoleEnum.MODERATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiQuery)({ name: 'modId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'duration', required: false, type: String }),
    (0, common_1.Get)('stats-user-replies'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "statsUserReplies", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN, types_1.UserRoleEnum.MODERATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiQuery)({ name: 'modId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'duration', required: false, type: String }),
    (0, common_1.Get)('stats-user-messages'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mod_stats_dto_1.GetModsStatsQueryParamsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "statsUserSendMessages", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN, types_1.UserRoleEnum.MODERATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiQuery)({ name: 'modId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'duration', required: false, type: String }),
    (0, common_1.Get)('single-moderator-messages'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mod_stats_dto_1.GetModsStatsQueryParamsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getModeratorMessages", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN, types_1.UserRoleEnum.MODERATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiQuery)({ name: 'modId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'duration', required: false, type: String }),
    (0, common_1.Get)('single-moderator-replies'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mod_stats_dto_1.GetModsStatsQueryParamsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getModeratorReplies", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('mods'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMods", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Post)('send-spam-messages'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, createBulkMessages_dto_1.CreateBulkMessagesDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "bulkVisits", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('mod'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Mod Account' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Mode Account created!',
        type: user_entity_1.User,
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, createMod_dto_1.CreateModDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createdFake", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a Mod Account' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter mod user id',
        type: 'string',
    }),
    (0, common_1.Get)('mod/:id'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update Mod Account' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter mod user id',
        type: 'string',
    }),
    (0, common_1.Put)('mod/:id'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, updateMod_dto_1.UpdateModDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateById", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete Mod account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deleted.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter mod user id',
        type: 'string',
    }),
    (0, common_1.Delete)('mod/:id'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteById", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Post)('bonus-code'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bonusCode_dto_1.CreateBonusCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createBonusCode", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('verify-bonus-code'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('bonus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyBonusCode", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Put)('bonus-code/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter bonus user id',
        type: 'string',
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, updateBonusCode_dto_1.UpdateBonusCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateBonusCode", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('bonus-codes'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getBonusCodes", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter bonus id',
        type: 'string',
    }),
    (0, common_1.Get)('bonus-code/:id'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getBonusCodeById", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter bonus id',
        type: 'string',
    }),
    (0, common_1.Delete)('bonus-code/:id'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteBonusCodeById", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Post)('schedule-message'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.ScheduleMessageDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "scheduleMessage", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('schedule-message'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter schedule message id',
        type: 'string',
    }),
    (0, common_1.Delete)('schedule-message/:id'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteScheduleMessage", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Post)('spam-messages'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.SpamMessagesDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "spamMessage", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN, types_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('queries'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getQueries", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN, types_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('getSpecificCustomerQueries'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSpecificCustomerQueries", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Put)('update-query'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UpdateQueryStatusDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateQueryStatus", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.AUTH),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        auth_helper_1.AuthHelper,
        chat_service_1.ChatService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map