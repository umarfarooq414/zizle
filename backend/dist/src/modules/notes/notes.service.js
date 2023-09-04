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
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const notes_entity_1 = require("./entities/notes.entity");
const types_1 = require("../../../libs/types/src");
let NotesService = class NotesService {
    constructor(userRepository, notesRepository) {
        this.userRepository = userRepository;
        this.notesRepository = notesRepository;
    }
    async createNotes(body) {
        const { creator } = body;
        const creatorExist = await this.userRepository.findOne({
            where: {
                id: creator,
            },
        });
        if (creatorExist.role === types_1.UserRoleEnum.MODERATOR) {
            const user = await this.userRepository.findOne({ where: { id: body.userId } });
            if (user != null) {
                const notes = new notes_entity_1.Notes(Object.assign({}, body));
                return await this.notesRepository.save(notes);
            }
            else {
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            }
        }
        else {
            throw new common_1.HttpException('Sender not found!', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async findAll() {
        return await this.notesRepository.find();
    }
    async findOne(userId) {
        const notes = await this.notesRepository.findBy({ userId });
        if (!notes) {
            throw new common_1.HttpException('Note not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return notes;
    }
    async updateById(id, body) {
        const notes = await this.notesRepository.findOneBy({ id, userId: body.userId });
        if (notes == null) {
            throw new common_1.HttpException('Note not found!', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            if (body.note)
                notes.setNotes(body.note);
            return await this.notesRepository.save(notes);
        }
    }
    async deleteById(id) {
        const notes = await this.notesRepository.findOneBy({ id });
        if (notes == null) {
            throw new common_1.HttpException('Note not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return await this.notesRepository.remove(notes);
    }
};
NotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(notes_entity_1.Notes)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], NotesService);
exports.NotesService = NotesService;
//# sourceMappingURL=notes.service.js.map