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
exports.UserAccountTransaction = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const user_transaction_actiontypes_entity_1 = require("./user.transaction.actiontypes.entity");
let UserAccountTransaction = class UserAccountTransaction {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], UserAccountTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", Number)
], UserAccountTransaction.prototype, "currentCoins", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", Number)
], UserAccountTransaction.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.transaction, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], UserAccountTransaction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_transaction_actiontypes_entity_1.UserTransactionActionTypes, (actionTypes) => actionTypes.transaction, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_transaction_actiontypes_entity_1.UserTransactionActionTypes)
], UserAccountTransaction.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserAccountTransaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserAccountTransaction.prototype, "updatedAt", void 0);
UserAccountTransaction = __decorate([
    (0, typeorm_1.Entity)({ name: 'user_account_transaction' })
], UserAccountTransaction);
exports.UserAccountTransaction = UserAccountTransaction;
//# sourceMappingURL=user.account.transaction.entity.js.map