import { ApiProperty } from '@nestjs/swagger';

export class CreateBonusCodeDto {
  @ApiProperty({
    type: String,
    description: 'Enter Bonus Code',
  })
  bonusCode: string;

  @ApiProperty({
    type: Number,
    description: 'Enter Bonus Coins',
  })
  bonusCoins: number;

  @ApiProperty({
    type: String,
    description: 'Enter Expiry Date',
  })
  expiryDate: Date;
}
