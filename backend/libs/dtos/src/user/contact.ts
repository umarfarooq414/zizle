import { QueryStatus } from './../../../types/src/db/entities/user';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min, IsOptional, IsEnum, IsEmail } from 'class-validator';
export class ContactSupportDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'subject', description: 'message subject here' })
  public readonly theme?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'token', description: 'auth token' })
  public readonly token?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'john.smith@demo.com',
    description: 'Email of the user',
  })
  public readonly email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'lorem ispsum lorem ispusom', description: 'type message here' })
  public readonly message: string;
}

export class UpdateQueryStatusDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'query id', description: 'query id here' })
  public readonly id?: string;

  @IsNotEmpty()
  @IsEnum(QueryStatus)
  @ApiProperty({ example: 'lorem ispsum lorem ispusom', description: 'type message here' })
  public readonly status: QueryStatus;
}
