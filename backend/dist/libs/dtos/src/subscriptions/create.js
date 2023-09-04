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
exports.CreateSubscriptionRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSubscriptionRequestDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'Subscription Package Type', description: 'Subscription package type here' }),
    __metadata("design:type", String)
], CreateSubscriptionRequestDto.prototype, "packageType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({ example: 'Subscription Best Selling', description: 'Subscription best selling here' }),
    __metadata("design:type", Boolean)
], CreateSubscriptionRequestDto.prototype, "bestSelling", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({ example: 'One Time subscription', description: 'Subscribe for the one time' }),
    __metadata("design:type", Boolean)
], CreateSubscriptionRequestDto.prototype, "oneTime", void 0);
__decorate([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ example: 'Subscription Amount', description: 'Subscription amount here' }),
    __metadata("design:type", Number)
], CreateSubscriptionRequestDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ example: 'Subscription No Of Coins', description: 'Subscription No of Coins here' }),
    __metadata("design:type", Number)
], CreateSubscriptionRequestDto.prototype, "noOfCoins", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'Subscription Creator', description: 'Subscription Creator here' }),
    __metadata("design:type", String)
], CreateSubscriptionRequestDto.prototype, "creator", void 0);
exports.CreateSubscriptionRequestDto = CreateSubscriptionRequestDto;
//# sourceMappingURL=create.js.map