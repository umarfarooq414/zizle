import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsNotEmpty } from 'class-validator'
export class UpdateNotesRequestDto {

  @IsOptional()
  @IsString()
  @ApiProperty(
    { description: 'Leave Empty if not wanted to update' }
  )
  public readonly note?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty(
    { description: 'Enter user id to update' }
  )
  public readonly userId: string
}
