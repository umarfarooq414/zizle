import { SocialProviderEnum, UserInterestedGenderEnum, UserSelfGenderEnum } from '@lib/types';
export declare class SocialLoginRequestDto {
    token: string;
    socialProvider: SocialProviderEnum;
    userName: string;
    age: string;
    email: string;
    zipCode: string;
    password: string;
    selfGender: UserSelfGenderEnum;
    interestedGender: UserInterestedGenderEnum;
}
