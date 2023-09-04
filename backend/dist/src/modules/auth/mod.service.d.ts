import { User } from '../user/entities/user.entity';
import { VisitProfile } from '../user/entities/visit.profile.entity';
export declare class ModService {
    private readonly repository;
    private readonly notificationsRepo;
    private readonly chatRepository;
    private readonly visitProfileRepo;
    private readonly helper;
    private readonly chatGateway;
    getUsers(token: string): Promise<{
        usersList: User[];
        unseenFakeIds: string[];
    }>;
    getUnseenMessageCount(token: string): Promise<string[]>;
    createBulkProfileVisits(token: any, fakeUserIds: string[], customerUserIds: string[]): Promise<VisitProfile[]>;
    getAvailableUsers(token: string): Promise<User[]>;
}
