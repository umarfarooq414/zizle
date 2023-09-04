import { UserInterestedGenderEnum, UserSelfGenderEnum, CustomerLifeStatus, CustomerSmokeStatus, CustomerRelationShipStatus, CustomerChildrenEnum } from './../../../types/src/db/entities/user';
export declare class UpdateFakeRequestDto {
    readonly userName: string;
    readonly email: string;
    readonly selfGender: UserSelfGenderEnum;
    readonly interestedGender: UserInterestedGenderEnum;
    readonly life: CustomerLifeStatus;
    readonly smoker: CustomerSmokeStatus;
    readonly relationshipStatus: CustomerRelationShipStatus;
    readonly children: CustomerChildrenEnum;
    readonly dob: string;
    readonly postalCode: string;
    readonly mobileNumber: string;
    readonly profileText: string;
}
