import { UpdateBonusCodeDto } from './../../../libs/dtos/src/auth/updateBonusCode.dto';
import { CreateBonusCodeDto } from './../../../libs/dtos/src/auth/bonusCode.dto';
import { UpdateModDto } from './../../../libs/dtos/src/auth/updateMod.dto';
import { CreateModDto } from './../../../libs/dtos/src/auth/createMod.dto';
import { CreateBulkMessagesDto } from './../../../libs/dtos/src/auth/createBulkMessages.dto';
import { GetModsStatsQueryParamsDto } from './../../../libs/dtos/src/auth/mod.stats.dto';
import { SocialLoginRequestDto } from './../../../libs/dtos/src/auth/socialLogin';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Put,
  Query,
  Res,
  Headers,
  Inject,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SWAGGER_API_TAG } from '@lib/constants';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import {
  AdminModRegisterRequestDto,
  type AuthorizeResponseDto,
  LoginRequestDto,
  UserRegisterRequestDto,
  ForgetRequestDto,
  ResetPasswordRequestDto,
  UserOauthRegisterRequestDto,
  CreateBulkProfileVisitsDto,
  GetUsersQueryParamsDto,
  ScheduleMessageDto,
  SpamMessagesDto,
  UpdateQueryStatusDto,
} from '@lib/dtos';
import { UserRole, UserRoleEnum } from '@lib/types';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { type GlobalResponseDto } from '@lib/dtos/common';
import { UpdateAccessDto } from '@lib/dtos/auth/updateAccess';
import { UpdateStatusDto } from '@lib/dtos/auth/updateStatus';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthHelper } from './auth.helper';
import { ContactSupport } from '../user/entities/contactSupport.entity';
import { ChatService } from '../chat/chat.service';

@Controller('auth')
@ApiTags(SWAGGER_API_TAG.AUTH)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authHelper: AuthHelper,
    private readonly chatService: ChatService
  ) {}

  @Get('users/:id')
  async getUsersemail(@Param('id') email: string): Promise<User> {
    return await this.authService.getUserByMail(email);
  }

  @Post('registerUser')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({
    status: 201,
    description: 'User created!',
    type: User,
  })
  async RegisterUser(@Body() registerDto: UserRegisterRequestDto) {
    return await this.authService.registerUser(registerDto);
  }

  @Post('registerAdminMod')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({
    status: 201,
    description: 'User created!',
    type: User,
  })
  async RegisterAdminMod(@Body() registerDto: AdminModRegisterRequestDto) {
    return await this.authService.registerAdminMod(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, description: 'Successfully login!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found!' })
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<AuthorizeResponseDto | never> {
    return await this.authService.login(loginRequestDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('/update-access')
  async approveAccessUser(@Body() updateAccessDto: UpdateAccessDto): Promise<GlobalResponseDto> {
    return await this.authService.updateUserAccess(updateAccessDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('/update-status')
  async approveStatusUser(@Body() updateStatusDto: UpdateStatusDto): Promise<GlobalResponseDto> {
    return await this.authService.updateUserStatus(updateStatusDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('/block-mod')
  async updateModeratorStatus(@Body() updateStatusDto: UpdateStatusDto): Promise<GlobalResponseDto> {
    return await this.authService.updateModeratorStatus(updateStatusDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('users')
  async getUsers(): Promise<User[]> {
    return await this.authService.getAllUsers();
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string, @Res() res) {
    return await this.authService.verifyEmail(token, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter Notes id',
    type: 'string',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('verify-profile/:id')
  async verifyProfile(@Param('id') id: string) {
    return await this.authService.verifyProfile(id);
  }

  @Post('forget')
  @ApiOperation({ summary: 'Forget password' })
  @ApiResponse({
    status: 200,
    description: 'Please check email. Otp sent to xyz@mail.com',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found!' })
  forgetPassword(@Body() { email }: ForgetRequestDto): Promise<GlobalResponseDto> {
    return this.authService.forget(email);
  }

  @Post('reset-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully!',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found!' })
  resetPassword(
    @Headers('token') token: string,
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto
  ): Promise<GlobalResponseDto> {
    return this.authService.resetPassword(token, resetPasswordRequestDto);
  }

  @Post('social-join')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({
    status: 201,
    description: 'User created!',
    type: User,
  })
  async RegisteroauthUser(@Body() registerDto: SocialLoginRequestDto | any) {
    return await this.authService.socialLogin(registerDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('online-stats')
  async onlineUsers(@Headers('authorization') token: string): Promise<{ moderators: User[]; customers: User[] }> {
    return await this.authService.onlineUsers(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('emoji'))
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('save-emojis')
  async saveEmojis(@Headers('authorization') token: string, @UploadedFile() file) {
    return await this.authService.saveEmojis(token, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.CUSTOMER, UserRoleEnum.MODERATOR)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get-emojis')
  async getEmojis(@Headers('authorization') token: string) {
    return await this.authService.getEmojis(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'modId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'duration', required: false, type: String })
  @Get('stats-user-replies')
  async statsUserReplies(@Headers('authorization') token: string) {
    return await this.authService.getUserStats(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'modId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'duration', required: false, type: String })
  @Get('stats-user-messages')
  async statsUserSendMessages(@Headers('authorization') token: string, @Query() params: GetModsStatsQueryParamsDto) {
    return await this.authService.getModSendMessageStats(token, params);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'modId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'duration', required: false, type: String })
  @Get('single-moderator-messages')
  async getModeratorMessages(@Headers('authorization') token: string, @Query() params: GetModsStatsQueryParamsDto) {
    return await this.chatService.statsModGotSentToUser(params, token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'modId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'duration', required: false, type: String })
  @Get('single-moderator-replies')
  async getModeratorReplies(@Headers('authorization') token: string, @Query() params: GetModsStatsQueryParamsDto) {
    return await this.chatService.statsModGotRepliesFromUser(params, token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('mods')
  async getMods(@Headers('authorization') token: string): Promise<User[]> {
    return await this.authService.getMods(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('send-spam-messages')
  async bulkVisits(
    @Headers('authorization') token: string,
    @Body() { fakeUserIds, customerUserIds, message }: CreateBulkMessagesDto,
    @UploadedFile() file
  ) {
    return await this.authService.createBulkMessages(token, fakeUserIds, customerUserIds, message, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @Post('mod')
  @ApiOperation({ summary: 'Create Mod Account' })
  @ApiResponse({
    status: 201,
    description: 'Mode Account created!',
    type: User,
  })
  async createdFake(@Headers('authorization') token: string, @Body() modDto: CreateModDto): Promise<User> {
    return await this.authService.createMod(token, modDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a Mod Account' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter mod user id',
    type: 'string',
  })
  @Get('mod/:id')
  async findOne(@Headers('authorization') token: string, @Param('id') id: string): Promise<User> {
    return await this.authService.getMod(token, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Mod Account' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter mod user id',
    type: 'string',
  })
  @Put('mod/:id')
  async updateById(
    @Headers('authorization') token: string,
    @Param('id') id: string,
    @Body() body: UpdateModDto
  ): Promise<User> {
    return await this.authService.updateModById(token, id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Mod account' })
  @ApiResponse({ status: 200, description: 'Deleted.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter mod user id',
    type: 'string',
  })
  @Delete('mod/:id')
  async deleteById(@Headers('authorization') token: string, @Param('id') id: string): Promise<GlobalResponseDto> {
    return await this.authService.deleteModById(token, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('bonus-code')
  async createBonusCode(@Headers('authorization') token: string, @Body() bonusCodeDto: CreateBonusCodeDto) {
    return await this.authService.createBonusCode(token, bonusCodeDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('verify-bonus-code')
  async verifyBonusCode(@Headers('authorization') token: string, @Query('bonus') bonusCode: string) {
    return await this.authHelper.verifyBonusCode(token, bonusCode);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('bonus-code/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter bonus user id',
    type: 'string',
  })
  async updateBonusCode(
    @Headers('authorization') token: string,
    @Param('id') id: string,
    @Body() { expiryDate }: UpdateBonusCodeDto
  ) {
    return await this.authService.updateBonusCode(token, id, expiryDate);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('bonus-codes')
  async getBonusCodes(@Headers('authorization') token: string) {
    return await this.authService.getAllBonusCodes(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter bonus id',
    type: 'string',
  })
  @Get('bonus-code/:id')
  async getBonusCodeById(@Headers('authorization') token: string, @Param('id') id: string) {
    return await this.authHelper.getBonusCode(token, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter bonus id',
    type: 'string',
  })
  @Delete('bonus-code/:id')
  async deleteBonusCodeById(@Headers('authorization') token: string, @Param('id') id: string) {
    return await this.authService.deleteBonusCodeById(token, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('schedule-message')
  async scheduleMessage(@Headers('authorization') token: string, @Body() body?: ScheduleMessageDto) {
    return this.authService.scheduleMessage(token, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('schedule-message')
  async findAll(@Headers('authorization') token: string) {
    return this.authService.getScheduledMessage(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter schedule message id',
    type: 'string',
  })
  @Delete('schedule-message/:id')
  async deleteScheduleMessage(@Headers('authorization') token: string, @Param('id') id: string) {
    return this.authService.deleteScheduledMessage(token, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('spam-messages')
  async spamMessage(@Headers('authorization') token: string, @Body() body: SpamMessagesDto, @UploadedFile() file) {
    return this.authService.sendSpamMessages(token, body, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('stats')
  async getStats(@Headers('authorization') token: string) {
    return this.authService.getStats(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('queries')
  async getQueries(@Headers('authorization') token: string): Promise<ContactSupport[]> {
    return this.authService.getQueries(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('getSpecificCustomerQueries')
  async getSpecificCustomerQueries(@Headers('authorization') token: string): Promise<ContactSupport[]> {
    return this.authService.getSpecifiCustomerQueries(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('update-query')
  async updateQueryStatus(
    @Headers('authorization') token: string,
    @Body() body: UpdateQueryStatusDto
  ): Promise<ContactSupport> {
    return this.authService.updateQueryStatus(token, body);
  }
}
