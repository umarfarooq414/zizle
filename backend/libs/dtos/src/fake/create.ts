import {
  UserInterestedGenderEnum,
  UserSelfGenderEnum,
  UserRoleEnum,
  type IFake,
  IUser,
  CustomerLifeStatus,
  CustomerSmokeStatus,
  CustomerRelationShipStatus,
  CustomerChildrenEnum,
} from './../../../types/src/db/entities/user';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
export class CreateFakeRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'User Name', description: 'User Name here' })
  public readonly userName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Email', description: 'email here' })
  public readonly email: string;

  @IsNotEmpty()
  // @IsEnum(UserSelfGenderEnum)
  @ApiProperty({ example: 'Self Gender', description: 'Self Gender here' })
  public readonly selfGender: UserSelfGenderEnum;

  @IsNotEmpty()
  // @IsEnum(UserInterestedGenderEnum)
  @ApiProperty({ example: 'Interested Gender', description: 'Interested Gender here' })
  public readonly interestedGender: UserInterestedGenderEnum;

  @IsNotEmpty()
  // @IsEnum(CustomerLifeStatus)
  @ApiProperty({ example: 'Life', description: 'life status here' })
  public readonly life: CustomerLifeStatus;

  @IsNotEmpty()
  // @IsEnum(CustomerSmokeStatus)
  @ApiProperty({ example: 'smoke status', description: 'smoker status here' })
  public readonly smoker: CustomerSmokeStatus;

  @IsNotEmpty()
  // @IsEnum(CustomerRelationShipStatus)
  @ApiProperty({ example: 'relationship status', description: 'relationship status here' })
  public readonly relationshipStatus: CustomerRelationShipStatus;

  @IsNotEmpty()
  // @IsEnum(CustomerChildrenEnum)
  @ApiProperty({ example: 'children status', description: 'children status here' })
  public readonly children: CustomerChildrenEnum;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'date of birth', description: 'date of birth here' })
  public readonly dob: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'address', description: 'address here' })
  public readonly postalCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'mobile number', description: 'mobile number here' })
  public readonly mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'profile text', description: 'profile bio here' })
  public readonly profileText: string;
}
