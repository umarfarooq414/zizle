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
exports.ChatController = void 0;
const chat_service_1 = require("./chat.service");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../../libs/constants/src");
const chat_entity_1 = require("./entities/chat.entity");
const decorators_1 = require("@nestjs/common/decorators");
const dtos_1 = require("../../../libs/dtos/src");
const guards_1 = require("../../guards");
const types_1 = require("../../../libs/types/src");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async createdAnnouncement(chatDto, token) {
        return await this.chatService.createChat(chatDto, token);
    }
    async getMessages(token, { sender, receiver }) {
        return await this.chatService.getMessages(sender, receiver, token);
    }
    async getChatUsers(token, userId) {
        return await this.chatService.getChatUsers(token, userId);
    }
    async getCleintChatUsers(token, userId) {
        return await this.chatService.getClientChatsUsers(token, userId);
    }
    async createdFakeChat(token, chatDto) {
        return await this.chatService.createFakeChat(chatDto, token);
    }
    async test(sender, receiver, message) {
        return await this.chatService.detectFakeAndSendMail(sender, receiver, message);
    }
    async getModChatUsers(token, modId) {
        return await this.chatService.getModChatUsers(token, modId);
    }
    async blockModChat(token, body) {
        return await this.chatService.blockModChat(token, body);
    }
    async unblockModChat(token, body) {
        return await this.chatService.unblockModChat(token, body);
    }
};
__decorate([
    (0, decorators_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.MODERATOR, types_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('createChat'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Create Chat' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chat created!',
        type: chat_entity_1.Chat,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createdAnnouncement", null);
__decorate([
    (0, decorators_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.MODERATOR, types_1.UserRoleEnum.CUSTOMER, types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, decorators_1.Get)('get-messages'),
    (0, swagger_1.ApiOperation)({ summary: 'get Chat' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chat fetched!',
        type: chat_entity_1.Chat,
    }),
    (0, swagger_1.ApiQuery)({ name: 'sender', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'receiver', required: true, type: String }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.GetChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, decorators_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.MODERATOR, types_1.UserRoleEnum.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, decorators_1.Get)('getChatUsers'),
    (0, swagger_1.ApiOperation)({ summary: 'get Chat Users' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Users fetched!',
        type: chat_entity_1.Chat,
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatUsers", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, decorators_1.Get)('getClientChatUsers'),
    (0, swagger_1.ApiOperation)({ summary: 'get Client Chat Users' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Users fetched!',
        type: chat_entity_1.Chat,
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getCleintChatUsers", null);
__decorate([
    (0, common_1.Post)('createFakeChat'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Create Fake Chat' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Fake Chat created!',
        type: chat_entity_1.Chat,
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createdFakeChat", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('sender')),
    __param(1, (0, common_1.Body)('receiver')),
    __param(2, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "test", null);
__decorate([
    (0, decorators_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.MODERATOR, types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, decorators_1.Get)('getModChatUsers'),
    (0, swagger_1.ApiOperation)({ summary: 'get Chat Users' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Users fetched!',
        type: chat_entity_1.Chat,
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('modId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getModChatUsers", null);
__decorate([
    (0, decorators_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('block-chat'),
    (0, swagger_1.ApiOperation)({ summary: 'block moderator chat' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chat Blocked!',
        type: chat_entity_1.Chat,
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.BlockChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "blockModChat", null);
__decorate([
    (0, decorators_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('unblock-chat'),
    (0, swagger_1.ApiOperation)({ summary: 'block moderator chat' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chat Blocked!',
        type: chat_entity_1.Chat,
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.BlockChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "unblockModChat", null);
ChatController = __decorate([
    (0, common_1.Controller)('chats'),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.CHAT),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map