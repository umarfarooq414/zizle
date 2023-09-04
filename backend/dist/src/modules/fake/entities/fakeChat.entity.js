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
exports.FakeChat = void 0;
const chat_entity_1 = require("../../chat/entities/chat.entity");
const user_1 = require("./../../../../libs/types/src/db/entities/user");
const typeorm_1 = require("typeorm");
let FakeChat = class FakeChat {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], FakeChat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FakeChat.prototype, "moderatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'enum',
        enum: user_1.UserRoleEnum,
    }),
    __metadata("design:type", String)
], FakeChat.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", Boolean)
], FakeChat.prototype, "blocked", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => chat_entity_1.Chat),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", chat_entity_1.Chat)
], FakeChat.prototype, "chat", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FakeChat.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FakeChat.prototype, "updatedAt", void 0);
FakeChat = __decorate([
    (0, typeorm_1.Entity)({ name: 'fake-chat' })
], FakeChat);
exports.FakeChat = FakeChat;
//# sourceMappingURL=fakeChat.entity.js.map