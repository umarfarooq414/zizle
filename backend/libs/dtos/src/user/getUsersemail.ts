import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min, IsOptional } from 'class-validator';
export class GetUsersemailQueryParamsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '1', description: 'Page No type here' })
  public readonly page?: string;

  @IsString()
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '20', description: 'Page Size type here' })
  public readonly pageSize?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'male', description: 'type gender here' })
  public readonly gender?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 's', description: 'find by nickname' })
  public readonly nickname?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'true', description: 'find by status' })
  public readonly status?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '18', description: 'Starting Age' })
  public readonly startAge?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '60', description: 'Ending Age' })
  public readonly endAge?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '60', description: 'distance in kms' })
  public readonly distanceInKms?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'true', description: 'new users' })
  public readonly newUsers?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'true', description: 'fsk badge' })
  public readonly fsk?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'geneve', description: 'postal code' })
  public readonly postalCode?: string;
}
