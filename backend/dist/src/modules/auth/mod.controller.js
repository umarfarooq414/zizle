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
exports.ModController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../../libs/constants/src");
const dtos_1 = require("../../../libs/dtos/src");
const types_1 = require("../../../libs/types/src");
const guards_1 = require("../../guards");
const mod_service_1 = require("./mod.service");
let ModController = class ModController {
    constructor(modService) {
        this.modService = modService;
    }
    async getFakes(token) {
        return await this.modService.getUsers(token);
    }
    async getChatsCount(token) {
        return await this.modService.getUnseenMessageCount(token);
    }
    async bulkVisits(token, { fakeUserIds, customerUserIds }) {
        return await this.modService.createBulkProfileVisits(token, fakeUserIds, customerUserIds);
    }
    async getAvailableUsers(token) {
        return await this.modService.getAvailableUsers(token);
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('get-users'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModController.prototype, "getFakes", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('get-chats-count'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModController.prototype, "getChatsCount", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Post)('send-bulk-visits'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.CreateBulkProfileVisitsDto]),
    __metadata("design:returntype", Promise)
], ModController.prototype, "bulkVisits", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('get-available-users'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModController.prototype, "getAvailableUsers", null);
ModController = __decorate([
    (0, common_1.Controller)('mod'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.MODERATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.MODERATOR),
    __metadata("design:paramtypes", [mod_service_1.ModService])
], ModController);
exports.ModController = ModController;
//# sourceMappingURL=mod.controller.js.map