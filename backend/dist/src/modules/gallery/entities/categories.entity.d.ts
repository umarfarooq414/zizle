import { Images } from './images.entity';
export declare class Categories {
    readonly id: string;
    name: string;
    position: number;
    images: Images[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
