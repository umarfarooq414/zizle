import { Notes } from './entities/notes.entity';
import { CreateNotesRequestDto, UpdateNotesRequestDto } from '@lib/dtos';
import { NotesService } from './notes.service';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    findAll(): Promise<Notes[]>;
    createdNotes(NotesDto: CreateNotesRequestDto): Promise<Notes>;
    findOne(userId: string): Promise<Notes[]>;
    updateById(id: string, body: UpdateNotesRequestDto): Promise<Notes>;
    deleteById(id: string): Promise<Notes>;
}
