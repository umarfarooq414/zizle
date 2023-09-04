/// <reference types="multer" />
export declare class CreateCategoryRequestDto {
    name: string;
}
export declare class SortCategoryRequestDto {
    currentPosition: number;
    targetPosition: number;
}
export declare class AddImageToCategoryDto {
    categoryId: string;
    image: Express.Multer.File;
}
