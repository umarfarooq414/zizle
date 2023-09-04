import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateModDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'enter user name for moderator',
  })
  userName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'enter email for moderator',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'enter password for moderator account',
  })
  password: string;
}
