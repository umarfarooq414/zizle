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
exports.UpdateProfileRequestDto = void 0;
const user_1 = require("./../../../types/src/db/entities/user");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateProfileRequestDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_1.CustomerRelationShipStatus),
    (0, swagger_1.ApiProperty)({ description: 'Leave Empty if not wanted to update' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "relationshipStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_1.CustomerChildrenEnum),
    (0, swagger_1.ApiProperty)({ description: 'Leave Empty if not wanted to update' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "children", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_1.CustomerLifeStatus),
    (0, swagger_1.ApiProperty)({ description: 'Enter living status to update' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "life", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_1.CustomerSmokeStatus),
    (0, swagger_1.ApiProperty)({ description: 'Enter smoking status to update', example: 'yes' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "smoker", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Enter profile text to update' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "profileText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Enter mobilenumber to update' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Enter date of birth in string format' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "dob", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Enter address in string format' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Enter username' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "userName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Enter current Password' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "currentPassword", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Enter new Password' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "newPassword", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_1.UserInterestedGenderEnum),
    (0, swagger_1.ApiProperty)({ description: 'Enter interested Gender' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "interestedGender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_1.UserSelfGenderEnum),
    (0, swagger_1.ApiProperty)({ description: 'Enter self Gender' }),
    __metadata("design:type", String)
], UpdateProfileRequestDto.prototype, "selfGender", void 0);
exports.UpdateProfileRequestDto = UpdateProfileRequestDto;
//# sourceMappingURL=updateProfile.js.map