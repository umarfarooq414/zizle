import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min, IsOptional } from 'class-validator';
export class ScheduleMessageDto {
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
  public readonly online?: string;

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
  @ApiProperty({ example: '60', description: 'distance in miles' })
  public readonly distanceInMiles?: string;

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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'time', description: 'time in minutes' })
  public readonly time: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'message', description: 'type message here' })
  public readonly message: string;
}
