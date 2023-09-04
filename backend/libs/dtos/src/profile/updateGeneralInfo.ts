import { UserStatusEnum, CustomerProfileEnum } from '@lib/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEnum, IsDate } from 'class-validator';
export class UpdateGeneralInfoRequestDto {
  @IsOptional()
  @IsEnum(UserStatusEnum)
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly isEmailVerified?: UserStatusEnum;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly isProfileEverVerified?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Enter living status to update' })
  public readonly mobileNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Enter profile text to update' })
  public readonly avatarUrl?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Enter date of birth in string format' })
  public readonly dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Enter address in string format' })
  public readonly address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Enter username' })
  public readonly userName?: string;
}
