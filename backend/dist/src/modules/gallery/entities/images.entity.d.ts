import { Categories } from './categories.entity';
export declare class Images {
    readonly id: string;
    url: string;
    categories: Categories;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
