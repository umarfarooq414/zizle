import { ApiProperty } from '@nestjs/swagger';
import { TransactionActionTypes } from './../../../types/src/db/entities/subscriptions';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateGiftDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'bear', description: 'title/action of gift' })
  actionType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'image url ', description: 'image url  here' })
  imageUrl?: string;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ example: 'cost  ', description: 'cost gift  here' })
  cost: number | any;
}

// UpdateGiftDto
export class UpdateGiftDto {
  cost: number;
  actionType: string;
}
