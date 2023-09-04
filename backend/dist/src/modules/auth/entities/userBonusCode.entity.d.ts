import { User } from '../../user/entities/user.entity';
import { BonusCode } from './bonusCode.entity';
export declare class UserBonusCode {
    id: string;
    user: User;
    bonusCode: BonusCode;
}
