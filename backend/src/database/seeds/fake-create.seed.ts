import { type Connection, getConnection, getManager } from 'typeorm';
import { type Factory, type Seeder } from 'typeorm-seeding';
import { User } from '../../modules/user/entities/user.entity';
import { UserRoleEnum } from '../../../libs/types/src';

export class FakeCreateSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) {
    // const adminRepository = getConnection().getRepository(User);
    // const admin = await adminRepository.findOneBy({ role: UserRoleEnum.ADMIN });
    // await getManager().query('TRUNCATE fake');
    // factory(Fake)()
    //   .map(async (fake: Fake) => {
    //     fake.creator = admin.id;
    //     return fake;
    //   })
    //   .createMany(20);
  }
}
