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
import { Notes } from './entities/notes.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole, UserRoleEnum } from '@lib/types';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { SWAGGER_API_TAG } from '@lib/constants';
import { CreateNotesRequestDto, UpdateNotesRequestDto } from '@lib/dtos';
import { NotesService } from './notes.service';
@Controller('notes')
@UseGuards(JwtAuthGuard, RolesGuard)
@UserRole(UserRoleEnum.MODERATOR)
@ApiBearerAuth()
@ApiTags(SWAGGER_API_TAG.NOTES)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'All Notess!' })
  @ApiResponse({
    status: 200,
    description: 'Notes!',
    type: Notes,
  })
  async findAll() {
    return await this.notesService.findAll();
  }

  @Post('createNotes')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Create Notes' })
  @ApiResponse({
    status: 201,
    description: 'Notes created!',
    type: Notes,
  })
  async createdNotes(@Body() NotesDto: CreateNotesRequestDto) {
    return await this.notesService.createNotes(NotesDto);
  }

  @ApiOperation({ summary: 'Get a Notes' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter User id',
    type: 'string',
  })
  @Get(':id')
  async findOne(@Param('id') userId: string) {
    return await this.notesService.findOne(userId);
  }

  @ApiOperation({ summary: 'Update Notes' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter Notes id',
    type: 'string',
  })
  @Put('updateNotes/:id')
  async updateById(@Param('id') id: string, @Body() body: UpdateNotesRequestDto) {
    return await this.notesService.updateById(id, body);
  }

  @ApiOperation({ summary: 'Delete Notes' })
  @ApiResponse({ status: 200, description: 'Deleted.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter Notes id',
    type: 'string',
  })
  @Delete('deleteNotes/:id')
  async deleteById(@Param('id') id: string) {
    return await this.notesService.deleteById(id);
  }
}
