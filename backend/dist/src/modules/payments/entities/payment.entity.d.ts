import { User } from '../../user/entities/user.entity';
export declare class Payments {
    id: string;
    transactionId: string;
    secretField: string;
    amount: number;
    packageName: string;
    currency: string;
    user: User;
    timestamp: Date;
}
