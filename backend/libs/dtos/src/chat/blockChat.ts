import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class BlockChatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'enter mod id',
  })
  modId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'enter chat id',
  })
  chatId: string;
}
