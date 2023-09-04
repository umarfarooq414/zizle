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
exports.UserOauthRegisterRequestDto = void 0;
const user_1 = require("./../../../types/src/db/entities/user");
const swagger_1 = require("@nestjs/swagger");
const class_sanitizer_1 = require("class-sanitizer");
const class_validator_1 = require("class-validator");
class UserOauthRegisterRequestDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'Male' }),
    __metadata("design:type", String)
], UserOauthRegisterRequestDto.prototype, "selfGender", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'female' }),
    __metadata("design:type", String)
], UserOauthRegisterRequestDto.prototype, "interestedGender", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'Smith', description: 'Last Name of user' }),
    __metadata("design:type", String)
], UserOauthRegisterRequestDto.prototype, "userName", void 0);
__decorate([
    (0, class_sanitizer_1.Trim)(),
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)({
        example: 'john.smith@demo.com',
        description: 'Email of the user',
    }),
    __metadata("design:type", String)
], UserOauthRegisterRequestDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserOauthRegisterRequestDto.prototype, "password", void 0);
exports.UserOauthRegisterRequestDto = UserOauthRegisterRequestDto;
//# sourceMappingURL=registeroauth.js.map