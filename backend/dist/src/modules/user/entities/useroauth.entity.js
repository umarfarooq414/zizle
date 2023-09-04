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
exports.OauthUser = void 0;
const user_1 = require("./../../../../libs/types/src/db/entities/user");
const typeorm_1 = require("typeorm");
const customer_profiledata_entity_1 = require("./customer.profiledata.entity");
const user_account_transaction_entity_1 = require("./user.account.transaction.entity");
const visit_profile_entity_1 = require("./visit.profile.entity");
const customer_favourite_entity_1 = require("./customer.favourite.entity");
const user_address_entity_1 = require("./user.address.entity");
const user_block_entity_1 = require("./user.block.entity");
const user_photos_entity_1 = require("./user.photos.entity");
const payment_entity_1 = require("../../payments/entities/payment.entity");
let OauthUser = class OauthUser {
    constructor(params) {
        this.status = user_1.UserStatusEnum.UNVERIFIED;
        this.role = user_1.UserRoleEnum.CUSTOMER;
        if (params != null) {
            if (params.firstName)
                this.firstName = params.firstName;
            if (params.lastName)
                this.lastName = params.lastName;
            this.email = params.email;
            if (params.userName)
                this.userName = params.userName;
            this.selfGender = params.selfGender;
            this.interestedGender = params.interestedGender;
            if (params.status)
                this.setStatus(params.status);
            if (params.role)
                this.role = params.role;
        }
    }
    setStatus(status) {
        this.status = status;
    }
    setRole(role) {
        this.role = role;
    }
    setPassword(password) {
        this.password = password;
    }
    setFirstName(firstName) {
        this.firstName = firstName;
    }
    setUserName(userName) {
        this.userName = userName;
    }
    setLastName(lastName) {
        this.lastName = lastName;
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], OauthUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", String)
], OauthUser.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", String)
], OauthUser.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", String)
], OauthUser.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], OauthUser.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OauthUser.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'enum',
        enum: user_1.SocialProviderEnum,
        default: null,
    }),
    __metadata("design:type", String)
], OauthUser.prototype, "SocialProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_1.UserStatusEnum,
        default: user_1.UserStatusEnum.UNVERIFIED,
    }),
    __metadata("design:type", String)
], OauthUser.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_1.UserRoleEnum,
        default: user_1.UserRoleEnum.CUSTOMER,
    }),
    __metadata("design:type", String)
], OauthUser.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], OauthUser.prototype, "selfGender", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], OauthUser.prototype, "interestedGender", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", Boolean)
], OauthUser.prototype, "online", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], OauthUser.prototype, "disable", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OauthUser.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], OauthUser.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => customer_profiledata_entity_1.CustomerProfileData, (profile) => profile.user, { cascade: true, eager: true }),
    __metadata("design:type", customer_profiledata_entity_1.CustomerProfileData)
], OauthUser.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_address_entity_1.Address, (address) => address.user, { cascade: true, eager: true }),
    __metadata("design:type", user_address_entity_1.Address)
], OauthUser.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_account_transaction_entity_1.UserAccountTransaction, (transaction) => transaction.user, { eager: true, cascade: true }),
    __metadata("design:type", user_account_transaction_entity_1.UserAccountTransaction)
], OauthUser.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => visit_profile_entity_1.VisitProfile, (visit) => visit.visitor, { eager: true, cascade: true }),
    __metadata("design:type", visit_profile_entity_1.VisitProfile)
], OauthUser.prototype, "visits", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_block_entity_1.Block, (block) => block.blocked, { eager: true, cascade: true }),
    __metadata("design:type", user_block_entity_1.Block)
], OauthUser.prototype, "blocked", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_favourite_entity_1.Favorite, (fav) => fav.favorites, { eager: true, cascade: true }),
    __metadata("design:type", customer_favourite_entity_1.Favorite)
], OauthUser.prototype, "favorite", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_photos_entity_1.Photo, (photo) => photo.user, { eager: true, cascade: true }),
    __metadata("design:type", user_photos_entity_1.Photo)
], OauthUser.prototype, "photos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payments, (payment) => payment.user, { eager: true, cascade: true }),
    __metadata("design:type", payment_entity_1.Payments)
], OauthUser.prototype, "payments", void 0);
OauthUser = __decorate([
    (0, typeorm_1.Entity)({ name: 'user' }),
    __metadata("design:paramtypes", [Object])
], OauthUser);
exports.OauthUser = OauthUser;
//# sourceMappingURL=useroauth.entity.js.map