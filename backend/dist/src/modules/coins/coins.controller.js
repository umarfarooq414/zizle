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
exports.CoinsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const types_1 = require("../../../libs/types/src");
const guards_1 = require("../../guards");
const constants_1 = require("../../../libs/constants/src");
const dtos_1 = require("../../../libs/dtos/src");
const coins_service_1 = require("./coins.service");
const platform_express_1 = require("@nestjs/platform-express");
let CoinsController = class CoinsController {
    constructor(coinsService) {
        this.coinsService = coinsService;
    }
    async findAll() {
        return await this.coinsService.findAll();
    }
    async findById(id) {
        return await this.coinsService.findOne(id);
    }
    async setCost(token, setCostDto) {
        return await this.coinsService.setCost(token, setCostDto);
    }
    async createActionType(token, createActionTypeDto) {
        return await this.coinsService.createActionType(token, createActionTypeDto);
    }
    async createGift(token, createGiftDto, file) {
        return await this.coinsService.createGift(token, createGiftDto, file);
    }
    async updateGift(token, updateGiftDto, id, file) {
        return await this.coinsService.updateGift(token, id, updateGiftDto, file);
    }
    async findGiftById(id) {
        return await this.coinsService.findGiftById(id);
    }
    async findAllGift() {
        return await this.coinsService.findAllGifts();
    }
    async deleteGift(id) {
        return await this.coinsService.deleteGift(id);
    }
};
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.CUSTOMER, types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'All Action types!' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a action type!' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please action type id',
        type: 'string',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "findById", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'update action type cost!' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Put)('set-cost'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.SetCostDto]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "setCost", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'create a action type!' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Post)('create-action-type'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.CreateActionTypeDto]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "createActionType", null);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imageUrl')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('create-gift'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.CreateGiftDto, Object]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "createGift", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'update gift type cost!' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please action type id',
        type: 'string',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imageUrl')),
    (0, common_1.Put)('update-gift/:id'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.CreateGiftDto, String, Object]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "updateGift", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a gift type!' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please action type id',
        type: 'string',
    }),
    (0, common_1.Get)('gift/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "findGiftById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a gift type!' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Post)('gifts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "findAllGift", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('gift/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "deleteGift", null);
CoinsController = __decorate([
    (0, common_1.Controller)('coins'),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.COINS),
    __metadata("design:paramtypes", [coins_service_1.CoinsService])
], CoinsController);
exports.CoinsController = CoinsController;
//# sourceMappingURL=coins.controller.js.map