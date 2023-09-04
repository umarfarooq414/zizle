import { TransactionActionTypes } from './../../../libs/types/src/db/entities/subscriptions';
import { GlobalResponseDto } from './../../../libs/dtos/src/common/index';
import { CreateAnnouncementRequestDto } from '../../../libs/dtos/src/announcement/create';

import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateActionTypeDto, CreateGiftDto, SetCostDto, UpdateGiftDto } from '@lib/dtos';
import { UserTransactionActionTypes } from '../user/entities/user.transaction.actiontypes.entity';
import { AuthHelper } from '../auth/auth.helper';
import { UserRoleEnum } from '@lib/types';
import * as fs from 'fs';
import * as path from 'path';
import { CloudinaryConfigService } from '@config/cloudinary.config';
import { clearConfigCache } from 'prettier';
@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserTransactionActionTypes)
    private readonly actionTypeRepository: Repository<UserTransactionActionTypes>,
    @Inject(AuthHelper)
    private readonly helper: AuthHelper,
    private cloudinary: CloudinaryConfigService
  ) {}

  public async findAll(): Promise<UserTransactionActionTypes[]> {
    return await this.actionTypeRepository.find();
  }

  public async findOne(id: string) {
    const coins = await this.actionTypeRepository.findOneBy({ id });
    if (!coins) {
      throw new HttpException('Coins not found!', HttpStatus.NOT_FOUND);
    }
    return coins;
  }

  async setCost(token: string, setCostDto: SetCostDto) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    if (user == null) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    if (user.role === UserRoleEnum.ADMIN) {
      const updatedActionTypes = [];

      for (const actionTypeCost of setCostDto.actionTypeCosts) {
        const actionType = await this.actionTypeRepository.findOne({
          where: {
            id: actionTypeCost.id,
          },
        });

        if (!actionType) {
          throw new HttpException('Action type not found', HttpStatus.NOT_FOUND);
        }
        if (actionType.actionType === TransactionActionTypes.SENDEMOJI) {
          const receiveEmoji = await this.actionTypeRepository.findOne({
            where: {
              actionType: 'ReceiveEmoji',
            },
          });
          actionType.cost = actionTypeCost.cost;
          actionType.adminId = user.id;
          await this.actionTypeRepository.save(actionType);
          updatedActionTypes.push(actionType);
          receiveEmoji.cost = -actionTypeCost.cost;
          receiveEmoji.adminId = user.id;
          await this.actionTypeRepository.save(receiveEmoji);
          updatedActionTypes.push(receiveEmoji);
        } else {
          actionType.cost = actionTypeCost.cost;
          actionType.adminId = user.id;
          await this.actionTypeRepository.save(actionType);
          updatedActionTypes.push(actionType);
        }
      }

      return updatedActionTypes;
    } else {
      throw new HttpException('Must be an Admin!', HttpStatus.FORBIDDEN);
    }
  }

  async createActionType(token: string, createActionTypeDto: CreateActionTypeDto) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    if (user == null) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    if (user.role === UserRoleEnum.ADMIN) {
      const exists = await this.actionTypeRepository.findOne({
        where: { actionType: createActionTypeDto.actionType },
      });

      if (exists) {
        throw new HttpException('Action type already exists', HttpStatus.CONFLICT);
      }
      const newActionType = this.actionTypeRepository.create({ ...createActionTypeDto, adminId: user.id });
      await this.actionTypeRepository.save(newActionType);
      return newActionType;
    } else {
      throw new HttpException('Must be an Admin!', HttpStatus.FORBIDDEN);
    }
  }

  public async findAllGifts(): Promise<UserTransactionActionTypes[]> {
    const types = await this.actionTypeRepository.find({ where: { gift: true } });
    return types;
  }

  public async findGiftById(id: string) {
    const gift = await this.actionTypeRepository.findOneBy({ id, gift: true });
    if (!gift) {
      throw new HttpException('Gift not found!', HttpStatus.NOT_FOUND);
    }
    const imageData = fs.readFileSync(gift?.imageUrl);
    const base64Data = imageData?.toString('base64');
    gift.imageUrl = base64Data;
    return gift;
  }

  async createGift(token: string, createGiftDto: CreateGiftDto, file) {
    const { cost, actionType } = createGiftDto;
    const parsedCost = parseInt(cost);
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string);
    let result;
    let url;
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    if (user === null) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    if (typeof createGiftDto.actionType !== 'string')
      throw new HttpException('Gift title must be string!!', HttpStatus.BAD_REQUEST);
    if (typeof parsedCost !== 'number') {
      throw new HttpException('Gift cost must be a number!!', HttpStatus.BAD_REQUEST);
    }

    const existingGift = await this.actionTypeRepository.findOne({
      where: { actionType: createGiftDto.actionType as TransactionActionTypes },
    });
    if (existingGift) throw new HttpException('Gift Already Exists!', HttpStatus.CONFLICT);
    if (user.role === UserRoleEnum.ADMIN) {
      if (file) {
        try {
          result = await this.cloudinary.uploadImage(file, 'gift');
          url = result.url;
        } catch (error) {
          throw new HttpException('Invalid File Type!', HttpStatus.BAD_REQUEST);
        }
      }

      const gift = this.actionTypeRepository.create({ actionType, cost: parsedCost, adminId: user.id, gift: true });
      if (gift) {
        if (url) {
          gift.setGiftImageUrl(url);
        }
      }
      const newGift = await this.actionTypeRepository.save(gift);
      const obj = {
        actionType: `Receive${createGiftDto.actionType}`,
        cost: -parsedCost,
        imageUrl: createGiftDto.imageUrl,
      };

      await this.actionTypeRepository.save(obj);
      return newGift;
    } else {
      throw new HttpException('Must be an Admin!', HttpStatus.FORBIDDEN);
    }
  }

  async updateGift(token: string, id: string, updateGiftDto: CreateGiftDto, file) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string);
    let result;
    let url;
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    if (user === null) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    if (user.role === UserRoleEnum.ADMIN) {
      const gift = await this.actionTypeRepository.findOneBy({ id });
      if (!gift) {
        throw new HttpException('Gift not found!', HttpStatus.NOT_FOUND);
      }
      const receivedGift = await this.actionTypeRepository.findOneBy({ actionType: `Receive${gift.actionType}` });
      if (file) {
        result = await this.cloudinary.uploadImage(file, 'gift').catch(() => {
          throw new BadRequestException('Invalid file type.');
        });
        url = result.url;
      }
      if (url) {
        gift.setGiftImageUrl(url);
      }
      const updatedGift = Object.assign(gift, updateGiftDto);
      const res = await this.actionTypeRepository.save(updatedGift);
      if (res) {
        if (updateGiftDto.actionType) receivedGift.setGiftActionType(`Receive${updateGiftDto.actionType}`);
        if (updateGiftDto.cost) receivedGift.setGiftCost(-updateGiftDto.cost);
        await this.actionTypeRepository.save(receivedGift);
      }

      return updatedGift;
    } else {
      throw new HttpException('Must be an Admin!', HttpStatus.FORBIDDEN);
    }
  }

  public async deleteGift(id: string) {
    const gift = await this.actionTypeRepository.findOneBy({ id });
    if (!gift) {
      throw new HttpException('Gift not found!', HttpStatus.NOT_FOUND);
    }
    const res = await this.actionTypeRepository.remove(gift);
    if (res) {
      return new GlobalResponseDto('Deleted Successfully');
    } else {
      return new GlobalResponseDto('Deletion unsuccessful!');
    }
  }
}
