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
exports.CreateFakeRequestDto = void 0;
const user_1 = require("./../../../types/src/db/entities/user");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateFakeRequestDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'User Name', description: 'User Name here' }),
    __metadata("design:type", String)
], CreateFakeRequestDto.prototype, "userName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'Email', description: 'email here' }),
    __metadata("design:type", String)
], CreateFakeRequestDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ example: 'Self Gender', description: 'Self Gender here' }),
    __metadata("design:type", String)
], CreateFakeRequestDto.prototype, "selfGender", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ example: 'Interested Gender', description: 'Interested Gender here' }),
    __metadata("design:type", String)
], CreateFakeRequestDto.prototype, "interestedGender", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ example: 'Life', description: 'life status here' }),
    __metadata("design:type", String)
], CreateFakeRequestDto.prototype, "life", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ example: 'smoke status', description: 'smoker status here' }),
    __metadata("design:type", String)
], CreateFakeRequestDto.prototype, "smoker", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ example: 'relationship status', description: 'relationship status here' }),
    __metadata("design:type", String)
], CreateFakeRequestDto.prototype, "relationshipStatus", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ example: 'children status', description: 'children status here' }),
    __metadata("design:type", String)
], CreateFakeRequestDto.prototype, "children", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'date of birth', description: 'date of birth here' }),
    __metadata("design:type", String)
], CreateFakeRequestDto.prototype, "dob", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'address', description: 'address here' }),
    __metadata("design:type", String)
], CreateFakeRequestDto.prototype, "postalCode", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'mobile number', description: 'mobile number here' }),
    __metadata("design:type", String)
], CreateFakeRequestDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'profile text', description: 'profile bio here' }),
    __metadata("design:type", String)
], CreateFakeRequestDto.prototype, "profileText", void 0);
exports.CreateFakeRequestDto = CreateFakeRequestDto;
//# sourceMappingURL=create.js.map