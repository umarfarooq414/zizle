import { type Connection, getManager } from 'typeorm';
import { type Factory, type Seeder } from 'typeorm-seeding';
import { User } from '../../modules/user/entities/user.entity';

export class UserCreateSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) {
    // await getManager().query('TRUNCATE customer_profile_data');
    // eslint-disable-next-line quotes
    await getManager().query(`DELETE from user WHERE role = 'CUSTOMER'`);
    await factory(User)().createMany(20);
    await factory(User)().create();
  }
}
