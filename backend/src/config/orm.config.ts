import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { resolve } from 'path';
import { DataSourceOptions } from 'typeorm';
// default directories
const ENTITIES_DIR = resolve(__dirname, '../', '**', 'entities', '*.entity.{ts,js}');

const MIGRATIONS_DIR = resolve(__dirname, '../', '**', 'migrations', '*.{ts,js}');
const ORMConfig: TypeOrmModuleOptions = {
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
  // seeds: ['src/database/seeds/**/*{.ts,.js}'],
  // factories: ['src/database/factories/**/*{.ts,.js}'],
};
module.exports = ORMConfig;
