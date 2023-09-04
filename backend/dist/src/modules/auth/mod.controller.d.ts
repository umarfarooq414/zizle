import { CreateBulkProfileVisitsDto } from '@lib/dtos';
import { ModService } from './mod.service';
export declare class ModController {
    private readonly modService;
    constructor(modService: ModService);
    getFakes(token: string): Promise<{
        usersList: import("../user/entities/user.entity").User[];
        unseenFakeIds: string[];
    }>;
    getChatsCount(token: string): Promise<string[]>;
    bulkVisits(token: string, { fakeUserIds, customerUserIds }: CreateBulkProfileVisitsDto): Promise<import("../user/entities/visit.profile.entity").VisitProfile[]>;
    getAvailableUsers(token: string): Promise<import("../user/entities/user.entity").User[]>;
}
