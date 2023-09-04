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
exports.AnnouncementService = void 0;
const types_1 = require("../../../libs/types/src");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_helper_1 = require("../auth/auth.helper");
const user_entity_1 = require("../user/entities/user.entity");
const announcement_entity_1 = require("./entities/announcement.entity");
let AnnouncementService = class AnnouncementService {
    constructor(userRepository, announcementRepository, helper) {
        this.userRepository = userRepository;
        this.announcementRepository = announcementRepository;
        this.helper = helper;
    }
    async createAnnouncement(body) {
        const { sender } = body;
        const senderExist = await this.userRepository.findOne({
            where: {
                id: sender,
            },
        });
        if (senderExist.role === types_1.UserRoleEnum.ADMIN) {
            const announcement = new announcement_entity_1.Announcement(Object.assign({}, body));
            return await this.announcementRepository.save(announcement);
        }
        else {
            throw new common_1.HttpException('Sender not found!', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async findAll() {
        return await this.announcementRepository.find();
    }
    async findOne(id) {
        const announcement = await this.announcementRepository.findOneBy({ id });
        if (announcement == null) {
            throw new common_1.HttpException('Announcement not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return announcement;
    }
    async updateById(id, body) {
        const announcement = await this.announcementRepository.findOneBy({ id });
        if (announcement == null) {
            throw new common_1.HttpException('Announcement not found!', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            if (body.title)
                announcement.setAnnouncementTitle(body.title);
            if (body.description)
                announcement.setAnnouncementDescription(body.description);
            return await this.announcementRepository.save(announcement);
        }
    }
    async deleteById(id) {
        const announcement = await this.announcementRepository.findOneBy({ id });
        if (announcement == null) {
            throw new common_1.HttpException('Announcement not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return await this.announcementRepository.remove(announcement);
    }
};
AnnouncementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(announcement_entity_1.Announcement)),
    __param(2, (0, common_1.Inject)(auth_helper_1.AuthHelper)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_helper_1.AuthHelper])
], AnnouncementService);
exports.AnnouncementService = AnnouncementService;
//# sourceMappingURL=announcement.service.js.map