import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Headers,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { UserRole, UserRoleEnum } from '@lib/types';
import { SWAGGER_API_TAG } from '@lib/constants';
import { Categories } from './entities/categories.entity';
import { AddImageToCategoryDto, CreateCategoryRequestDto, SortCategoryRequestDto } from '@lib/dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('gallery')
@UseGuards(JwtAuthGuard, RolesGuard)
@UserRole(UserRoleEnum.ADMIN)
@ApiBearerAuth()
@ApiTags(SWAGGER_API_TAG.GALLERY)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'All Categories!' })
  @ApiResponse({
    status: 200,
    description: 'Categories!',
    type: Categories,
  })
  async findAll() {
    return await this.galleryService.findAll();
  }

  //   @Post('createNotes')
  //   @UseInterceptors(ClassSerializerInterceptor)
  //   @ApiOperation({ summary: 'Create Category' })
  //   @ApiResponse({
  //     status: 201,
  //     description: 'Categories created!',
  //     type: Categories,
  //   })
  //   async createdCategories(@Body() NotesDto: any) {
  //     return await this.galleryService.createNotes(NotesDto);
  //   }

  //   @ApiOperation({ summary: 'Get a Notes' })
  //   @ApiResponse({ status: 403, description: 'Forbidden.' })
  //   @ApiParam({
  //     name: 'id',
  //     required: true,
  //     description: 'Please enter User id',
  //     type: 'string',
  //   })
  //   @Get(':id')
  //   async findOne(@Param('id') userId: string) {
  //     return await this.galleryService.findOne(userId);
  //   }

  //   @ApiOperation({ summary: 'Update Notes' })
  //   @ApiResponse({ status: 403, description: 'Forbidden.' })
  //   @UseInterceptors(ClassSerializerInterceptor)
  //   @ApiParam({
  //     name: 'id',
  //     required: true,
  //     description: 'Please enter Notes id',
  //     type: 'string',
  //   })
  //   @Put('updateNotes/:id')
  //   async updateById(@Param('id') id: string, @Body() body: any) {
  //     return await this.galleryService.updateById(id, body);
  //   }

  //   @ApiOperation({ summary: 'Delete Notes' })
  //   @ApiResponse({ status: 200, description: 'Deleted.' })
  //   @ApiParam({
  //     name: 'id',
  //     required: true,
  //     description: 'Please enter Notes id',
  //     type: 'string',
  //   })
  @Delete('deleteCategory/:id')
  async deleteById(@Headers('authorization') token: string, @Param('id') id: string) {
    return await this.galleryService.deleteCategoryById(token, id);
  }

  @ApiOperation({ summary: 'Create a Category' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('createCategory')
  async createCategory(@Headers('authorization') token: string, @Body() { name }: CreateCategoryRequestDto) {
    return await this.galleryService.createCategory(token, name);
  }

  @ApiOperation({ summary: 'Sort Categories' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('sortCategories')
  async sortCategories(
    @Headers('authorization') token: string,
    @Body() { currentPosition, targetPosition }: SortCategoryRequestDto
  ) {
    return await this.galleryService.sortCategories(token, currentPosition, targetPosition);
  }

  @ApiOperation({ summary: 'Add Images To Category' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post('addImagesToCategory')
  async addImagesToCategory(
    @Headers('authorization') token: string,
    @Body() { categoryId }: AddImageToCategoryDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.galleryService.addImagesToCategory(token, categoryId, file);
  }

  @ApiOperation({ summary: 'Get All Category Images' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('getAllCategoriesImages')
  async getAllCategoriesImages(@Headers('authorization') token: string) {
    return await this.galleryService.getAllCategoriesImages(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Images Category' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('getImagesByCategory/:categoryId')
  async getImagesByCategory(@Headers('authorization') token: string, @Param('categoryId') categoryId: string) {
    return await this.galleryService.getImagesByCategory(token, categoryId);
  }

  @Delete('deleteImage/:id')
  async deleteImage(@Headers('authorization') token: string, @Param('id') id: string) {
    return await this.galleryService.deleteImageById(token, id);
  }
}
