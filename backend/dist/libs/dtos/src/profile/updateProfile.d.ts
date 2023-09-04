import { CustomerLifeStatus, CustomerRelationShipStatus, CustomerSmokeStatus, CustomerChildrenEnum, UserSelfGenderEnum, UserInterestedGenderEnum } from './../../../types/src/db/entities/user';
export declare class UpdateProfileRequestDto {
    readonly relationshipStatus?: CustomerRelationShipStatus;
    readonly children?: CustomerChildrenEnum;
    readonly life?: CustomerLifeStatus;
    readonly smoker?: CustomerSmokeStatus;
    readonly profileText?: string;
    readonly mobileNumber?: string;
    readonly dob?: string;
    readonly address?: string;
    readonly userName?: string;
    readonly currentPassword?: string;
    readonly newPassword?: string;
    readonly interestedGender?: UserInterestedGenderEnum;
    readonly selfGender?: UserSelfGenderEnum;
}
