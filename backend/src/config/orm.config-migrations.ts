import { DataSource } from 'typeorm';
import * as ORMConfig from './orm.config';

export const AppDataSource = new DataSource(ORMConfig as any);
