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
exports.Subscription = void 0;
const typeorm_1 = require("typeorm");
const user_subscription_entity_1 = require("./user.subscription.entity");
let Subscription = class Subscription {
    constructor(params) {
        if (params != null) {
            this.amount = params.amount;
            this.bestSelling = params.bestSelling;
            this.creator = params.creator;
            this.noOfCoins = params.noOfCoins;
            this.packageName = params.packageType;
            this.oneTime = params.oneTime;
        }
    }
    setSubscriptionPackageType(packageType) {
        this.packageName = packageType;
    }
    setSubscriptionBestSelling(bestSelling) {
        this.bestSelling = bestSelling;
    }
    setSubscriptionAmount(amount) {
        this.amount = amount;
    }
    setSubscriptionNoOfCoins(noOfCoins) {
        this.noOfCoins = noOfCoins;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({}),
    __metadata("design:type", String)
], Subscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Subscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        length: 30,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "packageName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "bestSelling", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "oneTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 36, nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Subscription.prototype, "noOfCoins", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Subscription.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_subscription_entity_1.UserSubscription, (userSubscription) => userSubscription.package, { eager: true, cascade: true }),
    __metadata("design:type", Array)
], Subscription.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Subscription.prototype, "updatedAt", void 0);
Subscription = __decorate([
    (0, typeorm_1.Entity)({ name: 'subscription' }),
    __metadata("design:paramtypes", [Object])
], Subscription);
exports.Subscription = Subscription;
//# sourceMappingURL=subscription.entity.js.map