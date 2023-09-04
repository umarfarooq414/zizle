import { Subscription } from './entities/subscription.entity';
import { AuthHelper } from '../auth/auth.helper';
import { User } from '../user/entities/user.entity';
import { type CreateSubscriptionRequestDto, type UpdateSubscriptionRequestDto } from '@lib/dtos/subscriptions';
import { Repository } from 'typeorm';
import { UserSubscription } from './entities/user.subscription.entity';
export declare class SubscriptionsService {
    private readonly userRepository;
    private readonly subscriptionRepository;
    private readonly userSubscription;
    private readonly helper;
    constructor(userRepository: Repository<User>, subscriptionRepository: Repository<Subscription>, userSubscription: Repository<UserSubscription>, helper: AuthHelper);
    createSubscription(body: CreateSubscriptionRequestDto): Promise<Subscription | never>;
    findAll(): Promise<Subscription[]>;
    findUserPackages(token: string): Promise<Subscription[]>;
    getUserPackages(user: User): Promise<UserSubscription[]>;
    findOne(id: string): Promise<Subscription>;
    updateById(id: string, body: UpdateSubscriptionRequestDto): Promise<Subscription>;
    deleteById(id: string): Promise<Subscription>;
}
