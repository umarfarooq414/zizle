import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';
export class UpdateSubscriptionRequestDto {
  @IsOptional()
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly packageType?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly bestSelling?: boolean;

  @Min(0)
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly amount?: number;

  @Min(0)
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly noOfCoins?: number;
}
