import { UserStatusEnum, UserRoleEnum } from '@lib/types'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

ApiProperty()
export class UpdateAccessDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Enter user id in Uuid format!'
  })
    userId: string

  @IsEnum(UserRoleEnum)
  @ApiProperty({
    example: UserRoleEnum.MODERATOR,
    description: 'Enter user role you want to update',
    enum: UserRoleEnum
  })
    role: UserRoleEnum
}
