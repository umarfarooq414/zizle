import { User } from './user.entity';
import { BlockUserReason } from '../../../../libs/types/src';
export declare class Block {
    id: string;
    userId: string;
    blocked: User;
    reason: BlockUserReason;
    status: boolean;
    timestamp: Date;
}
