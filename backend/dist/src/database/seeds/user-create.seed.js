"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCreateSeeder = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../modules/user/entities/user.entity");
class UserCreateSeeder {
    async run(factory, connection) {
        await (0, typeorm_1.getManager)().query(`DELETE from user WHERE role = 'CUSTOMER'`);
        await factory(user_entity_1.User)().createMany(20);
        await factory(user_entity_1.User)().create();
    }
}
exports.UserCreateSeeder = UserCreateSeeder;
//# sourceMappingURL=user-create.seed.js.map