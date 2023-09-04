"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const ORMConfig = require("./orm.config");
exports.AppDataSource = new typeorm_1.DataSource(ORMConfig);
//# sourceMappingURL=orm.config-migrations.js.map