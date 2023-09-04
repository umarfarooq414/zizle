import { FallOutUsers } from './../user/entities/user.fallout.entity';
import { In } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';
import { NotificationAction, UserRoleEnum } from '@lib/types';
import { Chat } from '../chat/entities/chat.entity';
import { VisitProfile } from '../user/entities/visit.profile.entity';
import { ChatsGateway } from '../chat/chat.gateway';
import { Notifications } from '../user/entities/notifications.entity';
@Injectable()
export class ModService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @InjectRepository(Notifications)
  private readonly notificationsRepo: Repository<Notifications>;

  @InjectRepository(Chat)
  private readonly chatRepository: Repository<Chat>;

  @InjectRepository(VisitProfile)
  private readonly visitProfileRepo: Repository<VisitProfile>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  @Inject(ChatsGateway)
  private readonly chatGateway: ChatsGateway;

  public async getUsers(token: string) {
    const tokenValue = token.includes('Bearer') ? token.split(' ')[1] : token;
    const decoded = await this.helper.decode(tokenValue as string);
    const user: User = decoded ? await this.helper.validateUser(decoded) : null;
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    if (user.role !== UserRoleEnum.MODERATOR) throw new HttpException('User must be Moderator!', HttpStatus.NOT_FOUND);
    const users = await this.repository.find({
      where: {
        role: In([UserRoleEnum.FAKE, UserRoleEnum.CUSTOMER]),
      },
    });
    const fakeUsers = { usersList: users, unseenFakeIds: await this.getUnseenMessageCount(token) };

    return fakeUsers;
  }

  public async getUnseenMessageCount(token: string) {
    token = token.includes('Bearer') ? token.split(' ')[1] : token;
    const decoded = await this.helper.decode(token as string);
    const user: User = decoded ? await this.helper.validateUser(decoded) : null;
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    if (user.role !== UserRoleEnum.MODERATOR) throw new HttpException('User must be Moderator!', HttpStatus.NOT_FOUND);
    const customerRoleUsers = await this.repository.find({ where: { role: UserRoleEnum.CUSTOMER } });
    const fakeRoleUsers = await this.repository.find({ where: { role: UserRoleEnum.FAKE } });
    const fakeRoleUserIds = fakeRoleUsers.map((user) => user.id);
    const userRoleUserIds = customerRoleUsers.map((user) => user.id);
    const messagesToFakeRoleUsers = await this.chatRepository
      .createQueryBuilder('chat')
      .where('chat.sender IN (:...userRoleUserIds)', { userRoleUserIds })
      .andWhere('chat.receiver IN (:...fakeRoleUserIds)', { fakeRoleUserIds })
      .andWhere('chat.seen = :seen', { seen: false })
      .getMany();
    const fakesIds = messagesToFakeRoleUsers.map((user) => user.receiver);
    const distinctFake = [...new Set(fakesIds.map((item) => item))];
    return distinctFake;
  }

  async createBulkProfileVisits(token, fakeUserIds: string[], customerUserIds: string[]): Promise<VisitProfile[]> {
    try {
      token = token.includes('Bearer') ? token.split(' ')[1] : token;
      const decoded = await this.helper.decode(token as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.MODERATOR)
        throw new HttpException('User must be Moderator!', HttpStatus.NOT_FOUND);

      const allUserIds = [...fakeUserIds, ...customerUserIds];
      const allUsers = await this.repository.find({ where: { id: In(allUserIds) } });
      let fakeUsers = allUsers?.filter((user) => fakeUserIds?.includes(user.id));
      const customerUsers = allUsers?.filter((user) => customerUserIds?.includes(user.id));

      const profileVisits: VisitProfile[] = [];
      if (customerUsers?.length < fakeUsers?.length) {
        const numFakeUsersToUse = customerUsers?.length;
        const shuffledFakeUserIds = fakeUserIds?.sort(() => 0.5 - Math.random());
        const selectedFakeUserIds = shuffledFakeUserIds?.slice(0, numFakeUsersToUse);
        fakeUsers = allUsers?.filter((user) => selectedFakeUserIds?.includes(user.id));
      }

      for (const customerUser of customerUsers) {
        const fakeUserIndex = profileVisits?.length % fakeUsers?.length; // Get the index of the next fakeUser to visit this customerUser
        const fakeUser = fakeUsers[fakeUserIndex];
        const profileVisit = new VisitProfile();
        profileVisit.visitor = fakeUser;
        profileVisit.visited = customerUser;
        profileVisit.creatorId = user.id;
        profileVisits.push(profileVisit);
        const notification = new Notifications();
        notification.category = NotificationAction.VISITED;
        notification.seen = false;
        notification.notifier = fakeUser;
        notification.notified = customerUser;
        const message = `${fakeUser.userName} ${notification.category.toLowerCase()} your profile`;
        notification.message = message;
        await this.notificationsRepo.save(notification);
      }

      const res = await this.visitProfileRepo.save(profileVisits);
      if (res) {
        this.chatGateway.sendBulk(customerUserIds, res);
        return res;
      }
    } catch (error) {
      throw new HttpException('could not send bulk visits', HttpStatus.BAD_REQUEST);
    }
  }

  public async getAvailableUsers(token: string): Promise<User[]> {
    token = token.includes('Bearer') ? token.split(' ')[1] : token;
    const decoded = await this.helper.decode(token as string);
    const user: User = decoded ? await this.helper.validateUser(decoded) : null;
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    if (user.role !== UserRoleEnum.MODERATOR) throw new HttpException('User must be Moderator!', HttpStatus.NOT_FOUND);
    return await this.repository.find({
      where: {
        role: UserRoleEnum.CUSTOMER,
        online: true,
      },
    });
  }
}
