import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class GetChatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'enter sender id',
  })
  sender: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'enter receiver id',
  })
  receiver: string;
}
