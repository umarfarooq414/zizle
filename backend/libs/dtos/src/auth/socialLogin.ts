import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SocialProviderEnum, UserInterestedGenderEnum, UserSelfGenderEnum } from '@lib/types';

export class SocialLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @IsEnum(SocialProviderEnum)
  socialProvider: SocialProviderEnum;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  age: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  zipCode: string;


  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserSelfGenderEnum)
  selfGender: UserSelfGenderEnum;

  @IsNotEmpty()
  @IsEnum(UserInterestedGenderEnum)
  interestedGender: UserInterestedGenderEnum;
}
