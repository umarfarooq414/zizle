import { GlobalResponseDto } from './../../../libs/dtos/src/common/index';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateActionTypeDto, CreateGiftDto, SetCostDto } from '@lib/dtos';
import { UserTransactionActionTypes } from '../user/entities/user.transaction.actiontypes.entity';
import { AuthHelper } from '../auth/auth.helper';
import { CloudinaryConfigService } from '@config/cloudinary.config';
export declare class CoinsService {
    private readonly userRepository;
    private readonly actionTypeRepository;
    private readonly helper;
    private cloudinary;
    constructor(userRepository: Repository<User>, actionTypeRepository: Repository<UserTransactionActionTypes>, helper: AuthHelper, cloudinary: CloudinaryConfigService);
    findAll(): Promise<UserTransactionActionTypes[]>;
    findOne(id: string): Promise<UserTransactionActionTypes>;
    setCost(token: string, setCostDto: SetCostDto): Promise<any[]>;
    createActionType(token: string, createActionTypeDto: CreateActionTypeDto): Promise<UserTransactionActionTypes>;
    findAllGifts(): Promise<UserTransactionActionTypes[]>;
    findGiftById(id: string): Promise<UserTransactionActionTypes>;
    createGift(token: string, createGiftDto: CreateGiftDto, file: any): Promise<UserTransactionActionTypes>;
    updateGift(token: string, id: string, updateGiftDto: CreateGiftDto, file: any): Promise<UserTransactionActionTypes & CreateGiftDto>;
    deleteGift(id: string): Promise<GlobalResponseDto>;
}
