import { FakeService } from './fake.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Headers,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole, UserRoleEnum } from '@lib/types';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { SWAGGER_API_TAG } from '@lib/constants';
import { CreateDynamicFakeRequestDto, CreateFakeRequestDto, UpdateFakeRequestDto } from '@lib/dtos';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { User } from '../user/entities/user.entity';
@UseGuards(JwtAuthGuard, RolesGuard)
@UserRole(UserRoleEnum.ADMIN)
@ApiBearerAuth()
@Controller('fake')
@ApiTags(SWAGGER_API_TAG.FAKE)
export class FakeController {
  constructor(private readonly fakeService: FakeService) {}

  @Get()
  @ApiOperation({ summary: 'All Fake Accounts!' })
  @ApiResponse({
    status: 200,
    description: 'Fake!',
    type: User,
  })
  async findAll() {
    return await this.fakeService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar' }, { name: 'photos' }]))
  @Post('createFake')
  @ApiOperation({ summary: 'Create Fake Account' })
  @ApiResponse({
    status: 201,
    description: 'Fake Account created!',
    type: User,
  })
  async createdFake(
    @Headers('authorization') token: string,
    @Body() fakeDto: CreateFakeRequestDto,
    @UploadedFiles() files
  ) {
    return await this.fakeService.createFake(token, fakeDto, files);
  }

  @ApiOperation({ summary: 'Get a Fake Account' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter fake user id',
    type: 'string',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.fakeService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Fake Account' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(ClassSerializerInterceptor)
  // @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar' }, { name: 'photos' }]))
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter fake user id',
    type: 'string',
  })
  @Put('updateFake/:id')
  async updateById(@Param('id') id: string, @Body() body: UpdateFakeRequestDto, @UploadedFiles() files) {
    return await this.fakeService.updateById(id, body, files);
  }

  @ApiOperation({ summary: 'Delete Fake account' })
  @ApiResponse({ status: 200, description: 'Deleted.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter fake user id',
    type: 'string',
  })
  @Delete('deleteFake/:id')
  async deleteById(@Param('id') id: string) {
    return await this.fakeService.deleteById(id);
  }

  @ApiOperation({ summary: 'Create Dynamic Fake accounts' })
  @ApiResponse({ status: 200, description: 'Created.' })
  @Post('dynamic-fakes')
  async createDynamicFakes(@Headers('authorization') token: string, @Body() body: CreateDynamicFakeRequestDto) {
    return await this.fakeService.createDynamicFakes(token, body);
  }
}
