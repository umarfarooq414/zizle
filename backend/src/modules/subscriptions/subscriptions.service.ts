import { Subscription } from './entities/subscription.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthHelper } from '../auth/auth.helper';
import { User } from '../user/entities/user.entity';
import { type CreateSubscriptionRequestDto, type UpdateSubscriptionRequestDto } from '@lib/dtos/subscriptions';
import { Repository } from 'typeorm';
import { type Package, UserRoleEnum, getPackageFromNumber } from '@lib/types';
import { UserSubscription } from './entities/user.subscription.entity';
@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(UserSubscription)
    private readonly userSubscription: Repository<UserSubscription>,
    @Inject(AuthHelper)
    private readonly helper: AuthHelper
  ) {}

  public async createSubscription(body: CreateSubscriptionRequestDto): Promise<Subscription | never> {
    const { creator, packageType }: CreateSubscriptionRequestDto = body;
    const senderExist = await this.userRepository.findOne({
      where: {
        id: creator,
      },
    });
    if (senderExist?.role === UserRoleEnum.ADMIN) {
      const subscription = new Subscription({
        ...body,
      });
      return await this.subscriptionRepository.save(subscription);
    } else {
      throw new HttpException('Sender not found!', HttpStatus.NOT_FOUND);
    }
  }

  public async findAll(): Promise<Subscription[]> {
    return await this.subscriptionRepository.find();
  }

  public async findUserPackages(token: string): Promise<Subscription[]> {
    try {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user = await this.helper.validateUser(decoded);
      if (!user) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      const userPackages = await this.getUserPackages(user);
      const packages = await this.subscriptionRepository.find();
      const filteredPackages = packages.filter((pkg) => {
        return !userPackages.some((userPackage) => userPackage.package.id === pkg.id);
      });
      return filteredPackages;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async getUserPackages(user: User): Promise<UserSubscription[]> {
    const packages: UserSubscription[] = await this.userSubscription.find({
      where: { user: { id: user.id } },
      relations: ['package'],
    });
    return packages;
  }

  public async findOne(id: string) {
    const subscription = await this.subscriptionRepository.findOneBy({ id });
    if (subscription == null) {
      throw new HttpException('Subscription not found!', HttpStatus.NOT_FOUND);
    }
    return subscription;
  }

  public async updateById(id: string, body: UpdateSubscriptionRequestDto): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOneBy({ id });
    if (subscription == null) {
      throw new HttpException('Subscription not found!', HttpStatus.NOT_FOUND);
    } else {
      if (body.amount >= 0) subscription.setSubscriptionAmount(body.amount);
      if (body.noOfCoins >= 0) subscription.setSubscriptionNoOfCoins(body.noOfCoins);
      if (body.bestSelling || !body.bestSelling) {
        subscription.setSubscriptionBestSelling(body.bestSelling);
      }
      if (body.packageType) subscription.setSubscriptionPackageType(body.packageType);

      return await this.subscriptionRepository.save(subscription);
    }
  }

  public async deleteById(id: string) {
    const subscription = await this.subscriptionRepository.findOneBy({ id });
    if (subscription == null) {
      throw new HttpException('Subscription not found!', HttpStatus.NOT_FOUND);
    }
    return await this.subscriptionRepository.remove(subscription);
  }
}
