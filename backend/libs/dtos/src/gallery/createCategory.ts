import { IsNotEmpty, IsNumber, IsString, isString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';
import { Type } from 'class-transformer';
import { UploadedFile } from '@nestjs/common';
export class CreateCategoryRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'name of the category',
  })
  name: string;
}

export class SortCategoryRequestDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Current Postion of the category',
  })
  currentPosition: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Target Postion of the category',
  })
  targetPosition: number;
}

export class AddImageToCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Id Of category',
  })
  categoryId: string;

  @ApiProperty({
    type: 'file',
    required: true,
  })
  @Type(() => UploadedFile)
  image: Express.Multer.File;
}
