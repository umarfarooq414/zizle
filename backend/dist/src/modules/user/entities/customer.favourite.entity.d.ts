import { User } from './user.entity';
export declare class Favorite {
    id: string;
    userId: string;
    favorites: User;
    created_at: Date;
    updated_at: Date;
}
