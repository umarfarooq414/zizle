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
exports.AdminModRegisterRequestDto = exports.UserRegisterRequestDto = void 0;
const user_1 = require("./../../../types/src/db/entities/user");
const swagger_1 = require("@nestjs/swagger");
const class_sanitizer_1 = require("class-sanitizer");
const class_validator_1 = require("class-validator");
class UserRegisterRequestDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30, {
        message: 'Enter your gender',
    }),
    (0, swagger_1.ApiProperty)({ example: 'Male' }),
    __metadata("design:type", String)
], UserRegisterRequestDto.prototype, "selfGender", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30, {
        message: 'Enter interested gender',
    }),
    (0, swagger_1.ApiProperty)({ example: 'female' }),
    __metadata("design:type", String)
], UserRegisterRequestDto.prototype, "interestedGender", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30, {
        message: 'Last Name length must be less than 30',
    }),
    (0, swagger_1.ApiProperty)({ example: 'Smith', description: 'Last Name of user' }),
    __metadata("design:type", String)
], UserRegisterRequestDto.prototype, "userName", void 0);
__decorate([
    (0, class_sanitizer_1.Trim)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)({
        example: 'john.smith@demo.com',
        description: 'Email of the user',
    }),
    __metadata("design:type", String)
], UserRegisterRequestDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(7, {
        message: 'Password must be at least 7 characters long',
    }),
    (0, swagger_1.ApiProperty)({
        example: 'password',
        description: 'Password for user. Must be 7 characters long.',
    }),
    __metadata("design:type", String)
], UserRegisterRequestDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'Age',
        description: 'Age of the user',
    }),
    __metadata("design:type", Number)
], UserRegisterRequestDto.prototype, "age", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: '123453',
        description: 'Zip Code ',
    }),
    __metadata("design:type", String)
], UserRegisterRequestDto.prototype, "zipCode", void 0);
exports.UserRegisterRequestDto = UserRegisterRequestDto;
class AdminModRegisterRequestDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30, {
        message: 'First Name length must be less than 30',
    }),
    (0, swagger_1.ApiProperty)({ example: 'John', description: 'First Name of user' }),
    __metadata("design:type", String)
], AdminModRegisterRequestDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30, {
        message: 'Last Name length must be less than 30',
    }),
    (0, swagger_1.ApiProperty)({ example: 'Smith', description: 'Last Name of user' }),
    __metadata("design:type", String)
], AdminModRegisterRequestDto.prototype, "lastName", void 0);
__decorate([
    (0, class_sanitizer_1.Trim)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)({
        example: 'john.smith@demo.com',
        description: 'Email of the user',
    }),
    __metadata("design:type", String)
], AdminModRegisterRequestDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(7, {
        message: 'Password must be at least 7 characters long',
    }),
    (0, swagger_1.ApiProperty)({
        example: 'password',
        description: 'Password for user. Must be 7 characters long.',
    }),
    __metadata("design:type", String)
], AdminModRegisterRequestDto.prototype, "password", void 0);
exports.AdminModRegisterRequestDto = AdminModRegisterRequestDto;
//# sourceMappingURL=register.js.map