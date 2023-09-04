import { User } from './user.entity';
export declare class Photo {
    id: string;
    photos: string;
    user: User;
    timestamp: Date;
    setPhotosPath(path: string): void;
}
