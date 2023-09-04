"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const user_module_1 = require("./../user/user.module");
const fake_module_1 = require("./../fake/fake.module");
const mail_service_1 = require("./../mail/mail.service");
const auth_module_1 = require("../auth/auth.module");
const chat_controller_1 = require("./chat.controller");
const chat_service_1 = require("./chat.service");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const attachment_entity_1 = require("./entities/attachment.entity");
const chat_entity_1 = require("./entities/chat.entity");
const chat_gateway_1 = require("./chat.gateway");
const fakeChat_entity_1 = require("../fake/entities/fakeChat.entity");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const user_fallout_entity_1 = require("../user/entities/user.fallout.entity");
const email_entity_1 = require("../mail/entities/email.entity");
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, chat_entity_1.Chat, attachment_entity_1.Attachment, fakeChat_entity_1.FakeChat, user_fallout_entity_1.FallOutUsers, email_entity_1.Email]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => fake_module_1.FakeModule),
            user_module_1.UserModule,
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [chat_service_1.ChatService, chat_gateway_1.ChatsGateway, mail_service_1.MailService, cloudinary_config_1.CloudinaryConfigService],
        exports: [chat_gateway_1.ChatsGateway, chat_service_1.ChatService],
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map