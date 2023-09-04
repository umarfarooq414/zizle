"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeModule = void 0;
const fakeUser_entity_1 = require("./../user/entities/fakeUser.entity");
const mail_service_1 = require("./../mail/mail.service");
const customer_profiledata_entity_1 = require("./../user/entities/customer.profiledata.entity");
const auth_module_1 = require("./../auth/auth.module");
const chat_module_1 = require("./../chat/chat.module");
const common_1 = require("@nestjs/common");
const fake_controller_1 = require("./fake.controller");
const fake_service_1 = require("./fake.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const email_entity_1 = require("../mail/entities/email.entity");
const user_module_1 = require("../user/user.module");
const user_photos_entity_1 = require("../user/entities/user.photos.entity");
let FakeModule = class FakeModule {
};
FakeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, customer_profiledata_entity_1.CustomerProfileData, fakeUser_entity_1.FakeCreator, email_entity_1.Email, user_photos_entity_1.Photo]),
            chat_module_1.ChatModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
        ],
        controllers: [fake_controller_1.FakeController],
        providers: [fake_service_1.FakeService, mail_service_1.MailService, cloudinary_config_1.CloudinaryConfigService],
        exports: [fake_service_1.FakeService],
    })
], FakeModule);
exports.FakeModule = FakeModule;
//# sourceMappingURL=fake.module.js.map