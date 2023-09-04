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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notes = void 0;
const typeorm_1 = require("typeorm");
let Notes = class Notes {
    constructor(params) {
        if (params != null) {
            this.note = params.note;
            this.creator = params.creator;
            this.userId = params.userId;
        }
    }
    setNotes(notes) {
        this.note = notes;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({}),
    __metadata("design:type", String)
], Notes.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Notes.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Notes.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 36, nullable: true }),
    __metadata("design:type", String)
], Notes.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 36, nullable: true }),
    __metadata("design:type", String)
], Notes.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Notes.prototype, "updatedAt", void 0);
Notes = __decorate([
    (0, typeorm_1.Entity)({ name: 'notes' }),
    __metadata("design:paramtypes", [Object])
], Notes);
exports.Notes = Notes;
//# sourceMappingURL=notes.entity.js.map