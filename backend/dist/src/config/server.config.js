"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../libs/types/src");
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)(types_1.ConfigEnum.SERVER, () => ({
    port: parseInt(process.env.BACKEND_APP_PORT, 10) || 5500,
    productName: process.env.PRODUCT_NAME,
    frontendUrlClient: process.env.FRONTEND_URL_CLIENT,
    frontendUrlAdmin: process.env.FRONTEND_URL_ADMIN,
    frontendUrlModerator: process.env.FRONTEND_URL_MODERATOR,
    backendUrl: process.env.BACKEND_URL,
    authOtpVerificationLink: process.env.AUTH_OTP_VERIFICATION_LINK,
    authLoginLink: process.env.AUTH_LOGIN_LINK,
    admin: {
        userName: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        firstName: process.env.ADMIN_FIRST_NAME || 'Super',
        lastName: process.env.ADMIN_LAST_NAME || 'Admin',
        password: process.env.ADMIN_PASSWORD || 'adminPassword',
    },
}));
//# sourceMappingURL=server.config.js.map