"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const subscriptions_service_1 = require("./../subscriptions/subscriptions.service");
const mail_service_1 = require("./../mail/mail.service");
const auth_module_1 = require("./../auth/auth.module");
const common_1 = require("@nestjs/common");
const payments_controller_1 = require("./payments.controller");
const payments_service_1 = require("./payments.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const payment_entity_1 = require("./entities/payment.entity");
const subscription_entity_1 = require("../subscriptions/entities/subscription.entity");
const user_account_transaction_entity_1 = require("../user/entities/user.account.transaction.entity");
const user_transaction_actiontypes_entity_1 = require("../user/entities/user.transaction.actiontypes.entity");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const email_entity_1 = require("../mail/entities/email.entity");
const user_module_1 = require("../user/user.module");
const user_subscription_entity_1 = require("../subscriptions/entities/user.subscription.entity");
let PaymentsModule = class PaymentsModule {
};
PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                payment_entity_1.Payments,
                subscription_entity_1.Subscription,
                user_account_transaction_entity_1.UserAccountTransaction,
                user_transaction_actiontypes_entity_1.UserTransactionActionTypes,
                email_entity_1.Email,
                user_subscription_entity_1.UserSubscription,
            ]),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
        ],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService, mail_service_1.MailService, subscriptions_service_1.SubscriptionsService, cloudinary_config_1.CloudinaryConfigService],
    })
], PaymentsModule);
exports.PaymentsModule = PaymentsModule;
//# sourceMappingURL=payments.module.js.map