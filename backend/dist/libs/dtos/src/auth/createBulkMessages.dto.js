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
exports.CreateBulkMessagesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateBulkMessagesDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Array of fake user IDs',
    }),
    __metadata("design:type", String)
], CreateBulkMessagesDto.prototype, "fakeUserIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        isArray: true,
        description: 'Array of customer user IDs',
    }),
    __metadata("design:type", String)
], CreateBulkMessagesDto.prototype, "customerUserIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Array of customer user IDs',
    }),
    __metadata("design:type", String)
], CreateBulkMessagesDto.prototype, "message", void 0);
exports.CreateBulkMessagesDto = CreateBulkMessagesDto;
//# sourceMappingURL=createBulkMessages.dto.js.map