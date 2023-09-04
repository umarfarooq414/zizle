import { UserSelfGenderEnum } from './../../../types/src/db/entities/user';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
export class CreateDynamicFakeRequestDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 'startAge', description: 'startAge here' })
  public readonly startAge: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 'endAge', description: 'endAge here' })
  public readonly endAge: number;

  @IsNotEmpty()
  // @IsEnum(UserSelfGenderEnum)
  @ApiProperty({ example: 'gender', description: 'gender here' })
  public readonly gender: UserSelfGenderEnum;
}
