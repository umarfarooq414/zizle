import { QueryStatus } from './../../../../libs/types/src/db/entities/user';
import { User } from './user.entity';
export declare class ContactSupport {
    readonly id: string;
    query: string;
    status: QueryStatus;
    user: User;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
