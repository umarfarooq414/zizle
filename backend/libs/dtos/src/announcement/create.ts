import { type IAnnouncement } from '@lib/types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
export class CreateAnnouncementRequestDto implements IAnnouncement {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Announcement title', description: 'Announcement  title here' })
  public readonly title: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Announcement description',
    description: 'Announcement description here'
  })
  public readonly description: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Announcement sender',
    description: 'Announcement sender id here'
  })
  public readonly sender: string
}
