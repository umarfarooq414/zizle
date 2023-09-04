import { TransactionActionTypes, getAmountForEachAction } from './../../../libs/types/src/db/entities/subscriptions';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';
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
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole, UserRoleEnum, getPackageFromNumber } from '@lib/types';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { SWAGGER_API_TAG } from '@lib/constants';
import { CreateSubscriptionRequestDto, UpdateSubscriptionRequestDto } from '@lib/dtos/subscriptions';
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UserRole(UserRoleEnum.ADMIN)
@ApiBearerAuth()
@Controller('subscriptions')
@ApiTags(SWAGGER_API_TAG.SUBSCRIPTIONS)
export class SubscriptionsController {
  constructor(private readonly subscriptionService: SubscriptionsService) {}
  @Get('demo')
  demo() {
    //
  }
  @Get()
  @ApiOperation({ summary: 'All Subscription!' })
  @ApiResponse({
    status: 200,
    description: 'Subscription!',
    type: Subscription,
  })
  async findAll() {
    return await this.subscriptionService.findAll();
  }

  @Get('user-subscriptions')
  @ApiOperation({ summary: 'All Subscription!' })
  @ApiResponse({
    status: 200,
    description: 'Subscription!',
    type: Subscription,
  })
  async findUserPackages(@Headers('authorization') token: string) {
    return await this.subscriptionService.findUserPackages(token);
  }

  @Post('createSubscription')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Create Subscription' })
  @ApiResponse({
    status: 201,
    description: 'Subscription created!',
    type: Subscription,
  })
  async createdSubscription(@Body() subscriptionDto: CreateSubscriptionRequestDto) {
    return await this.subscriptionService.createSubscription(subscriptionDto);
  }

  @ApiOperation({ summary: 'Get a Subscription' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter subscription id',
    type: 'string',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.subscriptionService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Subscription' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter subscription id',
    type: 'string',
  })
  @Put('updateSubscription/:id')
  async updateById(@Param('id') id: string, @Body() body: UpdateSubscriptionRequestDto) {
    return await this.subscriptionService.updateById(id, body);
  }

  @ApiOperation({ summary: 'Delete Subscription' })
  @ApiResponse({ status: 200, description: 'Deleted.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter subscription id',
    type: 'string',
  })
  @Delete('deleteSubscription/:id')
  async deleteById(@Param('id') id: string) {
    return await this.subscriptionService.deleteById(id);
  }
}
