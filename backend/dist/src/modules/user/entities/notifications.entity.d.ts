import { User } from './user.entity';
import { NotificationAction } from '@lib/types';
export declare class Notifications {
    readonly id: string;
    message: string;
    seen: boolean;
    category: NotificationAction;
    notifier: User;
    notified: User;
    timestamp: Date;
}
