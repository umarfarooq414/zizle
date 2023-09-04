import { ICustomerProfileData } from './../../../../libs/types/src/db/entities/user';
import { CustomerChildrenEnum, CustomerLifeStatus, CustomerProfileEnum, CustomerRelationShipStatus, CustomerSmokeStatus, UserStatusEnum } from '../../../../libs/types/src/db/entities/user';
import { User } from './user.entity';
export declare class CustomerProfileData {
    constructor(params?: ICustomerProfileData);
    readonly id: string;
    relationshipStatus: string;
    children: CustomerChildrenEnum;
    profileText: string;
    life: string;
    smoker: CustomerSmokeStatus;
    isEmailVerified: UserStatusEnum;
    avatarUrl: string;
    isProfileVerified: CustomerProfileEnum;
    mobileNumber: string;
    dateOfBirth: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    user: User;
    setRelationShipStatus(relationshipStatus: CustomerRelationShipStatus): void;
    setChildren(children: CustomerChildrenEnum): void;
    setProfileText(profileText: string): void;
    setSmoker(smoker: CustomerSmokeStatus): void;
    setLife(life: CustomerLifeStatus): void;
    setIsEmailVerified(isEmailVerified: UserStatusEnum): void;
    setAvatarUrl(avatarUrl: string): void;
    setIsProfileVerified(isProfileVerified: CustomerProfileEnum): void;
    setMobileNumber(mobileNumber: string): void;
    setDateOfBirth(dateOfBirth: Date): void;
}
