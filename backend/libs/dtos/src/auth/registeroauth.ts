import { UserInterestedGenderEnum, UserSelfGenderEnum } from './../../../types/src/db/entities/user';
import { type IOathUser, type UserRoleEnum } from '@lib/types';
import { ApiProperty } from '@nestjs/swagger';

import { Trim } from 'class-sanitizer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserOauthRegisterRequestDto implements IOathUser {
  @IsString()
  @ApiProperty({ example: 'Male' })
  public readonly selfGender: string;

  @IsString()
  @ApiProperty({ example: 'female' })
  public readonly interestedGender: UserInterestedGenderEnum;

  @IsString()
  @ApiProperty({ example: 'Smith', description: 'Last Name of user' })
  public readonly userName: string;

  @Trim()
  @IsEmail()
  @ApiProperty({
    example: 'john.smith@demo.com',
    description: 'Email of the user',
  })
  public readonly email: string;

  public readonly role?: UserRoleEnum;

  @IsString()
  password: string;
}
