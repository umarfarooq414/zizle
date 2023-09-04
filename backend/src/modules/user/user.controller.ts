import { SWAGGER_API_TAG } from '@lib/constants';
import {
  ContactSupportDto,
  OauthRequestDto,
  GetUsersQueryParamsDto,
  TransactionActionTypesDto,
  GetNotificationsQueryParamsDto,
} from '@lib/dtos';
import { UpdateProfileRequestDto } from '@lib/dtos/profile';
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
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BlockUserReason, UserRoleEnum } from './../../../libs/types/src/db/entities/user';
import { UserService } from './user.service';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { UserRole } from '@lib/types';

@Controller('customer')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter user id',
    type: 'string',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar' }, { name: 'photos' }]))
  @Put('updateProfile/:id')
  async updateProfileById(@Param('id') id: string, @Body() body: UpdateProfileRequestDto, @UploadedFiles() files) {
    return await this.userService.updateInfoById(id, body, files);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter visiting profile id',
    type: 'string',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER, UserRoleEnum.MODERATOR)
  @Post('visit-profile/:id')
  async create(@Param('id') id: string, @Headers('authorization') token: string, @Query('fake') fakeId?: string) {
    //need to do by access token
    return this.userService.addToVisit(id, token, fakeId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @Get('profiles')
  async getVisits(@Headers('authorization') token: string) {
    //need to do by access token
    return this.userService.getVisits(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter favorite profile id',
    type: 'string',
  })
  @Post('favorite/:id')
  async markFavorite(@Param('id') favoriteId: string, @Headers('authorization') token: string) {
    //need to do by access token
    return await this.userService.markFavorite(favoriteId, token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @Get('favorites')
  async getFavorites(@Headers('authorization') token: string) {
    //need to do by access token
    return this.userService.getFavorites(token);
  }
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER, UserRoleEnum.ADMIN)
  @Get('getRandomUser')
  async getRandom(@Headers('authorization') token: string) {
    return this.userService.getRandom(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @UserRole(UserRoleEnum.CUSTOMER, UserRoleEnum.ADMIN)
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'pageSize', required: false, type: String })
  @ApiQuery({ name: 'gender', required: false, type: String })
  @ApiQuery({ name: 'nickname', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'startAge', required: false, type: String })
  @ApiQuery({ name: 'endAge', required: false, type: String })
  @ApiQuery({ name: 'distanceInKms', required: false, type: String })
  @ApiQuery({ name: 'newUsers', required: false, type: String })
  @ApiQuery({ name: 'fsk', required: false, type: String })
  @ApiQuery({ name: 'postalCode', required: false, type: String })
  @Get()
  async findAll(@Headers('authorization') token: string, @Query() params?: GetUsersQueryParamsDto) {
    return this.userService.findAll(token, params);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter user id',
    type: 'string',
  })
  @Get(':id')
  async getUser(@Param('id') userId: string) {
    return this.userService.getCustomer(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @Put('email')
  async getEmailforoauth(@Body() { email }: OauthRequestDto) {
    return await this.userService.getCustomerData(email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter user id',
    type: 'string',
  })
  @Get('distance/:id')
  async findDistance(@Param('id') userId: string, @Headers('authorization') token: string) {
    return this.userService.getUsersDistance(userId, token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter user id',
    type: 'string',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @Post('block/:id')
  async markBlock(
    @Param('id') userId: string,
    @Body('reason') reason: BlockUserReason,
    @Headers('authorization') token: string
  ) {
    //need to do by access token
    return await this.userService.markBlock(userId, token, reason);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @Post('blockUsers')
  async getBlockUsers(@Headers('authorization') token: string) {
    //need to do by access token
    return await this.userService.getBlocked(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter user id',
    type: 'string',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @Put('block/:id')
  async removeBlockUsers(@Param('id') userId: string, @Headers('authorization') token: string) {
    //need to do by access token
    return await this.userService.removeBlocked(userId, token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @Delete()
  async removeUser(@Headers('authorization') token: string) {
    //need to do by access token
    return await this.userService.removeUser(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter photo id',
    type: 'string',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @Delete('deletePhoto/:id')
  async removePhoto(@Param('id') id: string, @Headers('authorization') token: string) {
    //need to do by access token
    return await this.userService.removePhoto(id, token);
  }

  // @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR, UserRoleEnum.CUSTOMER)
  @Post('contact-support')
  async contactSupport(@Body() body: ContactSupportDto) {
    //need to do by access token
    return await this.userService.contactSupport(body);
  }
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @UserRole(UserRoleEnum.CUSTOMER)
  // @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @Post('get-coins')
  async getCoins(@Headers('authorization') token: string) {
    //need to do by access token
    return await this.userService.getCoins(token);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @Post('make-transaction')
  async makeTransaction(
    @Headers('authorization') token: string,
    @Body() body: TransactionActionTypesDto,
    @Body('bonus') bonus: string
  ) {
    //need to do by access token
    return await this.userService.makeTransaction(token, body.actionType, body.receiverId, body.subAction, bonus);
  }
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @UserRole(UserRoleEnum.CUSTOMER)
  // @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'pageSize', required: false, type: String })
  @Post('notifications')
  async getNotifications(@Headers('authorization') token: string, @Query() params?: GetNotificationsQueryParamsDto) {
    //need to do by access token
    return this.userService.getNotifications(token, params);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please notification id',
    type: 'string',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @Put('seen-notification/:id')
  async removeNotification(@Headers('authorization') token: string, @Param('id') id: string) {
    //need to do by access token
    return this.userService.seenNotification(token, id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiTags(SWAGGER_API_TAG.CUSTOMER)
  @Put('seen-notifications')
  async removeNotifications(@Headers('authorization') token: string) {
    //need to do by access token
    return this.userService.seenNotifications(token);
  }
}
