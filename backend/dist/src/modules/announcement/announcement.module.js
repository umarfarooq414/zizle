"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementsModule = void 0;
const auth_module_1 = require("../auth/auth.module");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const announcement_entity_1 = require("./entities/announcement.entity");
const announcement_service_1 = require("./announcement.service");
const announcement_controller_1 = require("./announcement.controller");
const mail_service_1 = require("../mail/mail.service");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const email_entity_1 = require("../mail/entities/email.entity");
const user_module_1 = require("../user/user.module");
let AnnouncementsModule = class AnnouncementsModule {
};
AnnouncementsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, announcement_entity_1.Announcement, email_entity_1.Email]), auth_module_1.AuthModule, user_module_1.UserModule],
        controllers: [announcement_controller_1.AnnouncementController],
        providers: [announcement_service_1.AnnouncementService, mail_service_1.MailService, cloudinary_config_1.CloudinaryConfigService],
    })
], AnnouncementsModule);
exports.AnnouncementsModule = AnnouncementsModule;
//# sourceMappingURL=announcement.module.js.map