import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Headers,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole, UserRoleEnum } from '@lib/types';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { SWAGGER_API_TAG } from '@lib/constants';
import { CreateActionTypeDto, CreateGiftDto, SetCostDto, UpdateGiftDto } from '@lib/dtos';
import { CoinsService } from './coins.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { clearConfigCache } from 'prettier';
import { fileURLToPath } from 'url';
@Controller('coins')
@ApiTags(SWAGGER_API_TAG.COINS)
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER, UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'All Action types!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll() {
    return await this.coinsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @Get('/:id')
  @ApiOperation({ summary: 'Get a action type!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please action type id',
    type: 'string',
  })
  async findById(@Param('id') id: string) {
    return await this.coinsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update action type cost!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('set-cost')
  async setCost(@Headers('authorization') token: string, @Body() setCostDto: SetCostDto) {
    return await this.coinsService.setCost(token, setCostDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'create a action type!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('create-action-type')
  async createActionType(@Headers('authorization') token: string, @Body() createActionTypeDto: CreateActionTypeDto) {
    return await this.coinsService.createActionType(token, createActionTypeDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('imageUrl'))
  @ApiBearerAuth()
  @Post('create-gift')
  async createGift(
    @Headers('authorization') token: string,
    @Body() createGiftDto: CreateGiftDto,
    @UploadedFile() file
  ) {
    return await this.coinsService.createGift(token, createGiftDto, file);
  }

  @ApiOperation({ summary: 'update gift type cost!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please action type id',
    type: 'string',
  })
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('imageUrl'))
  @Put('update-gift/:id')
  async updateGift(
    @Headers('authorization') token: string,
    @Body() updateGiftDto: CreateGiftDto,
    @Param('id') id: string,
    @UploadedFile() file
  ) {
    return await this.coinsService.updateGift(token, id, updateGiftDto, file);
  }

  @ApiOperation({ summary: 'Get a gift type!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please action type id',
    type: 'string',
  })
  @Get('gift/:id')
  async findGiftById(@Param('id') id: string) {
    return await this.coinsService.findGiftById(id);
  }

  @ApiOperation({ summary: 'Get a gift type!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('gifts')
  async findAllGift() {
    return await this.coinsService.findAllGifts();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @Delete('gift/:id')
  async deleteGift(@Param('id') id: string) {
    return await this.coinsService.deleteGift(id);
  }
}
