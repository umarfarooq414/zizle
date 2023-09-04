import { ApiProperty } from '@nestjs/swagger';
import { TransactionActionTypes } from './../../../types/src/db/entities/subscriptions';
import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';

export class CreateActionTypeDto {
  @IsNotEmpty()
  @IsEnum(TransactionActionTypes)
  @ApiProperty({ example: 'SENDMESSAGE', description: 'Action type here here' })
  actionType: TransactionActionTypes;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: -10, description: 'action cost here' })
  cost: number;
}
