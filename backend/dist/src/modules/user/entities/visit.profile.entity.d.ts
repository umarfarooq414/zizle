import { User } from './user.entity';
export declare class VisitProfile {
    id: string;
    visitor: User;
    visited: User;
    creatorId: string;
    seen: boolean;
    timestamp: Date;
}
