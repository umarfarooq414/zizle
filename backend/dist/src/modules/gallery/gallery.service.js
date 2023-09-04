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
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const categories_entity_1 = require("./entities/categories.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const common_2 = require("../../../libs/dtos/src/common");
const auth_helper_1 = require("../auth/auth.helper");
const types_1 = require("../../../libs/types/src");
const images_entity_1 = require("./entities/images.entity");
const user_service_1 = require("../user/user.service");
let GalleryService = class GalleryService {
    async findAll() {
        return await this.categoriesRepo.find({
            order: {
                position: 'ASC',
            },
        });
    }
    async deleteCategoryById(token, id) {
        try {
            token = token.includes('Bearer') ? token.split(' ')[1] : token;
            const decoded = await this.helper.decode(token);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('User must be Admin!', common_1.HttpStatus.UNAUTHORIZED);
            const category = await this.categoriesRepo.findOne({
                where: {
                    id,
                },
                relations: ['images'],
            });
            if (!category)
                throw new common_1.HttpException('Category not found!', common_1.HttpStatus.NOT_FOUND);
            const res = await this.categoriesRepo.remove(category);
            return new common_2.GlobalResponseDto('Category Deleted!');
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async createCategory(token, name) {
        try {
            token = token.includes('Bearer') ? token.split(' ')[1] : token;
            const decoded = await this.helper.decode(token);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('User must be Admin!', common_1.HttpStatus.UNAUTHORIZED);
            const existingCategory = await this.categoriesRepo.findOneBy({ name });
            if (existingCategory)
                throw new common_1.HttpException('Category Already Exists!', common_1.HttpStatus.CONFLICT);
            const category = new categories_entity_1.Categories();
            category.name = name;
            const savedCategory = await this.categoriesRepo.save(category);
            savedCategory.position = Number(savedCategory.id);
            return await this.categoriesRepo.save(savedCategory);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async sortCategories(token, currentPosition, targetPosition) {
        try {
            token = token.includes('Bearer') ? token.split(' ')[1] : token;
            const decoded = await this.helper.decode(token);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('User must be Admin!', common_1.HttpStatus.UNAUTHORIZED);
            const positions = await this.categoriesRepo
                .createQueryBuilder('categories')
                .select('categories.position')
                .getMany();
            const incomingPositions = [currentPosition, targetPosition];
            const valuesExists = incomingPositions.every((value) => {
                return positions.map((position) => position.position).includes(value);
            });
            if (!valuesExists) {
                throw new common_1.HttpException('Positions Are Not Correct', common_1.HttpStatus.NOT_FOUND);
            }
            const current = await this.categoriesRepo.findOne({ where: { position: currentPosition } });
            const target = await this.categoriesRepo.findOne({ where: { position: targetPosition } });
            const queryRunner = this.categoriesRepo.manager.connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            current.position = -1;
            await queryRunner.manager.save(current);
            target.position = currentPosition;
            await queryRunner.manager.save(target);
            try {
                current.position = targetPosition;
                await queryRunner.manager.save(current);
                await queryRunner.commitTransaction();
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                console.error('Error while saving:', error);
            }
            finally {
                await queryRunner.release();
            }
            return await this.categoriesRepo.findOne({ where: { id: currentPosition.toString() } });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async addImagesToCategory(token, categoryId, file) {
        try {
            token = token.includes('Bearer') ? token.split(' ')[1] : token;
            const decoded = await this.helper.decode(token);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('User must be Admin!', common_1.HttpStatus.UNAUTHORIZED);
            const URL = await this.UserService.savePhoto(file, 'gallery');
            const category = await this.categoriesRepo.findOne({ where: { id: categoryId.toString() } });
            if (!category) {
                throw new common_1.HttpException('Category is not valid', common_1.HttpStatus.NOT_FOUND);
            }
            const categoryImage = {
                url: URL,
                categories: category,
            };
            await this.imagesRepo.save(categoryImage);
            return category;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async getAllCategoriesImages(token) {
        try {
            token = token.includes('Bearer') ? token.split(' ')[1] : token;
            const decoded = await this.helper.decode(token);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('User must be Admin!', common_1.HttpStatus.UNAUTHORIZED);
            return await this.imagesRepo.find({
                relations: ['categories'],
            });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async getImagesByCategory(token, categoryId) {
        try {
            token = token.includes('Bearer') ? token.split(' ')[1] : token;
            const decoded = await this.helper.decode(token);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN && user.role !== types_1.UserRoleEnum.MODERATOR)
                throw new common_1.HttpException('User must be Admin or Moderator!', common_1.HttpStatus.UNAUTHORIZED);
            const category = await this.categoriesRepo.findOne({ where: { id: categoryId.toString() } });
            if (!category) {
                throw new common_1.HttpException('Category is not valid', common_1.HttpStatus.NOT_FOUND);
            }
            return await this.imagesRepo.find({
                where: {
                    categories: { id: categoryId },
                },
                relations: ['categories'],
            });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async deleteImageById(token, id) {
        try {
            token = token.includes('Bearer') ? token.split(' ')[1] : token;
            const decoded = await this.helper.decode(token);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            if (user.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('User must be Admin!', common_1.HttpStatus.UNAUTHORIZED);
            const image = await this.imagesRepo.findOne({
                where: {
                    id,
                },
            });
            if (!image)
                throw new common_1.HttpException('Image not found!', common_1.HttpStatus.NOT_FOUND);
            await this.imagesRepo.remove(image);
            return new common_2.GlobalResponseDto('Category Deleted!');
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
};
__decorate([
    (0, typeorm_1.InjectRepository)(categories_entity_1.Categories),
    __metadata("design:type", typeorm_2.Repository)
], GalleryService.prototype, "categoriesRepo", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(images_entity_1.Images),
    __metadata("design:type", typeorm_2.Repository)
], GalleryService.prototype, "imagesRepo", void 0);
__decorate([
    (0, common_1.Inject)(auth_helper_1.AuthHelper),
    __metadata("design:type", auth_helper_1.AuthHelper)
], GalleryService.prototype, "helper", void 0);
__decorate([
    (0, common_1.Inject)(user_service_1.UserService),
    __metadata("design:type", user_service_1.UserService)
], GalleryService.prototype, "UserService", void 0);
GalleryService = __decorate([
    (0, common_1.Injectable)()
], GalleryService);
exports.GalleryService = GalleryService;
//# sourceMappingURL=gallery.service.js.map