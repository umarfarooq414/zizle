export declare enum UserStatusEnum {
    UNVERIFIED = "UNVERIFIED",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DEACTIVATE = "DEACTIVATE",
    BLOCK = "BLOCK",
    VERIFIED = "VERIFIED"
}
export declare enum UserRoleEnum {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    CUSTOMER = "CUSTOMER",
    FAKE = "FAKE"
}
export declare enum QueryStatus {
    IN_PROGRESS = "IN_PROGRESS",
    REJECTED = "REJECTED",
    RESOLVED = "RESOLVED"
}
export declare enum NotificationAction {
    LIKED = "LIKED",
    VISITED = "VISITED"
}
export declare enum UserSelfGenderEnum {
    MALE = "MALE",
    FEMALE = "FEMALE"
}
export declare enum CustomerProfileEnum {
    VERIFIED = "VERIFIED",
    UNVERIFIED = "UNVERIFIED"
}
export declare enum CustomerChildrenEnum {
    YES = "Yes",
    NO = "No"
}
export declare enum UserInterestedGenderEnum {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHERS = "OTHERS"
}
export declare enum CustomerRelationShipStatus {
    SINGLE = "Single",
    IN_A_RELATIONSHIP = "In a Relationship",
    MARRIED = "Married",
    WIDOWED = "Widowed",
    DIVORCED = "Divorced",
    ROMANCE = "Romance",
    OPEN_RELATIONSHIP = "Open Relationship",
    ITS_COMPLICATED = "It's complicated"
}
export declare enum CustomerLifeStatus {
    ALONE = "Alone",
    AT_PARENTS = "At parents",
    FLAT_SHARE = "Flat Share",
    WITH_PARTNER = "With partner",
    MISCELLANEOUS = "Miscellaneous"
}
export declare enum CustomerSmokeStatus {
    YES = "Yes",
    NO = "No",
    STOPPED = "Stopped",
    OCCASIONALLY = "Occasionally"
}
export declare enum SocialProviderEnum {
    GOOGLE = "google",
    FACEBOOK = "facebook"
}
export declare enum BlockUserReason {
    INAPPROPRIATE_MESSAGE = "INAPPROPRIATE_MESSAGE",
    HARASSING = "HARASSING",
    FAKE_ACCOUNT = "FAKE_ACCOUNT",
    TO_BLOCK = "TO_BLOCK"
}
export interface IUser {
    id?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
    email: string;
    password?: string;
    status?: UserStatusEnum;
    role?: UserRoleEnum;
    selfGender?: UserSelfGenderEnum;
    interestedGender?: UserInterestedGenderEnum;
    socialProvide?: SocialProviderEnum;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IOathUser {
    id?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
    email: string;
    password?: string;
    status?: UserStatusEnum;
    role?: UserRoleEnum;
    selfGender?: string;
    interestedGender?: string;
    socialProvide?: SocialProviderEnum;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IUserParams {
    userName?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    status?: UserStatusEnum;
    role?: UserRoleEnum;
    selfGender?: UserSelfGenderEnum;
    interestedGender?: UserInterestedGenderEnum;
    socialProvide?: SocialProviderEnum;
}
export interface IFake {
    id?: string;
    userName?: string;
    role?: UserRoleEnum;
    selfGender?: UserSelfGenderEnum;
    interestedGender?: UserInterestedGenderEnum;
    smoker?: CustomerSmokeStatus;
    life?: CustomerLifeStatus;
    children?: CustomerChildrenEnum;
    relationshipStatus?: CustomerRelationShipStatus;
    avatarUrl?: string;
    creator?: string;
    age?: string;
    dob?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IFakeParams {
    userName?: string;
    role?: UserRoleEnum;
    selfGender?: UserSelfGenderEnum;
    interestedGender?: UserInterestedGenderEnum;
    creator?: string;
    smoker?: CustomerSmokeStatus;
    life?: CustomerLifeStatus;
    children?: CustomerChildrenEnum;
    relationshipStatus?: CustomerRelationShipStatus;
    avatarUrl?: string;
    age?: string;
    dob?: Date;
    email?: string;
    postalCode?: string;
}
export interface ICustomerProfileData {
    relationshipStatus?: CustomerRelationShipStatus;
    children?: CustomerChildrenEnum;
    profileText?: string;
    life?: CustomerLifeStatus;
    smoke?: CustomerSmokeStatus;
    isEmailVerified?: UserStatusEnum;
    isProfileVerified?: CustomerProfileEnum;
    avatarUrl?: string;
    mobileNumber?: string;
    dob?: Date;
}
export declare function getBlockReason(reason: BlockUserReason): BlockUserReason | undefined;
