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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const auth_helper_1 = require("../auth/auth.helper");
const subscription_entity_1 = require("../subscriptions/entities/subscription.entity");
const payment_entity_1 = require("./entities/payment.entity");
const user_service_1 = require("../user/user.service");
const types_1 = require("../../../libs/types/src");
const user_account_transaction_entity_1 = require("../user/entities/user.account.transaction.entity");
const user_transaction_actiontypes_entity_1 = require("../user/entities/user.transaction.actiontypes.entity");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
const stripe_1 = require("stripe");
const user_subscription_entity_1 = require("../subscriptions/entities/user.subscription.entity");
let PaymentsService = class PaymentsService {
    constructor(entity) {
        this.entity = entity;
        this.stripe = new stripe_1.default('sk_test_51MucYBIV9M9aqYDutZ1WfzRewVpCkQtUMMM1HRmHPhkVtu1xIrzXJXDTgOQYyFBOF03vXRxQMsoNGbu2Sb5cByJl00FcZzL7Ma', {
            apiVersion: '2020-08-27',
        });
    }
    async createPayment(paymentRequestBody) {
        let sumAmount = 0;
        const decoded = await this.helper.decode(paymentRequestBody === null || paymentRequestBody === void 0 ? void 0 : paymentRequestBody.token);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        paymentRequestBody.products.forEach((product) => {
            sumAmount = sumAmount + product.price;
        });
        return this.stripe.paymentIntents.create({
            amount: sumAmount,
            currency: paymentRequestBody.currency,
        });
    }
    async storepayment(res, paymentRequestBody) {
        const decoded = await this.helper.decode(paymentRequestBody === null || paymentRequestBody === void 0 ? void 0 : paymentRequestBody.token);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const packageObject = await this.subscription.findOneBy({
            packageName: paymentRequestBody.products[0].title,
        });
        if (packageObject.oneTime) {
            this.storeRefInUserPackage(user, packageObject);
        }
        await this.grantCoinsForPackage(user, packageObject);
        const obj = {
            transactionId: res.id,
            secretField: res.client_secret,
            amount: res.amount,
            packageName: paymentRequestBody === null || paymentRequestBody === void 0 ? void 0 : paymentRequestBody.products[0].title,
            currency: res.currency,
            timestamp: new Date(),
            user: user,
        };
        const transaction = this.entity.create(payment_entity_1.Payments, obj);
        await this.entity.save(payment_entity_1.Payments, transaction);
    }
    async processPayment(query, res) {
        const { errorcode, transactionId, secretfield, auth, token, id, currency, amount } = query;
        const decoded = await this.helper.decode(token);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (errorcode !== '00') {
            throw new common_1.HttpException('Payment failed', common_1.HttpStatus.BAD_REQUEST);
        }
        const packageObject = await this.subscription.findOneBy({ id: id });
        if (packageObject.oneTime) {
            this.storeRefInUserPackage(user, packageObject);
        }
        await this.createPaymentt({
            user,
            transactionId,
            secretfield,
            packageObject,
            currency,
        });
        await this.grantCoinsForPackage(user, packageObject);
        res.set('Date', new Date().toUTCString());
        res.set('Content-Type', 'text/plain');
        res.set('Connection', 'close');
        res.status(200).send('status=ok\nurl=https://zizle.de/subscriptionpurchased\nforward=1\ntarget=_self\n');
    }
    async storeRefInUserPackage(user, packageObject) {
        const userPackage = await this.userSubscription.findOne({
            where: {
                user: { id: user.id },
                package: { id: packageObject.id },
            },
        });
        if (userPackage) {
            throw new common_1.HttpException('This user has already used this package once.', common_1.HttpStatus.CONFLICT);
        }
        const newUserPackage = new user_subscription_entity_1.UserSubscription();
        newUserPackage.user = user;
        newUserPackage.package = packageObject;
        return await this.userSubscription.save(newUserPackage);
    }
    async createPaymentt({ user, transactionId, secretfield, packageObject, currency }) {
        const payments = new payment_entity_1.Payments();
        payments.amount = packageObject.amount;
        payments.secretField = secretfield;
        payments.transactionId = transactionId;
        payments.packageName = packageObject.packageName;
        payments.user = user;
        payments.currency = currency;
        return await this.paymentsRepository.save(payments);
    }
    async grantCoinsForPackage(user, packagee) {
        const currentCoins = await this.userService.getCurrentCoinsFromDB(user);
        const cost = await (0, types_1.getAmountForEachAction)(types_1.TransactionActionTypes.PACKAGE_SUBSCRIPTION, packagee.id, this.subscriptionService);
        const actionType = await this.entity.findOne(user_transaction_actiontypes_entity_1.UserTransactionActionTypes, {
            where: {
                actionType: types_1.TransactionActionTypes.PACKAGE_SUBSCRIPTION,
            },
        });
        const obj = {
            user,
            cost,
            currentCoins: currentCoins + cost,
            actionType,
        };
        const transaction = this.entity.create(user_account_transaction_entity_1.UserAccountTransaction, obj);
        await this.entity.save(user_account_transaction_entity_1.UserAccountTransaction, transaction);
    }
    async findOne(token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const payments = await this.paymentsRepository.find({
            where: {
                user: { id: user.id },
            },
        });
        if (payments == null) {
            throw new common_1.HttpException('Payment not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return payments;
    }
};
__decorate([
    (0, typeorm_1.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], PaymentsService.prototype, "repository", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription),
    __metadata("design:type", typeorm_2.Repository)
], PaymentsService.prototype, "subscription", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(user_subscription_entity_1.UserSubscription),
    __metadata("design:type", typeorm_2.Repository)
], PaymentsService.prototype, "userSubscription", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(payment_entity_1.Payments),
    __metadata("design:type", typeorm_2.Repository)
], PaymentsService.prototype, "paymentsRepository", void 0);
__decorate([
    (0, common_1.Inject)(auth_helper_1.AuthHelper),
    __metadata("design:type", auth_helper_1.AuthHelper)
], PaymentsService.prototype, "helper", void 0);
__decorate([
    (0, common_1.Inject)(user_service_1.UserService),
    __metadata("design:type", user_service_1.UserService)
], PaymentsService.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(subscriptions_service_1.SubscriptionsService),
    __metadata("design:type", subscriptions_service_1.SubscriptionsService)
], PaymentsService.prototype, "subscriptionService", void 0);
__decorate([
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsService.prototype, "processPayment", null);
PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_2.EntityManager])
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map