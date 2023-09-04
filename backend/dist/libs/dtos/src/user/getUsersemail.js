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
exports.GetUsersemailQueryParamsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GetUsersemailQueryParamsDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: '1', description: 'Page No type here' }),
    __metadata("design:type", String)
], GetUsersemailQueryParamsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: '20', description: 'Page Size type here' }),
    __metadata("design:type", String)
], GetUsersemailQueryParamsDto.prototype, "pageSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'male', description: 'type gender here' }),
    __metadata("design:type", String)
], GetUsersemailQueryParamsDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 's', description: 'find by nickname' }),
    __metadata("design:type", String)
], GetUsersemailQueryParamsDto.prototype, "nickname", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'find by status' }),
    __metadata("design:type", String)
], GetUsersemailQueryParamsDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: '18', description: 'Starting Age' }),
    __metadata("design:type", String)
], GetUsersemailQueryParamsDto.prototype, "startAge", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: '60', description: 'Ending Age' }),
    __metadata("design:type", String)
], GetUsersemailQueryParamsDto.prototype, "endAge", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: '60', description: 'distance in kms' }),
    __metadata("design:type", String)
], GetUsersemailQueryParamsDto.prototype, "distanceInKms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'new users' }),
    __metadata("design:type", String)
], GetUsersemailQueryParamsDto.prototype, "newUsers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'fsk badge' }),
    __metadata("design:type", String)
], GetUsersemailQueryParamsDto.prototype, "fsk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'geneve', description: 'postal code' }),
    __metadata("design:type", String)
], GetUsersemailQueryParamsDto.prototype, "postalCode", void 0);
exports.GetUsersemailQueryParamsDto = GetUsersemailQueryParamsDto;
//# sourceMappingURL=getUsersemail.js.map