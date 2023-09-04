import { UserSelfGenderEnum } from './../../../types/src/db/entities/user';
export declare class CreateDynamicFakeRequestDto {
    readonly startAge: number;
    readonly endAge: number;
    readonly gender: UserSelfGenderEnum;
}
