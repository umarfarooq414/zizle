"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesModule = void 0;
const cloudinary_config_1 = require("./../../config/cloudinary.config");
const notes_service_1 = require("./notes.service");
const auth_module_1 = require("../auth/auth.module");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const notes_entity_1 = require("./entities/notes.entity");
const notes_controller_1 = require("./notes.controller");
const mail_service_1 = require("../mail/mail.service");
const email_entity_1 = require("../mail/entities/email.entity");
const user_module_1 = require("../user/user.module");
let NotesModule = class NotesModule {
};
NotesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, notes_entity_1.Notes, email_entity_1.Email]), auth_module_1.AuthModule, user_module_1.UserModule],
        controllers: [notes_controller_1.NotesController],
        providers: [notes_service_1.NotesService, mail_service_1.MailService, cloudinary_config_1.CloudinaryConfigService],
    })
], NotesModule);
exports.NotesModule = NotesModule;
//# sourceMappingURL=notes.module.js.map