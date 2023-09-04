import { Controller, Get, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_API_TAG } from '@lib/constants';
import { CreateBulkProfileVisitsDto } from '@lib/dtos';
import { UserRole, UserRoleEnum } from '@lib/types';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { ModService } from './mod.service';

@Controller('mod')
@UseGuards(JwtAuthGuard, RolesGuard)
@UserRole(UserRoleEnum.MODERATOR)
@ApiBearerAuth()
@ApiTags(SWAGGER_API_TAG.MODERATOR)
export class ModController {
  constructor(private readonly modService: ModService) {}

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get-users')
  async getFakes(@Headers('authorization') token: string) {
    return await this.modService.getUsers(token);
  }

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get-chats-count')
  async getChatsCount(@Headers('authorization') token: string) {
    return await this.modService.getUnseenMessageCount(token);
  }

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('send-bulk-visits')
  async bulkVisits(
    @Headers('authorization') token: string,
    @Body() { fakeUserIds, customerUserIds }: CreateBulkProfileVisitsDto
  ) {
    return await this.modService.createBulkProfileVisits(token, fakeUserIds, customerUserIds);
  }

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get-available-users')
  async getAvailableUsers(@Headers('authorization') token: string) {
    return await this.modService.getAvailableUsers(token);
  }
}
