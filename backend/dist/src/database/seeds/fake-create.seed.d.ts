import { type Connection } from 'typeorm';
import { type Factory, type Seeder } from 'typeorm-seeding';
export declare class FakeCreateSeeder implements Seeder {
    run(factory: Factory, connection: Connection): Promise<void>;
}
