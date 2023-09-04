import { User } from './user.entity';
export declare class Address {
    id: string;
    address: string;
    latitude: number;
    longitude: number;
    user: User;
    timestamp: Date;
    setAddress(address: string): void;
    setLatitude(latitude: number): void;
    setLongitude(longitude: number): void;
}
