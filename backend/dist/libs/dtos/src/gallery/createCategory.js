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
exports.AddImageToCategoryDto = exports.SortCategoryRequestDto = exports.CreateCategoryRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const common_1 = require("@nestjs/common");
class CreateCategoryRequestDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'name of the category',
    }),
    __metadata("design:type", String)
], CreateCategoryRequestDto.prototype, "name", void 0);
exports.CreateCategoryRequestDto = CreateCategoryRequestDto;
class SortCategoryRequestDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Current Postion of the category',
    }),
    __metadata("design:type", Number)
], SortCategoryRequestDto.prototype, "currentPosition", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Target Postion of the category',
    }),
    __metadata("design:type", Number)
], SortCategoryRequestDto.prototype, "targetPosition", void 0);
exports.SortCategoryRequestDto = SortCategoryRequestDto;
class AddImageToCategoryDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Id Of category',
    }),
    __metadata("design:type", String)
], AddImageToCategoryDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'file',
        required: true,
    }),
    (0, class_transformer_1.Type)(() => common_1.UploadedFile),
    __metadata("design:type", Object)
], AddImageToCategoryDto.prototype, "image", void 0);
exports.AddImageToCategoryDto = AddImageToCategoryDto;
//# sourceMappingURL=createCategory.js.map