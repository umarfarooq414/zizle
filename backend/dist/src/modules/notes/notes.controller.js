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
exports.NotesController = void 0;
const common_1 = require("@nestjs/common");
const notes_entity_1 = require("./entities/notes.entity");
const swagger_1 = require("@nestjs/swagger");
const types_1 = require("../../../libs/types/src");
const guards_1 = require("../../guards");
const constants_1 = require("../../../libs/constants/src");
const dtos_1 = require("../../../libs/dtos/src");
const notes_service_1 = require("./notes.service");
let NotesController = class NotesController {
    constructor(notesService) {
        this.notesService = notesService;
    }
    async findAll() {
        return await this.notesService.findAll();
    }
    async createdNotes(NotesDto) {
        return await this.notesService.createNotes(NotesDto);
    }
    async findOne(userId) {
        return await this.notesService.findOne(userId);
    }
    async updateById(id, body) {
        return await this.notesService.updateById(id, body);
    }
    async deleteById(id) {
        return await this.notesService.deleteById(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'All Notess!' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notes!',
        type: notes_entity_1.Notes,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('createNotes'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Create Notes' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Notes created!',
        type: notes_entity_1.Notes,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateNotesRequestDto]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "createdNotes", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Notes' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter User id',
        type: 'string',
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Notes' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter Notes id',
        type: 'string',
    }),
    (0, common_1.Put)('updateNotes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UpdateNotesRequestDto]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "updateById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete Notes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deleted.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter Notes id',
        type: 'string',
    }),
    (0, common_1.Delete)('deleteNotes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "deleteById", null);
NotesController = __decorate([
    (0, common_1.Controller)('notes'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.MODERATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.NOTES),
    __metadata("design:paramtypes", [notes_service_1.NotesService])
], NotesController);
exports.NotesController = NotesController;
//# sourceMappingURL=notes.controller.js.map