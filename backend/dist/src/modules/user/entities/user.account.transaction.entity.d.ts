import { User } from './user.entity';
import { UserTransactionActionTypes } from './user.transaction.actiontypes.entity';
export declare class UserAccountTransaction {
    readonly id: string;
    currentCoins: number;
    cost: number;
    user: User;
    actionType: UserTransactionActionTypes;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
