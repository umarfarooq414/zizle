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
exports.BonusCode = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const userBonusCode_entity_1 = require("./userBonusCode.entity");
let BonusCode = class BonusCode {
    setExpiryDate(expiryDate) {
        this.expiryDate = expiryDate;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], BonusCode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], BonusCode.prototype, "bonusCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", Number)
], BonusCode.prototype, "coins", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", Date)
], BonusCode.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], BonusCode.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => userBonusCode_entity_1.UserBonusCode, (userBonusCode) => userBonusCode.bonusCode, { eager: true, cascade: true }),
    __metadata("design:type", Array)
], BonusCode.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], BonusCode.prototype, "timestamp", void 0);
BonusCode = __decorate([
    (0, typeorm_1.Entity)({ name: 'bonus-code' })
], BonusCode);
exports.BonusCode = BonusCode;
//# sourceMappingURL=bonusCode.entity.js.map