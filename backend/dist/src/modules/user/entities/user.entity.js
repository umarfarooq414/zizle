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
exports.User = void 0;
const fakeUser_entity_1 = require("./fakeUser.entity");
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
const user_fallout_entity_1 = require("./user.fallout.entity");
const bonusCode_entity_1 = require("../../auth/entities/bonusCode.entity");
const userBonusCode_entity_1 = require("../../auth/entities/userBonusCode.entity");
const contactSupport_entity_1 = require("./contactSupport.entity");
const notifications_entity_1 = require("./notifications.entity");
let User = class User {
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
    setEmail(email) {
        this.email = email;
    }
    setSelfGender(selfGender) {
        this.selfGender = selfGender;
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
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'enum',
        enum: user_1.SocialProviderEnum,
        default: null,
    }),
    __metadata("design:type", String)
], User.prototype, "SocialProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_1.UserStatusEnum,
        default: user_1.UserStatusEnum.UNVERIFIED,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_1.UserRoleEnum,
        default: user_1.UserRoleEnum.CUSTOMER,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_1.UserSelfGenderEnum,
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "selfGender", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_1.UserInterestedGenderEnum,
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "interestedGender", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "online", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "disable", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => customer_profiledata_entity_1.CustomerProfileData, (profile) => profile.user, { cascade: true, eager: true }),
    __metadata("design:type", customer_profiledata_entity_1.CustomerProfileData)
], User.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_address_entity_1.Address, (address) => address.user, { eager: true, cascade: true }),
    __metadata("design:type", user_address_entity_1.Address)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_account_transaction_entity_1.UserAccountTransaction, (transaction) => transaction.user, { eager: true, cascade: true }),
    __metadata("design:type", user_account_transaction_entity_1.UserAccountTransaction)
], User.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contactSupport_entity_1.ContactSupport, (query) => query.user, { cascade: true }),
    __metadata("design:type", contactSupport_entity_1.ContactSupport)
], User.prototype, "contactSupport", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => visit_profile_entity_1.VisitProfile, (visit) => visit.visitor, { eager: true, cascade: true }),
    __metadata("design:type", visit_profile_entity_1.VisitProfile)
], User.prototype, "visits", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notifications_entity_1.Notifications, (notification) => notification.notifier, { cascade: true }),
    __metadata("design:type", notifications_entity_1.Notifications)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_block_entity_1.Block, (block) => block.blocked, { eager: true, cascade: true }),
    __metadata("design:type", user_block_entity_1.Block)
], User.prototype, "blocked", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_favourite_entity_1.Favorite, (fav) => fav.favorites, { eager: true, cascade: true }),
    __metadata("design:type", customer_favourite_entity_1.Favorite)
], User.prototype, "favorite", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_photos_entity_1.Photo, (photo) => photo.user, { eager: true, cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "photos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payments, (payment) => payment.user, { eager: true, cascade: true }),
    __metadata("design:type", payment_entity_1.Payments)
], User.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => fakeUser_entity_1.FakeCreator, (fake) => fake.user, { eager: true, cascade: true }),
    __metadata("design:type", fakeUser_entity_1.FakeCreator)
], User.prototype, "fakes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_fallout_entity_1.FallOutUsers, (fallOutUsers) => fallOutUsers.fake, { eager: true, cascade: true }),
    __metadata("design:type", user_fallout_entity_1.FallOutUsers)
], User.prototype, "fallOutFakes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_fallout_entity_1.FallOutUsers, (fallOutUsers) => fallOutUsers.user, { eager: true, cascade: true }),
    __metadata("design:type", user_fallout_entity_1.FallOutUsers)
], User.prototype, "fallOutUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bonusCode_entity_1.BonusCode, (bonusCode) => bonusCode.creator, { eager: true, cascade: true }),
    __metadata("design:type", user_fallout_entity_1.FallOutUsers)
], User.prototype, "bonus", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => userBonusCode_entity_1.UserBonusCode, (userBonusCode) => userBonusCode.user, { eager: true, cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "usedBonusCodes", void 0);
User = __decorate([
    (0, typeorm_1.Entity)({ name: 'user' }),
    __metadata("design:paramtypes", [Object])
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map