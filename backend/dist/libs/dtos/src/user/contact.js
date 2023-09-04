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
exports.UpdateQueryStatusDto = exports.ContactSupportDto = void 0;
const user_1 = require("./../../../types/src/db/entities/user");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ContactSupportDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'subject', description: 'message subject here' }),
    __metadata("design:type", String)
], ContactSupportDto.prototype, "theme", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'token', description: 'auth token' }),
    __metadata("design:type", String)
], ContactSupportDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)({
        example: 'john.smith@demo.com',
        description: 'Email of the user',
    }),
    __metadata("design:type", String)
], ContactSupportDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'lorem ispsum lorem ispusom', description: 'type message here' }),
    __metadata("design:type", String)
], ContactSupportDto.prototype, "message", void 0);
exports.ContactSupportDto = ContactSupportDto;
class UpdateQueryStatusDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'query id', description: 'query id here' }),
    __metadata("design:type", String)
], UpdateQueryStatusDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(user_1.QueryStatus),
    (0, swagger_1.ApiProperty)({ example: 'lorem ispsum lorem ispusom', description: 'type message here' }),
    __metadata("design:type", String)
], UpdateQueryStatusDto.prototype, "status", void 0);
exports.UpdateQueryStatusDto = UpdateQueryStatusDto;
//# sourceMappingURL=contact.js.map