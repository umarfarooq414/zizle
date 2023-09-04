import { UserAccountTransaction } from './user.account.transaction.entity';
export declare class UserTransactionActionTypes {
    readonly id: string;
    actionType: string;
    cost: number;
    imageUrl?: string;
    adminId: string;
    gift: boolean;
    transaction: UserAccountTransaction;
    setGiftImageUrl(imageUrl: string): void;
    setGiftActionType(actionType: string): void;
    setGiftCost(cost: number): void;
}
