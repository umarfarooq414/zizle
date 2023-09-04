import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Announcement } from './entities/announcement.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole, UserRoleEnum } from '@lib/types';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { SWAGGER_API_TAG } from '@lib/constants';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementRequestDto, UpdateAnnouncementRequestDto } from '@lib/dtos';
@UseGuards(JwtAuthGuard, RolesGuard)
@UserRole(UserRoleEnum.ADMIN)
@ApiBearerAuth()
@Controller('announcements')
@ApiTags(SWAGGER_API_TAG.ANNOUNCEMENT)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @ApiOperation({ summary: 'All Announcements!' })
  @ApiResponse({
    status: 200,
    description: 'Announcement!',
    type: Announcement,
  })
  async findAll() {
    return await this.announcementService.findAll();
  }

  @Post('createAnnouncement')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Create Announcement' })
  @ApiResponse({
    status: 201,
    description: 'Announcement created!',
    type: Announcement,
  })
  async createdAnnouncement(@Body() announcementDto: CreateAnnouncementRequestDto) {
    return await this.announcementService.createAnnouncement(announcementDto);
  }

  @ApiOperation({ summary: 'Get a Announcement' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter announcement id',
    type: 'string',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.announcementService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Announcement' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter announcement id',
    type: 'string',
  })
  @Put('updateAnnouncement/:id')
  async updateById(@Param('id') id: string, @Body() body: UpdateAnnouncementRequestDto) {
    return await this.announcementService.updateById(id, body);
  }

  @ApiOperation({ summary: 'Delete Announcement' })
  @ApiResponse({ status: 200, description: 'Deleted.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter announcement id',
    type: 'string',
  })
  @Delete('deleteAnnouncement/:id')
  async deleteById(@Param('id') id: string) {
    return await this.announcementService.deleteById(id);
  }
}
