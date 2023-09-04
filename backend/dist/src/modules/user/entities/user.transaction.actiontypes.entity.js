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
exports.UserTransactionActionTypes = void 0;
const user_account_transaction_entity_1 = require("./user.account.transaction.entity");
const typeorm_1 = require("typeorm");
let UserTransactionActionTypes = class UserTransactionActionTypes {
    setGiftImageUrl(imageUrl) {
        this.imageUrl = imageUrl;
    }
    setGiftActionType(actionType) {
        this.actionType = actionType;
    }
    setGiftCost(cost) {
        this.cost = cost;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], UserTransactionActionTypes.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        readonly: true,
        nullable: true,
    }),
    __metadata("design:type", String)
], UserTransactionActionTypes.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], UserTransactionActionTypes.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserTransactionActionTypes.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserTransactionActionTypes.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], UserTransactionActionTypes.prototype, "gift", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_account_transaction_entity_1.UserAccountTransaction, (transaction) => transaction.actionType, { eager: true, cascade: true }),
    __metadata("design:type", user_account_transaction_entity_1.UserAccountTransaction)
], UserTransactionActionTypes.prototype, "transaction", void 0);
UserTransactionActionTypes = __decorate([
    (0, typeorm_1.Entity)({ name: 'user_transaction_action_types' })
], UserTransactionActionTypes);
exports.UserTransactionActionTypes = UserTransactionActionTypes;
//# sourceMappingURL=user.transaction.actiontypes.entity.js.map