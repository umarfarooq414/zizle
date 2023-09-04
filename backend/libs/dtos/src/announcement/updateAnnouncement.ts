import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
export class UpdateAnnouncementRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly title?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly description?: string
}
