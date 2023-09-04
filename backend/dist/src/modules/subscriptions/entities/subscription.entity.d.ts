import { ISubscriptionParams } from '../../../../libs/types/src';
import { UserSubscription } from './user.subscription.entity';
export declare class Subscription {
    constructor(params?: ISubscriptionParams);
    readonly id: string;
    readonly createdAt: Date;
    packageName: string;
    bestSelling: boolean;
    oneTime: boolean;
    creator: string;
    noOfCoins: number;
    amount: number;
    users: UserSubscription[];
    readonly updatedAt: Date;
    setSubscriptionPackageType(packageType: string): void;
    setSubscriptionBestSelling(bestSelling: boolean): void;
    setSubscriptionAmount(amount: number): void;
    setSubscriptionNoOfCoins(noOfCoins: number): void;
}
