"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const payment_entity_1 = require("../payments/entities/payment.entity");
const email_entity_1 = require("./../mail/entities/email.entity");
const fakeChat_entity_1 = require("../fake/entities/fakeChat.entity");
const google_client_1 = require("./clients/google.client");
const facebook_client_1 = require("./clients/facebook.client");
const chat_module_1 = require("./../chat/chat.module");
const user_account_transaction_entity_1 = require("./../user/entities/user.account.transaction.entity");
const customer_profiledata_entity_1 = require("../user/entities/customer.profiledata.entity");
const jwt_strategy_1 = require("./../../strategies/jwt.strategy");
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const auth_helper_1 = require("./auth.helper");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../user/entities/user.entity");
const useroauth_entity_1 = require("../user/entities/useroauth.entity");
const typeorm_1 = require("@nestjs/typeorm");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const types_1 = require("../../../libs/types/src");
const mail_module_1 = require("../mail/mail.module");
const user_transaction_actiontypes_entity_1 = require("../user/entities/user.transaction.actiontypes.entity");
const token_entity_1 = require("./entities/token.entity");
const chat_service_1 = require("../chat/chat.service");
const chat_entity_1 = require("../chat/entities/chat.entity");
const attachment_entity_1 = require("../chat/entities/attachment.entity");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const mod_service_1 = require("./mod.service");
const mod_controller_1 = require("./mod.controller");
const user_fallout_entity_1 = require("../user/entities/user.fallout.entity");
const visit_profile_entity_1 = require("../user/entities/visit.profile.entity");
const bonusCode_entity_1 = require("./entities/bonusCode.entity");
const userBonusCode_entity_1 = require("./entities/userBonusCode.entity");
const scheduleMessage_entity_1 = require("./entities/scheduleMessage.entity");
const contactSupport_entity_1 = require("../user/entities/contactSupport.entity");
const notifications_entity_1 = require("../user/entities/notifications.entity");
const user_module_1 = require("../user/user.module");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                useroauth_entity_1.OauthUser,
                customer_profiledata_entity_1.CustomerProfileData,
                user_account_transaction_entity_1.UserAccountTransaction,
                user_transaction_actiontypes_entity_1.UserTransactionActionTypes,
                token_entity_1.Token,
                user_fallout_entity_1.FallOutUsers,
                chat_entity_1.Chat,
                visit_profile_entity_1.VisitProfile,
                bonusCode_entity_1.BonusCode,
                fakeChat_entity_1.FakeChat,
                attachment_entity_1.Attachment,
                userBonusCode_entity_1.UserBonusCode,
                scheduleMessage_entity_1.ScheduleMessage,
                email_entity_1.Email,
                payment_entity_1.Payments,
                contactSupport_entity_1.ContactSupport,
                notifications_entity_1.Notifications,
            ]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: process.env.JWT_SECRET || config.get(types_1.ConfigEnum.JWT_TOKEN).secret,
                    signOptions: {
                        expiresIn: process.env.JWT_EXPIRES || config.get(types_1.ConfigEnum.JWT_TOKEN).expireIn,
                    },
                }),
            }),
            mail_module_1.MailModule,
            (0, common_1.forwardRef)(() => chat_module_1.ChatModule),
            user_module_1.UserModule,
        ],
        controllers: [auth_controller_1.AuthController, mod_controller_1.ModController],
        providers: [
            auth_helper_1.AuthHelper,
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            cloudinary_config_1.CloudinaryConfigService,
            facebook_client_1.FacebookClient,
            google_client_1.GoogleClient,
            mod_service_1.ModService,
            chat_service_1.ChatService,
        ],
        exports: [auth_service_1.AuthService, auth_helper_1.AuthHelper],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map