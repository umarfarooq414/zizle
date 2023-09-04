import { ApiTags } from '@nestjs/swagger';
import { UserRole, UserRoleEnum } from '@lib/types';
import { PaymentsService } from './payments.service';
import { Controller, Get, Post, Body, Param, Query, Res, Headers, UseGuards, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { SWAGGER_API_TAG } from '@lib/constants';
import { PaymentRequestBody } from './types/PaymentRequestBody';
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UserRole(UserRoleEnum.CUSTOMER)
@ApiTags(SWAGGER_API_TAG.PAYMENTS)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}
  @Get('webhook')
  async processPayment(@Query() query: any, @Res() res: Response) {
    await this.paymentsService.processPayment(query, res);
  }

  @Get()
  async findOne(@Headers('authorization') token: string) {
    return await this.paymentsService.findOne(token);
  }

  @Post('stripe')
  async createPayments(@Res() response: Response, @Body() paymentRequestBody: PaymentRequestBody) {
    this.paymentsService
      .createPayment(paymentRequestBody)
      .then((res) => {
        response.status(HttpStatus.CREATED).json(res);
        this.paymentsService.storepayment(res, paymentRequestBody);
      })
      .catch((err) => {
        response.status(HttpStatus.BAD_REQUEST).json(err);
      });
  }
}
