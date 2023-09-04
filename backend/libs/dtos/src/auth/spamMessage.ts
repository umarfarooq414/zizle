import { ApiProperty } from '@nestjs/swagger';

export class SpamMessagesDto {
  @ApiProperty({
    type: String,
    description: 'Array of fake user IDs',
  })
  fakeUserId: string;

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
