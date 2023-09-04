import { IAnnouncement, type INotes } from '@lib/types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
export class CreateNotesRequestDto implements INotes {
  

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Notes description',
    description: 'Notes description here'
  })
  public readonly note: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Notes creator',
    description: 'Notes creator id here'
  })
  public readonly creator: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'User id for notes',
    description: 'User id against a note'
  })
  public readonly userId: string
}
