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
exports.ContactSupport = void 0;
const user_1 = require("./../../../../libs/types/src/db/entities/user");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let ContactSupport = class ContactSupport {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], ContactSupport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ContactSupport.prototype, "query", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: user_1.QueryStatus, default: user_1.QueryStatus.IN_PROGRESS }),
    __metadata("design:type", String)
], ContactSupport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], ContactSupport.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ContactSupport.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ContactSupport.prototype, "updatedAt", void 0);
ContactSupport = __decorate([
    (0, typeorm_1.Entity)({ name: 'contact_support' })
], ContactSupport);
exports.ContactSupport = ContactSupport;
//# sourceMappingURL=contactSupport.entity.js.map