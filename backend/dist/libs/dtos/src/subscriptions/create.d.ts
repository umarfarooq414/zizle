import { type ISubscription } from './../../../types/src/db/entities/subscriptions';
export declare class CreateSubscriptionRequestDto implements ISubscription {
    readonly packageType: string;
    readonly bestSelling: boolean;
    readonly oneTime: boolean;
    readonly amount: number;
    readonly noOfCoins: number;
    readonly creator: string;
}
