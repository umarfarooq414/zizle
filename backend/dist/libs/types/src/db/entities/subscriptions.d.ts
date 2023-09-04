import { SubscriptionsService } from 'src/modules/subscriptions/subscriptions.service';
import { User } from 'src/modules/user/entities/user.entity';
import { UserTransactionActionTypes } from 'src/modules/user/entities/user.transaction.actiontypes.entity';
export interface ISubscription {
    id?: string;
    packageType: string;
    amount: number;
    noOfCoins: number;
    creator: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ISubscriptionParams {
    packageType?: string;
    packageName?: string;
    noOfCoins?: number;
    amount?: number;
    bestSelling?: boolean;
    creator?: string;
    oneTime: boolean;
}
export declare enum Package {
    Package1 = "Package 1",
    Package2 = "Package 2",
    Package3 = "Package 3",
    Package4 = "Package 4",
    Package5 = "Package 5",
    Package6 = "Package 6"
}
export declare function getPackageFromNumber(num: number): Package | undefined;
export declare function getAmountForEachAction(action: TransactionActionTypes, packageId?: string, subscriptionService?: SubscriptionsService): Promise<number | undefined>;
export declare enum TransactionActionTypes {
    SENDMESSAGE = "SendMessage",
    EMAILCONFIRMED = "EmailConfirmed",
    AVATARUPLOADED = "AvatarUploaded",
    PROFILEVERIFIED = "ProfileVerified",
    MOBILENUMBER = "MobileNumber",
    ACCOUNTCREATION = "AccountCreation",
    VIEWPHOTO = "ViewPhoto",
    PROFILEVISIT = "ProfileVisit",
    SENDEMOJI = "SendEmoji",
    RECEIVEEMOJI = "ReceiveEmoji",
    PACKAGE_SUBSCRIPTION = "PackageSubscription",
    SENDGIFT = "SendGift",
    RECEIVEGIFT = "ReceiveGift",
    BONUSCODE = "BonusCode"
}
export interface IUserAccountTransaction {
    id?: string | unknown;
    user?: User;
    currentCoins?: number;
    cost?: number;
    actionType?: UserTransactionActionTypes | unknown;
}
