import { ApiProperty } from '@nestjs/swagger';
import { TransactionActionTypes } from './../../../types/src/db/entities/subscriptions';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class TransactionActionTypesDto {
  @IsNotEmpty()
  // @IsEnum(TransactionActionTypes.SENDMESSAGE)
  @ApiProperty({ example: 'SENDMESSAGE', description: 'Action type here here' })
  readonly actionType: TransactionActionTypes;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'receiver id', description: 'Receiver User id here' })
  readonly receiverId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'sub action like gift name ', description: 'giftname here' })
  readonly subAction?: string;
}
