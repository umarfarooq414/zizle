import { type IOathUser, SocialProviderEnum, UserStatusEnum, UserRoleEnum } from './../../../../libs/types/src/db/entities/user';
import { CustomerProfileData } from './customer.profiledata.entity';
import { UserAccountTransaction } from './user.account.transaction.entity';
import { VisitProfile } from './visit.profile.entity';
import { Favorite } from './customer.favourite.entity';
import { Address } from './user.address.entity';
import { Block } from './user.block.entity';
import { Photo } from './user.photos.entity';
import { Payments } from 'src/modules/payments/entities/payment.entity';
export declare class OauthUser implements IOathUser {
    constructor(params?: IOathUser);
    readonly id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password?: string;
    SocialProvider?: SocialProviderEnum;
    status: UserStatusEnum;
    role: UserRoleEnum;
    selfGender: string;
    interestedGender: string;
    online: boolean;
    disable: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    profile: CustomerProfileData;
    address: Address;
    transaction: UserAccountTransaction;
    visits: VisitProfile;
    blocked: Block;
    favorite: Favorite;
    photos: Photo;
    payments: Payments;
    setStatus(status: UserStatusEnum): void;
    setRole(role: UserRoleEnum): void;
    setPassword(password: string): void;
    setFirstName(firstName: string): void;
    setUserName(userName: string): void;
    setLastName(lastName: string): void;
}
