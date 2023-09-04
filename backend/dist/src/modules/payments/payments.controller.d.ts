import { PaymentsService } from './payments.service';
import { Response } from 'express';
import { PaymentRequestBody } from './types/PaymentRequestBody';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    processPayment(query: any, res: Response): Promise<void>;
    findOne(token: string): Promise<import("./entities/payment.entity").Payments[]>;
    createPayments(response: Response, paymentRequestBody: PaymentRequestBody): Promise<void>;
}
