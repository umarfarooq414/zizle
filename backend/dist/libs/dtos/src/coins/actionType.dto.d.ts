import { TransactionActionTypes } from './../../../types/src/db/entities/subscriptions';
export declare class TransactionActionTypesDto {
    readonly actionType: TransactionActionTypes;
    readonly receiverId?: string;
    readonly subAction?: string;
}
