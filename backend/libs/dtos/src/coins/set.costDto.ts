import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';

class ActionTypeCost {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '1', description: 'Action id here here' })
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: -20, description: 'Action cost here here' })
  cost: number;
}
export class SetCostDto {
  @ApiProperty({
    type: [ActionTypeCost],
    description: 'Array of action type IDs and their costs',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionTypeCost)
  actionTypeCosts: ActionTypeCost[];
}
