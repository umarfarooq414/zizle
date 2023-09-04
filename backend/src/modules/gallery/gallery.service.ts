import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Categories } from './entities/categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalResponseDto } from '@lib/dtos/common';
import { AuthHelper } from '../auth/auth.helper';
import { UserRoleEnum } from '@lib/types';
import { User } from '../user/entities/user.entity';
import { Category } from '@ngneat/falso/lib/sports';
import { CreateCategoryRequestDto } from '@lib/dtos';
import { Images } from './entities/images.entity';
import { Express } from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class GalleryService {
  @InjectRepository(Categories) private readonly categoriesRepo: Repository<Categories>;
  @InjectRepository(Images) private readonly imagesRepo: Repository<Images>;
  @Inject(AuthHelper) private readonly helper: AuthHelper;
  @Inject(UserService) private readonly UserService: UserService;
  public async findAll(): Promise<Categories[]> {
    return await this.categoriesRepo.find({
      order: {
        position: 'ASC',
      },
    });
  }

  public async deleteCategoryById(token: string, id: string): Promise<GlobalResponseDto> {
    try {
      token = token.includes('Bearer') ? token.split(' ')[1] : token;
      const decoded = await this.helper.decode(token as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('User must be Admin!', HttpStatus.UNAUTHORIZED);

      const category = await this.categoriesRepo.findOne({
        where: {
          id,
        },
        relations: ['images'],
      });

      if (!category) throw new HttpException('Category not found!', HttpStatus.NOT_FOUND);
      const res = await this.categoriesRepo.remove(category);
      return new GlobalResponseDto('Category Deleted!');
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  public async createCategory(token: string, name: string): Promise<Categories> {
    try {
      token = token.includes('Bearer') ? token.split(' ')[1] : token;
      const decoded = await this.helper.decode(token as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('User must be Admin!', HttpStatus.UNAUTHORIZED);
      const existingCategory = await this.categoriesRepo.findOneBy({ name });
      if (existingCategory) throw new HttpException('Category Already Exists!', HttpStatus.CONFLICT);

      const category = new Categories();
      category.name = name;

      // const images: Images[] = [];

      // const image = new Images();
      // images.push(image);
      // await Promise.all(images.map((image) => this.imagesRepo.save(image)));
      // category.images = images;
      const savedCategory = await this.categoriesRepo.save(category);
      savedCategory.position = Number(savedCategory.id);
      return await this.categoriesRepo.save(savedCategory);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async sortCategories(token: string, currentPosition: number, targetPosition: number): Promise<Categories> {
    try {
      token = token.includes('Bearer') ? token.split(' ')[1] : token;
      const decoded = await this.helper.decode(token as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('User must be Admin!', HttpStatus.UNAUTHORIZED);

      const positions = await this.categoriesRepo
        .createQueryBuilder('categories')
        .select('categories.position')
        .getMany();
      const incomingPositions = [currentPosition, targetPosition];

      const valuesExists = incomingPositions.every((value) => {
        return positions.map((position) => position.position).includes(value);
      });

      if (!valuesExists) {
        throw new HttpException('Positions Are Not Correct', HttpStatus.NOT_FOUND);
      }
      const current = await this.categoriesRepo.findOne({ where: { position: currentPosition } });
      const target = await this.categoriesRepo.findOne({ where: { position: targetPosition } });
      const queryRunner = this.categoriesRepo.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      current.position = -1;
      await queryRunner.manager.save(current);
      target.position = currentPosition;
      await queryRunner.manager.save(target);
      try {
        current.position = targetPosition;
        await queryRunner.manager.save(current);

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Error while saving:', error);
      } finally {
        await queryRunner.release();
      }

      return await this.categoriesRepo.findOne({ where: { id: currentPosition.toString() } });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async addImagesToCategory(token: string, categoryId: string, file: Express.Multer.File): Promise<Categories> {
    try {
      token = token.includes('Bearer') ? token.split(' ')[1] : token;
      const decoded = await this.helper.decode(token as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('User must be Admin!', HttpStatus.UNAUTHORIZED);

      const URL = await this.UserService.savePhoto(file, 'gallery');

      const category = await this.categoriesRepo.findOne({ where: { id: categoryId.toString() } });
      if (!category) {
        throw new HttpException('Category is not valid', HttpStatus.NOT_FOUND);
      }

      const categoryImage = {
        url: URL,
        categories: category,
      };

      await this.imagesRepo.save(categoryImage);

      return category;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async getAllCategoriesImages(token: string): Promise<Images[]> {
    try {
      token = token.includes('Bearer') ? token.split(' ')[1] : token;
      const decoded = await this.helper.decode(token as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('User must be Admin!', HttpStatus.UNAUTHORIZED);

      return await this.imagesRepo.find({
        relations: ['categories'],
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async getImagesByCategory(token: string, categoryId: string): Promise<Images[]> {
    try {
      token = token.includes('Bearer') ? token.split(' ')[1] : token;
      const decoded = await this.helper.decode(token as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN && user.role !== UserRoleEnum.MODERATOR)
        throw new HttpException('User must be Admin or Moderator!', HttpStatus.UNAUTHORIZED);

      const category = await this.categoriesRepo.findOne({ where: { id: categoryId.toString() } });
      if (!category) {
        throw new HttpException('Category is not valid', HttpStatus.NOT_FOUND);
      }
      return await this.imagesRepo.find({
        where: {
          categories: { id: categoryId },
        },
        relations: ['categories'],
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async deleteImageById(token: string, id: string): Promise<GlobalResponseDto> {
    try {
      token = token.includes('Bearer') ? token.split(' ')[1] : token;
      const decoded = await this.helper.decode(token as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      if (user.role !== UserRoleEnum.ADMIN) throw new HttpException('User must be Admin!', HttpStatus.UNAUTHORIZED);

      const image = await this.imagesRepo.findOne({
        where: {
          id,
        },
      });

      if (!image) throw new HttpException('Image not found!', HttpStatus.NOT_FOUND);
      await this.imagesRepo.remove(image);

      return new GlobalResponseDto('Category Deleted!');
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
