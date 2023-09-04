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
exports.GalleryController = void 0;
const common_1 = require("@nestjs/common");
const gallery_service_1 = require("./gallery.service");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../../guards");
const types_1 = require("../../../libs/types/src");
const constants_1 = require("../../../libs/constants/src");
const categories_entity_1 = require("./entities/categories.entity");
const dtos_1 = require("../../../libs/dtos/src");
const platform_express_1 = require("@nestjs/platform-express");
let GalleryController = class GalleryController {
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    async findAll() {
        return await this.galleryService.findAll();
    }
    async deleteById(token, id) {
        return await this.galleryService.deleteCategoryById(token, id);
    }
    async createCategory(token, { name }) {
        return await this.galleryService.createCategory(token, name);
    }
    async sortCategories(token, { currentPosition, targetPosition }) {
        return await this.galleryService.sortCategories(token, currentPosition, targetPosition);
    }
    async addImagesToCategory(token, { categoryId }, file) {
        return await this.galleryService.addImagesToCategory(token, categoryId, file);
    }
    async getAllCategoriesImages(token) {
        return await this.galleryService.getAllCategoriesImages(token);
    }
    async getImagesByCategory(token, categoryId) {
        return await this.galleryService.getImagesByCategory(token, categoryId);
    }
    async deleteImage(token, id) {
        return await this.galleryService.deleteImageById(token, id);
    }
};
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN, types_1.UserRoleEnum.MODERATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'All Categories!' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Categories!',
        type: categories_entity_1.Categories,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)('deleteCategory/:id'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "deleteById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a Category' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Post)('createCategory'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.CreateCategoryRequestDto]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Sort Categories' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Post)('sortCategories'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.SortCategoryRequestDto]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "sortCategories", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add Images To Category' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, common_1.Post)('addImagesToCategory'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.AddImageToCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "addImagesToCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get All Category Images' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('getAllCategoriesImages'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "getAllCategoriesImages", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN, types_1.UserRoleEnum.MODERATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get Images Category' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('getImagesByCategory/:categoryId'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "getImagesByCategory", null);
__decorate([
    (0, common_1.Delete)('deleteImage/:id'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "deleteImage", null);
GalleryController = __decorate([
    (0, common_1.Controller)('gallery'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.GALLERY),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService])
], GalleryController);
exports.GalleryController = GalleryController;
//# sourceMappingURL=gallery.controller.js.map