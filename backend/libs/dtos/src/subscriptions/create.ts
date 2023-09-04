import { type ISubscription } from './../../../types/src/db/entities/subscriptions';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { isMainThread } from 'worker_threads';
export class CreateSubscriptionRequestDto implements ISubscription {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Subscription Package Type', description: 'Subscription package type here' })
  public readonly packageType: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: 'Subscription Best Selling', description: 'Subscription best selling here' })
  public readonly bestSelling: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: 'One Time subscription', description: 'Subscribe for the one time' })
  public readonly oneTime: boolean;

  @Min(0)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 'Subscription Amount', description: 'Subscription amount here' })
  public readonly amount: number;

  @Min(0)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 'Subscription No Of Coins', description: 'Subscription No of Coins here' })
  public readonly noOfCoins: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Subscription Creator', description: 'Subscription Creator here' })
  public readonly creator: string;
}
