import { CreateActionTypeDto, CreateGiftDto, SetCostDto } from '@lib/dtos';
import { CoinsService } from './coins.service';
export declare class CoinsController {
    private readonly coinsService;
    constructor(coinsService: CoinsService);
    findAll(): Promise<import("../user/entities/user.transaction.actiontypes.entity").UserTransactionActionTypes[]>;
    findById(id: string): Promise<import("../user/entities/user.transaction.actiontypes.entity").UserTransactionActionTypes>;
    setCost(token: string, setCostDto: SetCostDto): Promise<any[]>;
    createActionType(token: string, createActionTypeDto: CreateActionTypeDto): Promise<import("../user/entities/user.transaction.actiontypes.entity").UserTransactionActionTypes>;
    createGift(token: string, createGiftDto: CreateGiftDto, file: any): Promise<import("../user/entities/user.transaction.actiontypes.entity").UserTransactionActionTypes>;
    updateGift(token: string, updateGiftDto: CreateGiftDto, id: string, file: any): Promise<import("../user/entities/user.transaction.actiontypes.entity").UserTransactionActionTypes & CreateGiftDto>;
    findGiftById(id: string): Promise<import("../user/entities/user.transaction.actiontypes.entity").UserTransactionActionTypes>;
    findAllGift(): Promise<import("../user/entities/user.transaction.actiontypes.entity").UserTransactionActionTypes[]>;
    deleteGift(id: string): Promise<import("../../../libs/dtos/src/common").GlobalResponseDto>;
}
