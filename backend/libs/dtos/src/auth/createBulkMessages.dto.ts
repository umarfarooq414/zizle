import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class CreateBulkMessagesDto {
  @ApiProperty({
    type: String,
    // isArray: true,
    description: 'Array of fake user IDs',
  })
  fakeUserIds: string;

  // @IsArray()
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Array of customer user IDs',
  })
  customerUserIds: string;

  @ApiProperty({
    type: String,
    description: 'Array of customer user IDs',
  })
  message: string;
}
