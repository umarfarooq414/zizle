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
exports.TransactionActionTypesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const subscriptions_1 = require("./../../../types/src/db/entities/subscriptions");
const class_validator_1 = require("class-validator");
class TransactionActionTypesDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ example: 'SENDMESSAGE', description: 'Action type here here' }),
    __metadata("design:type", String)
], TransactionActionTypesDto.prototype, "actionType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'receiver id', description: 'Receiver User id here' }),
    __metadata("design:type", String)
], TransactionActionTypesDto.prototype, "receiverId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'sub action like gift name ', description: 'giftname here' }),
    __metadata("design:type", String)
], TransactionActionTypesDto.prototype, "subAction", void 0);
exports.TransactionActionTypesDto = TransactionActionTypesDto;
//# sourceMappingURL=actionType.dto.js.map