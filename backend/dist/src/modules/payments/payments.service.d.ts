import { User } from '../user/entities/user.entity';
import { EntityManager } from 'typeorm';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Payments } from './entities/payment.entity';
import { Response } from 'express';
import { PaymentRequestBody } from './types/PaymentRequestBody';
import { UserSubscription } from '../subscriptions/entities/user.subscription.entity';
export declare class PaymentsService {
    private readonly entity;
    private stripe;
    private readonly repository;
    private readonly subscription;
    private readonly userSubscription;
    private readonly paymentsRepository;
    private readonly helper;
    private readonly userService;
    private readonly subscriptionService;
    constructor(entity: EntityManager);
    createPayment(paymentRequestBody: PaymentRequestBody): Promise<any>;
    storepayment(res: any, paymentRequestBody: PaymentRequestBody): Promise<void>;
    processPayment(query: any, res: Response): Promise<void>;
    storeRefInUserPackage(user: User, packageObject: Subscription): Promise<UserSubscription>;
    createPaymentt({ user, transactionId, secretfield, packageObject, currency }: {
        user: any;
        transactionId: any;
        secretfield: any;
        packageObject: any;
        currency: any;
    }): Promise<Payments>;
    grantCoinsForPackage(user: User, packagee: Subscription): Promise<void>;
    findOne(token: string): Promise<Payments[]>;
}
