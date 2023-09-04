"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinsService = void 0;
const subscriptions_1 = require("./../../../libs/types/src/db/entities/subscriptions");
const index_1 = require("./../../../libs/dtos/src/common/index");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const user_transaction_actiontypes_entity_1 = require("../user/entities/user.transaction.actiontypes.entity");
const auth_helper_1 = require("../auth/auth.helper");
const types_1 = require("../../../libs/types/src");
const fs = require("fs");
const cloudinary_config_1 = require("../../config/cloudinary.config");
let CoinsService = class CoinsService {
    constructor(userRepository, actionTypeRepository, helper, cloudinary) {
        this.userRepository = userRepository;
        this.actionTypeRepository = actionTypeRepository;
        this.helper = helper;
        this.cloudinary = cloudinary;
    }
    async findAll() {
        return await this.actionTypeRepository.find();
    }
    async findOne(id) {
        const coins = await this.actionTypeRepository.findOneBy({ id });
        if (!coins) {
            throw new common_1.HttpException('Coins not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return coins;
    }
    async setCost(token, setCostDto) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (user == null) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.role === types_1.UserRoleEnum.ADMIN) {
            const updatedActionTypes = [];
            for (const actionTypeCost of setCostDto.actionTypeCosts) {
                const actionType = await this.actionTypeRepository.findOne({
                    where: {
                        id: actionTypeCost.id,
                    },
                });
                if (!actionType) {
                    throw new common_1.HttpException('Action type not found', common_1.HttpStatus.NOT_FOUND);
                }
                if (actionType.actionType === subscriptions_1.TransactionActionTypes.SENDEMOJI) {
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
                }
                else {
                    actionType.cost = actionTypeCost.cost;
                    actionType.adminId = user.id;
                    await this.actionTypeRepository.save(actionType);
                    updatedActionTypes.push(actionType);
                }
            }
            return updatedActionTypes;
        }
        else {
            throw new common_1.HttpException('Must be an Admin!', common_1.HttpStatus.FORBIDDEN);
        }
    }
    async createActionType(token, createActionTypeDto) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (user == null) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.role === types_1.UserRoleEnum.ADMIN) {
            const exists = await this.actionTypeRepository.findOne({
                where: { actionType: createActionTypeDto.actionType },
            });
            if (exists) {
                throw new common_1.HttpException('Action type already exists', common_1.HttpStatus.CONFLICT);
            }
            const newActionType = this.actionTypeRepository.create(Object.assign(Object.assign({}, createActionTypeDto), { adminId: user.id }));
            await this.actionTypeRepository.save(newActionType);
            return newActionType;
        }
        else {
            throw new common_1.HttpException('Must be an Admin!', common_1.HttpStatus.FORBIDDEN);
        }
    }
    async findAllGifts() {
        const types = await this.actionTypeRepository.find({ where: { gift: true } });
        return types;
    }
    async findGiftById(id) {
        const gift = await this.actionTypeRepository.findOneBy({ id, gift: true });
        if (!gift) {
            throw new common_1.HttpException('Gift not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const imageData = fs.readFileSync(gift === null || gift === void 0 ? void 0 : gift.imageUrl);
        const base64Data = imageData === null || imageData === void 0 ? void 0 : imageData.toString('base64');
        gift.imageUrl = base64Data;
        return gift;
    }
    async createGift(token, createGiftDto, file) {
        const { cost, actionType } = createGiftDto;
        const parsedCost = parseInt(cost);
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        let result;
        let url;
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (user === null) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        if (typeof createGiftDto.actionType !== 'string')
            throw new common_1.HttpException('Gift title must be string!!', common_1.HttpStatus.BAD_REQUEST);
        if (typeof parsedCost !== 'number') {
            throw new common_1.HttpException('Gift cost must be a number!!', common_1.HttpStatus.BAD_REQUEST);
        }
        const existingGift = await this.actionTypeRepository.findOne({
            where: { actionType: createGiftDto.actionType },
        });
        if (existingGift)
            throw new common_1.HttpException('Gift Already Exists!', common_1.HttpStatus.CONFLICT);
        if (user.role === types_1.UserRoleEnum.ADMIN) {
            if (file) {
                try {
                    result = await this.cloudinary.uploadImage(file, 'gift');
                    url = result.url;
                }
                catch (error) {
                    throw new common_1.HttpException('Invalid File Type!', common_1.HttpStatus.BAD_REQUEST);
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
        }
        else {
            throw new common_1.HttpException('Must be an Admin!', common_1.HttpStatus.FORBIDDEN);
        }
    }
    async updateGift(token, id, updateGiftDto, file) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        let result;
        let url;
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (user === null) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.role === types_1.UserRoleEnum.ADMIN) {
            const gift = await this.actionTypeRepository.findOneBy({ id });
            if (!gift) {
                throw new common_1.HttpException('Gift not found!', common_1.HttpStatus.NOT_FOUND);
            }
            const receivedGift = await this.actionTypeRepository.findOneBy({ actionType: `Receive${gift.actionType}` });
            if (file) {
                result = await this.cloudinary.uploadImage(file, 'gift').catch(() => {
                    throw new common_1.BadRequestException('Invalid file type.');
                });
                url = result.url;
            }
            if (url) {
                gift.setGiftImageUrl(url);
            }
            const updatedGift = Object.assign(gift, updateGiftDto);
            const res = await this.actionTypeRepository.save(updatedGift);
            if (res) {
                if (updateGiftDto.actionType)
                    receivedGift.setGiftActionType(`Receive${updateGiftDto.actionType}`);
                if (updateGiftDto.cost)
                    receivedGift.setGiftCost(-updateGiftDto.cost);
                await this.actionTypeRepository.save(receivedGift);
            }
            return updatedGift;
        }
        else {
            throw new common_1.HttpException('Must be an Admin!', common_1.HttpStatus.FORBIDDEN);
        }
    }
    async deleteGift(id) {
        const gift = await this.actionTypeRepository.findOneBy({ id });
        if (!gift) {
            throw new common_1.HttpException('Gift not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const res = await this.actionTypeRepository.remove(gift);
        if (res) {
            return new index_1.GlobalResponseDto('Deleted Successfully');
        }
        else {
            return new index_1.GlobalResponseDto('Deletion unsuccessful!');
        }
    }
};
CoinsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_transaction_actiontypes_entity_1.UserTransactionActionTypes)),
    __param(2, (0, common_1.Inject)(auth_helper_1.AuthHelper)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_helper_1.AuthHelper,
        cloudinary_config_1.CloudinaryConfigService])
], CoinsService);
exports.CoinsService = CoinsService;
//# sourceMappingURL=coins.service.js.map