"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const mail_service_1 = require("./../mail/mail.service");
const user_account_transaction_entity_1 = require("./entities/user.account.transaction.entity");
const customer_profiledata_entity_1 = require("./entities/customer.profiledata.entity");
const auth_module_1 = require("./../auth/auth.module");
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_transaction_actiontypes_entity_1 = require("./entities/user.transaction.actiontypes.entity");
const visit_profile_entity_1 = require("./entities/visit.profile.entity");
const customer_favourite_entity_1 = require("./entities/customer.favourite.entity");
const user_address_entity_1 = require("./entities/user.address.entity");
const user_block_entity_1 = require("./entities/user.block.entity");
const user_photos_entity_1 = require("./entities/user.photos.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const bonusCode_entity_1 = require("../auth/entities/bonusCode.entity");
const email_entity_1 = require("../mail/entities/email.entity");
const contactSupport_entity_1 = require("./entities/contactSupport.entity");
const notifications_entity_1 = require("./entities/notifications.entity");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                customer_profiledata_entity_1.CustomerProfileData,
                user_transaction_actiontypes_entity_1.UserTransactionActionTypes,
                user_account_transaction_entity_1.UserAccountTransaction,
                visit_profile_entity_1.VisitProfile,
                customer_favourite_entity_1.Favorite,
                user_address_entity_1.Address,
                user_block_entity_1.Block,
                user_photos_entity_1.Photo,
                payment_entity_1.Payments,
                bonusCode_entity_1.BonusCode,
                email_entity_1.Email,
                contactSupport_entity_1.ContactSupport,
                notifications_entity_1.Notifications,
            ]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, mail_service_1.MailService, cloudinary_config_1.CloudinaryConfigService],
        exports: [user_service_1.UserService],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map