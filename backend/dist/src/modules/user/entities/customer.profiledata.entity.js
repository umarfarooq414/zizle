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
exports.CustomerProfileData = void 0;
const user_1 = require("../../../../libs/types/src/db/entities/user");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let CustomerProfileData = class CustomerProfileData {
    constructor(params) {
        if (params != null) {
            if (params.children)
                this.children = params.children;
            if (params.profileText)
                this.profileText = params.profileText;
            this.smoker = params.smoke;
            if (params.life)
                this.life = params.life;
            if (params.relationshipStatus)
                this.relationshipStatus = params.relationshipStatus;
            if (params.isEmailVerified)
                this.isEmailVerified = params.isEmailVerified;
            if (params.avatarUrl)
                this.avatarUrl = params.avatarUrl;
            if (params.isEmailVerified)
                this.isProfileVerified = params.isProfileVerified;
            if (params.mobileNumber)
                this.mobileNumber = params.mobileNumber;
            if (params.dob)
                this.dateOfBirth = params.dob;
        }
    }
    setRelationShipStatus(relationshipStatus) {
        this.relationshipStatus = relationshipStatus;
    }
    setChildren(children) {
        this.children = children;
    }
    setProfileText(profileText) {
        this.profileText = profileText;
    }
    setSmoker(smoker) {
        this.smoker = smoker;
    }
    setLife(life) {
        this.life = life;
    }
    setIsEmailVerified(isEmailVerified) {
        this.isEmailVerified = isEmailVerified;
    }
    setAvatarUrl(avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
    setIsProfileVerified(isProfileVerified) {
        this.isProfileVerified = isProfileVerified;
    }
    setMobileNumber(mobileNumber) {
        this.mobileNumber = mobileNumber;
    }
    setDateOfBirth(dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], CustomerProfileData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        default: null,
    }),
    __metadata("design:type", String)
], CustomerProfileData.prototype, "relationshipStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'enum',
        enum: user_1.CustomerChildrenEnum,
        default: null,
    }),
    __metadata("design:type", String)
], CustomerProfileData.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CustomerProfileData.prototype, "profileText", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        default: null,
    }),
    __metadata("design:type", String)
], CustomerProfileData.prototype, "life", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'enum',
        enum: user_1.CustomerSmokeStatus,
        default: null,
    }),
    __metadata("design:type", String)
], CustomerProfileData.prototype, "smoker", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        default: user_1.UserStatusEnum.UNVERIFIED,
    }),
    __metadata("design:type", String)
], CustomerProfileData.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 250, nullable: true, default: null }),
    __metadata("design:type", String)
], CustomerProfileData.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: user_1.CustomerProfileEnum.UNVERIFIED, nullable: true, type: 'enum', enum: user_1.CustomerProfileEnum }),
    __metadata("design:type", String)
], CustomerProfileData.prototype, "isProfileVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, nullable: true, default: null }),
    __metadata("design:type", String)
], CustomerProfileData.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: Date }),
    __metadata("design:type", Date)
], CustomerProfileData.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CustomerProfileData.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CustomerProfileData.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.profile, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], CustomerProfileData.prototype, "user", void 0);
CustomerProfileData = __decorate([
    (0, typeorm_1.Entity)({ name: 'customer_profile_data' }),
    __metadata("design:paramtypes", [Object])
], CustomerProfileData);
exports.CustomerProfileData = CustomerProfileData;
//# sourceMappingURL=customer.profiledata.entity.js.map