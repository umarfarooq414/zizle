import { User } from '../../user/entities/user.entity';
import { UserBonusCode } from './userBonusCode.entity';
export declare class BonusCode {
    id: string;
    bonusCode: string;
    coins: number;
    expiryDate: Date;
    creator: User;
    users: UserBonusCode[];
    timestamp: Date;
    setExpiryDate(expiryDate: Date): void;
}
