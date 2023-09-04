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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const subscription_entity_1 = require("./entities/subscription.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_helper_1 = require("../auth/auth.helper");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const types_1 = require("../../../libs/types/src");
const user_subscription_entity_1 = require("./entities/user.subscription.entity");
let SubscriptionsService = class SubscriptionsService {
    constructor(userRepository, subscriptionRepository, userSubscription, helper) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.userSubscription = userSubscription;
        this.helper = helper;
    }
    async createSubscription(body) {
        const { creator, packageType } = body;
        const senderExist = await this.userRepository.findOne({
            where: {
                id: creator,
            },
        });
        if ((senderExist === null || senderExist === void 0 ? void 0 : senderExist.role) === types_1.UserRoleEnum.ADMIN) {
            const subscription = new subscription_entity_1.Subscription(Object.assign({}, body));
            return await this.subscriptionRepository.save(subscription);
        }
        else {
            throw new common_1.HttpException('Sender not found!', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async findAll() {
        return await this.subscriptionRepository.find();
    }
    async findUserPackages(token) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            const userPackages = await this.getUserPackages(user);
            const packages = await this.subscriptionRepository.find();
            const filteredPackages = packages.filter((pkg) => {
                return !userPackages.some((userPackage) => userPackage.package.id === pkg.id);
            });
            return filteredPackages;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async getUserPackages(user) {
        const packages = await this.userSubscription.find({
            where: { user: { id: user.id } },
            relations: ['package'],
        });
        return packages;
    }
    async findOne(id) {
        const subscription = await this.subscriptionRepository.findOneBy({ id });
        if (subscription == null) {
            throw new common_1.HttpException('Subscription not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return subscription;
    }
    async updateById(id, body) {
        const subscription = await this.subscriptionRepository.findOneBy({ id });
        if (subscription == null) {
            throw new common_1.HttpException('Subscription not found!', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            if (body.amount >= 0)
                subscription.setSubscriptionAmount(body.amount);
            if (body.noOfCoins >= 0)
                subscription.setSubscriptionNoOfCoins(body.noOfCoins);
            if (body.bestSelling || !body.bestSelling) {
                subscription.setSubscriptionBestSelling(body.bestSelling);
            }
            if (body.packageType)
                subscription.setSubscriptionPackageType(body.packageType);
            return await this.subscriptionRepository.save(subscription);
        }
    }
    async deleteById(id) {
        const subscription = await this.subscriptionRepository.findOneBy({ id });
        if (subscription == null) {
            throw new common_1.HttpException('Subscription not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return await this.subscriptionRepository.remove(subscription);
    }
};
SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(2, (0, typeorm_1.InjectRepository)(user_subscription_entity_1.UserSubscription)),
    __param(3, (0, common_1.Inject)(auth_helper_1.AuthHelper)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_helper_1.AuthHelper])
], SubscriptionsService);
exports.SubscriptionsService = SubscriptionsService;
//# sourceMappingURL=subscriptions.service.js.map