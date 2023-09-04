import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateModDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'enter new user name for moderator',
  })
  userName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'enter new email for moderator account',
  })
  email: string;
}
