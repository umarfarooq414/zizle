import { UserInterestedGenderEnum, UserSelfGenderEnum } from './../../../types/src/db/entities/user';
import { type IUser, type UserRoleEnum } from '@lib/types';
import { ApiProperty } from '@nestjs/swagger';

import { Trim } from 'class-sanitizer';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class UserRegisterRequestDto implements IUser {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, {
    message: 'Enter your gender',
  })
  @ApiProperty({ example: 'Male' })
  public readonly selfGender: UserSelfGenderEnum;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30, {
    message: 'Enter interested gender',
  })
  @ApiProperty({ example: 'female' })
  public readonly interestedGender: UserInterestedGenderEnum;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30, {
    message: 'Last Name length must be less than 30',
  })
  @ApiProperty({ example: 'Smith', description: 'Last Name of user' })
  public readonly userName: string;

  @Trim()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'john.smith@demo.com',
    description: 'Email of the user',
  })
  public readonly email: string;

  public readonly role?: UserRoleEnum;

  @IsNotEmpty()
  @IsString()
  @MinLength(7, {
    message: 'Password must be at least 7 characters long',
  })
  @ApiProperty({
    example: 'password',
    description: 'Password for user. Must be 7 characters long.',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Age',
    description: 'Age of the user',
  })
  age: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '123453',
    description: 'Zip Code ',
  })
  zipCode: string;
}

export class AdminModRegisterRequestDto implements IUser {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, {
    message: 'First Name length must be less than 30',
  })
  @ApiProperty({ example: 'John', description: 'First Name of user' })
  public readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30, {
    message: 'Last Name length must be less than 30',
  })
  @ApiProperty({ example: 'Smith', description: 'Last Name of user' })
  public readonly lastName: string;

  @Trim()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'john.smith@demo.com',
    description: 'Email of the user',
  })
  public readonly email: string;

  public readonly role?: UserRoleEnum;

  @IsNotEmpty()
  @IsString()
  @MinLength(7, {
    message: 'Password must be at least 7 characters long',
  })
  @ApiProperty({
    example: 'password',
    description: 'Password for user. Must be 7 characters long.',
  })
  password: string;
}
