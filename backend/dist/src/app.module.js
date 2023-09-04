"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.TypeOrmAsyncConfig = exports.typeOrmConfig = void 0;
const cloudinary_config_1 = require("./config/cloudinary.config");
const fake_module_1 = require("./modules/fake/fake.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const ORMConfig = require("./config/orm.config");
const server_config_1 = require("./config/server.config");
const swagger_config_1 = require("./config/swagger.config");
const mailConfig_1 = require("./config/mailConfig");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const jwtConfig_1 = require("./config/jwtConfig");
const notes_module_1 = require("./modules/notes/notes.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const chat_module_1 = require("./modules/chat/chat.module");
const announcement_module_1 = require("./modules/announcement/announcement.module");
const coins_module_1 = require("./modules/coins/coins.module");
const payments_module_1 = require("./modules/payments/payments.module");
const gallery_module_1 = require("./modules/gallery/gallery.module");
exports.typeOrmConfig = ORMConfig;
exports.TypeOrmAsyncConfig = {
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: async () => {
        return ORMConfig;
    },
};
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                load: [server_config_1.default, jwtConfig_1.default, mailConfig_1.default, swagger_config_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync(exports.TypeOrmAsyncConfig),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            chat_module_1.ChatModule,
            notes_module_1.NotesModule,
            announcement_module_1.AnnouncementsModule,
            subscriptions_module_1.SubscriptionsModule,
            fake_module_1.FakeModule,
            coins_module_1.CoinsModule,
            payments_module_1.PaymentsModule,
            gallery_module_1.GalleryModule,
        ],
        controllers: [],
        providers: [cloudinary_config_1.CloudinaryConfigService],
        exports: [cloudinary_config_1.CloudinaryConfigService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map