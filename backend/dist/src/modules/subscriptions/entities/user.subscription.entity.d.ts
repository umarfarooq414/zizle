import { User } from '../../user/entities/user.entity';
import { Subscription } from './subscription.entity';
export declare class UserSubscription {
    id: string;
    user: User;
    package: Subscription;
}
