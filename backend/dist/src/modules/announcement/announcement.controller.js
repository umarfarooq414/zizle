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
exports.AnnouncementController = void 0;
const common_1 = require("@nestjs/common");
const announcement_entity_1 = require("./entities/announcement.entity");
const swagger_1 = require("@nestjs/swagger");
const types_1 = require("../../../libs/types/src");
const guards_1 = require("../../guards");
const constants_1 = require("../../../libs/constants/src");
const announcement_service_1 = require("./announcement.service");
const dtos_1 = require("../../../libs/dtos/src");
let AnnouncementController = class AnnouncementController {
    constructor(announcementService) {
        this.announcementService = announcementService;
    }
    async findAll() {
        return await this.announcementService.findAll();
    }
    async createdAnnouncement(announcementDto) {
        return await this.announcementService.createAnnouncement(announcementDto);
    }
    async findOne(id) {
        return await this.announcementService.findOne(id);
    }
    async updateById(id, body) {
        return await this.announcementService.updateById(id, body);
    }
    async deleteById(id) {
        return await this.announcementService.deleteById(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'All Announcements!' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Announcement!',
        type: announcement_entity_1.Announcement,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('createAnnouncement'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Create Announcement' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Announcement created!',
        type: announcement_entity_1.Announcement,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateAnnouncementRequestDto]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "createdAnnouncement", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Announcement' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter announcement id',
        type: 'string',
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Announcement' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter announcement id',
        type: 'string',
    }),
    (0, common_1.Put)('updateAnnouncement/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UpdateAnnouncementRequestDto]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "updateById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete Announcement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deleted.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter announcement id',
        type: 'string',
    }),
    (0, common_1.Delete)('deleteAnnouncement/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "deleteById", null);
AnnouncementController = __decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('announcements'),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.ANNOUNCEMENT),
    __metadata("design:paramtypes", [announcement_service_1.AnnouncementService])
], AnnouncementController);
exports.AnnouncementController = AnnouncementController;
//# sourceMappingURL=announcement.controller.js.map