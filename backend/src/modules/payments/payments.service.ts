import { HttpException, HttpStatus, Inject, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { AuthHelper } from '../auth/auth.helper';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Payments } from './entities/payment.entity';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { IUserAccountTransaction, TransactionActionTypes, getAmountForEachAction } from '@lib/types';
import { UserAccountTransaction } from '../user/entities/user.account.transaction.entity';
import { UserTransactionActionTypes } from '../user/entities/user.transaction.actiontypes.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import Stripe from 'stripe';
import { PaymentRequestBody } from './types/PaymentRequestBody';
import { UserSubscription } from '../subscriptions/entities/user.subscription.entity';

@Injectable()
export class PaymentsService {
  private stripe;
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  @InjectRepository(Subscription)
  private readonly subscription: Repository<Subscription>;
  @InjectRepository(UserSubscription)
  private readonly userSubscription: Repository<UserSubscription>;
  @InjectRepository(Payments)
  private readonly paymentsRepository: Repository<Payments>;
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(SubscriptionsService)
  private readonly subscriptionService: SubscriptionsService;
  constructor(private readonly entity: EntityManager) {
    this.stripe = new Stripe(
      'sk_test_51MucYBIV9M9aqYDutZ1WfzRewVpCkQtUMMM1HRmHPhkVtu1xIrzXJXDTgOQYyFBOF03vXRxQMsoNGbu2Sb5cByJl00FcZzL7Ma',
      {
        apiVersion: '2020-08-27',
      }
    );
  }

  async createPayment(paymentRequestBody: PaymentRequestBody): Promise<any> {
    let sumAmount = 0;
    const decoded = await this.helper.decode(paymentRequestBody?.token as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    paymentRequestBody.products.forEach((product) => {
      sumAmount = sumAmount + product.price;
    });
    return this.stripe.paymentIntents.create({
      amount: sumAmount,
      currency: paymentRequestBody.currency,
    });
  }

  async storepayment(res: any, paymentRequestBody: PaymentRequestBody) {
    const decoded = await this.helper.decode(paymentRequestBody?.token as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const packageObject: Subscription = await this.subscription.findOneBy({
      packageName: paymentRequestBody.products[0].title,
    });
    if (packageObject.oneTime) {
      this.storeRefInUserPackage(user, packageObject);
    }

    await this.grantCoinsForPackage(user, packageObject);
    const obj = {
      transactionId: res.id,
      secretField: res.client_secret,
      amount: res.amount,
      packageName: paymentRequestBody?.products[0].title,
      currency: res.currency,
      timestamp: new Date(),
      user: user,
    };
    const transaction = this.entity.create(Payments, obj);
    await this.entity.save(Payments, transaction);
  }

  async processPayment(query: any, @Res() res: Response) {
    const { errorcode, transactionId, secretfield, auth, token, id, currency, amount } = query;
    const decoded = await this.helper.decode(token as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (errorcode !== '00') {
      throw new HttpException('Payment failed', HttpStatus.BAD_REQUEST);
    }
    const packageObject: Subscription = await this.subscription.findOneBy({ id: id });
    if (packageObject.oneTime) {
      this.storeRefInUserPackage(user, packageObject);
    }
    await this.createPaymentt({
      user,
      transactionId,
      secretfield,
      packageObject,
      currency,
    });
    await this.grantCoinsForPackage(user, packageObject);
    res.set('Date', new Date().toUTCString());
    res.set('Content-Type', 'text/plain');
    res.set('Connection', 'close');
    res.status(200).send('status=ok\nurl=https://zizle.de/subscriptionpurchased\nforward=1\ntarget=_self\n');
  }

  async storeRefInUserPackage(user: User, packageObject: Subscription) {
    const userPackage = await this.userSubscription.findOne({
      where: {
        user: { id: user.id },
        package: { id: packageObject.id },
      },
    });
    if (userPackage) {
      throw new HttpException('This user has already used this package once.', HttpStatus.CONFLICT);
    }

    const newUserPackage = new UserSubscription();
    newUserPackage.user = user;
    newUserPackage.package = packageObject;
    return await this.userSubscription.save(newUserPackage);
  }

  async createPaymentt({ user, transactionId, secretfield, packageObject, currency }) {
    const payments = new Payments();
    payments.amount = packageObject.amount as number;
    payments.secretField = secretfield;
    payments.transactionId = transactionId;
    payments.packageName = packageObject.packageName;
    payments.user = user;
    payments.currency = currency;
    return await this.paymentsRepository.save(payments);
  }

  async grantCoinsForPackage(user: User, packagee: Subscription) {
    const currentCoins = await this.userService.getCurrentCoinsFromDB(user);
    const cost = await getAmountForEachAction(
      TransactionActionTypes.PACKAGE_SUBSCRIPTION,
      packagee.id,
      this.subscriptionService
    );
    const actionType: any = await this.entity.findOne(UserTransactionActionTypes, {
      where: {
        actionType: TransactionActionTypes.PACKAGE_SUBSCRIPTION,
      },
    });
    const obj = {
      user,
      cost,
      currentCoins: currentCoins + cost,
      actionType,
    };
    const transaction = this.entity.create(UserAccountTransaction, obj);
    await this.entity.save(UserAccountTransaction, transaction);
  }

  public async findOne(token: string) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const payments = await this.paymentsRepository.find({
      where: {
        user: { id: user.id },
      },
    });
    if (payments == null) {
      throw new HttpException('Payment not found!', HttpStatus.NOT_FOUND);
    }
    return payments;
  }
}
