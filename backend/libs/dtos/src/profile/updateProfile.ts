import {
  CustomerLifeStatus,
  CustomerRelationShipStatus,
  CustomerSmokeStatus,
  CustomerChildrenEnum,
  UserStatusEnum,
  UserSelfGenderEnum,
  UserInterestedGenderEnum,
} from './../../../types/src/db/entities/user';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsEnum, IsBoolean } from 'class-validator';
export class UpdateProfileRequestDto {
  @IsOptional()
  @IsEnum(CustomerRelationShipStatus)
  // @IsString()
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly relationshipStatus?: CustomerRelationShipStatus;

  @IsOptional()
  @IsEnum(CustomerChildrenEnum)
  // @IsString()
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly children?: CustomerChildrenEnum;

  @IsOptional()
  @IsEnum(CustomerLifeStatus)
  // @IsString()
  @ApiProperty({ description: 'Enter living status to update' })
  public readonly life?: CustomerLifeStatus;

  @IsOptional()
  @IsEnum(CustomerSmokeStatus)
  // @IsString()
  @ApiProperty({ description: 'Enter smoking status to update', example: 'yes' })
  public readonly smoker?: CustomerSmokeStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Enter profile text to update' })
  public readonly profileText?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Enter mobilenumber to update' })
  public readonly mobileNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Enter date of birth in string format' })
  public readonly dob?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Enter address in string format' })
  public readonly address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Enter username' })
  public readonly userName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Enter current Password' })
  public readonly currentPassword?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Enter new Password' })
  public readonly newPassword?: string;

  @IsOptional()
  @IsEnum(UserInterestedGenderEnum)
  @ApiProperty({ description: 'Enter interested Gender' })
  public readonly interestedGender?: UserInterestedGenderEnum;

  @IsOptional()
  @IsEnum(UserSelfGenderEnum)
  @ApiProperty({ description: 'Enter self Gender' })
  public readonly selfGender?: UserSelfGenderEnum;
}
