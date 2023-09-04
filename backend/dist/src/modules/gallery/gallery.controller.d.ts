/// <reference types="multer" />
import { GalleryService } from './gallery.service';
import { Categories } from './entities/categories.entity';
import { AddImageToCategoryDto, CreateCategoryRequestDto, SortCategoryRequestDto } from '@lib/dtos';
export declare class GalleryController {
    private readonly galleryService;
    constructor(galleryService: GalleryService);
    findAll(): Promise<Categories[]>;
    deleteById(token: string, id: string): Promise<import("../../../libs/dtos/src/common").GlobalResponseDto>;
    createCategory(token: string, { name }: CreateCategoryRequestDto): Promise<Categories>;
    sortCategories(token: string, { currentPosition, targetPosition }: SortCategoryRequestDto): Promise<Categories>;
    addImagesToCategory(token: string, { categoryId }: AddImageToCategoryDto, file: Express.Multer.File): Promise<Categories>;
    getAllCategoriesImages(token: string): Promise<import("./entities/images.entity").Images[]>;
    getImagesByCategory(token: string, categoryId: string): Promise<import("./entities/images.entity").Images[]>;
    deleteImage(token: string, id: string): Promise<import("../../../libs/dtos/src/common").GlobalResponseDto>;
}
