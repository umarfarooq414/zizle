"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const ENTITIES_DIR = (0, path_1.resolve)(__dirname, '../', '**', 'entities', '*.entity.{ts,js}');
const MIGRATIONS_DIR = (0, path_1.resolve)(__dirname, '../', '**', 'migrations', '*.{ts,js}');
const ORMConfig = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'qwQWasAS@1',
    database: process.env.DB_DATABASE || 'zizle',
    synchronize: false,
    entities: [ENTITIES_DIR],
    migrationsRun: false,
    autoLoadEntities: true,
    migrations: [MIGRATIONS_DIR],
    dropSchema: false,
};
module.exports = ORMConfig;
//# sourceMappingURL=orm.config.js.map