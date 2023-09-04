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

export enum Package {
  Package1 = 'Package 1',
  Package2 = 'Package 2',
  Package3 = 'Package 3',
  Package4 = 'Package 4',
  Package5 = 'Package 5',
  Package6 = 'Package 6',
}

export function getPackageFromNumber(num: number): Package | undefined {
  switch (num) {
    case 1:
      return Package.Package1;
    case 2:
      return Package.Package2;
    case 3:
      return Package.Package3;
    case 4:
      return Package.Package4;
    case 5:
      return Package.Package5;
    case 6:
      return Package.Package6;
    default:
      return undefined;
  }
}

export async function getAmountForEachAction(
  action: TransactionActionTypes,
  packageId?: string,
  subscriptionService?: SubscriptionsService
): Promise<number | undefined> {
  switch (action) {
    case TransactionActionTypes.SENDMESSAGE:
      return -13;
    case TransactionActionTypes.VIEWPHOTO:
      return -10;
    case TransactionActionTypes.PROFILEVISIT:
      return -2;
    case TransactionActionTypes.PROFILEVERIFIED:
      return 5;
    case TransactionActionTypes.AVATARUPLOADED:
      return 3;
    case TransactionActionTypes.EMAILCONFIRMED:
      return 16;
    case TransactionActionTypes.MOBILENUMBER:
      return 2;
    case TransactionActionTypes.ACCOUNTCREATION:
      return 26;
    case TransactionActionTypes.SENDEMOJI:
      return -6;
    case TransactionActionTypes.RECEIVEEMOJI:
      return 6;
    case TransactionActionTypes.PACKAGE_SUBSCRIPTION:
      if (packageId && subscriptionService) {
        const packageObject = await subscriptionService.findOne(packageId); // query from db to get the coins of that package
        return packageObject.noOfCoins;
      } else {
        return undefined;
      }

    default:
      return undefined;
  }
}

export enum TransactionActionTypes {
  SENDMESSAGE = 'SendMessage',
  EMAILCONFIRMED = 'EmailConfirmed',
  AVATARUPLOADED = 'AvatarUploaded',
  PROFILEVERIFIED = 'ProfileVerified',
  MOBILENUMBER = 'MobileNumber',
  ACCOUNTCREATION = 'AccountCreation',
  VIEWPHOTO = 'ViewPhoto',
  PROFILEVISIT = 'ProfileVisit',
  SENDEMOJI = 'SendEmoji',
  RECEIVEEMOJI = 'ReceiveEmoji',
  PACKAGE_SUBSCRIPTION = 'PackageSubscription',
  SENDGIFT = 'SendGift',
  RECEIVEGIFT = 'ReceiveGift',
  BONUSCODE = 'BonusCode',
}

export interface IUserAccountTransaction {
  id?: string | unknown;
  user?: User;
  currentCoins?: number;
  cost?: number;
  actionType?: UserTransactionActionTypes | unknown;
}
