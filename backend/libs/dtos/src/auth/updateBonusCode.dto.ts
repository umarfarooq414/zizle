import { ApiProperty } from '@nestjs/swagger';

export class UpdateBonusCodeDto {
  @ApiProperty({
    type: String,
    description: 'Enter Expiry Date',
  })
  expiryDate: Date;
}
