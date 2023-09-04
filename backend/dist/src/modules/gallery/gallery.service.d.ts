/// <reference types="multer" />
import { Categories } from './entities/categories.entity';
import { GlobalResponseDto } from '@lib/dtos/common';
import { Images } from './entities/images.entity';
export declare class GalleryService {
    private readonly categoriesRepo;
    private readonly imagesRepo;
    private readonly helper;
    private readonly UserService;
    findAll(): Promise<Categories[]>;
    deleteCategoryById(token: string, id: string): Promise<GlobalResponseDto>;
    createCategory(token: string, name: string): Promise<Categories>;
    sortCategories(token: string, currentPosition: number, targetPosition: number): Promise<Categories>;
    addImagesToCategory(token: string, categoryId: string, file: Express.Multer.File): Promise<Categories>;
    getAllCategoriesImages(token: string): Promise<Images[]>;
    getImagesByCategory(token: string, categoryId: string): Promise<Images[]>;
    deleteImageById(token: string, id: string): Promise<GlobalResponseDto>;
}
