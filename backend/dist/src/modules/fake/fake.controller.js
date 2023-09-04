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
exports.FakeController = void 0;
const fake_service_1 = require("./fake.service");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const types_1 = require("../../../libs/types/src");
const guards_1 = require("../../guards");
const constants_1 = require("../../../libs/constants/src");
const dtos_1 = require("../../../libs/dtos/src");
const platform_express_1 = require("@nestjs/platform-express");
const user_entity_1 = require("../user/entities/user.entity");
let FakeController = class FakeController {
    constructor(fakeService) {
        this.fakeService = fakeService;
    }
    async findAll() {
        return await this.fakeService.findAll();
    }
    async createdFake(token, fakeDto, files) {
        return await this.fakeService.createFake(token, fakeDto, files);
    }
    async findOne(id) {
        return await this.fakeService.findOne(id);
    }
    async updateById(id, body, files) {
        return await this.fakeService.updateById(id, body, files);
    }
    async deleteById(id) {
        return await this.fakeService.deleteById(id);
    }
    async createDynamicFakes(token, body) {
        return await this.fakeService.createDynamicFakes(token, body);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'All Fake Accounts!' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Fake!',
        type: user_entity_1.User,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FakeController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'avatar' }, { name: 'photos' }])),
    (0, common_1.Post)('createFake'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Fake Account' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Fake Account created!',
        type: user_entity_1.User,
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.CreateFakeRequestDto, Object]),
    __metadata("design:returntype", Promise)
], FakeController.prototype, "createdFake", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Fake Account' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter fake user id',
        type: 'string',
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FakeController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Fake Account' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'avatar' }, { name: 'photos' }])),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter fake user id',
        type: 'string',
    }),
    (0, common_1.Put)('updateFake/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UpdateFakeRequestDto, Object]),
    __metadata("design:returntype", Promise)
], FakeController.prototype, "updateById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete Fake account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deleted.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter fake user id',
        type: 'string',
    }),
    (0, common_1.Delete)('deleteFake/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FakeController.prototype, "deleteById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Dynamic Fake accounts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Created.' }),
    (0, common_1.Post)('dynamic-fakes'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.CreateDynamicFakeRequestDto]),
    __metadata("design:returntype", Promise)
], FakeController.prototype, "createDynamicFakes", null);
FakeController = __decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('fake'),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.FAKE),
    __metadata("design:paramtypes", [fake_service_1.FakeService])
], FakeController);
exports.FakeController = FakeController;
//# sourceMappingURL=fake.controller.js.map