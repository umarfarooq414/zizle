import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Notes } from './entities/notes.entity';
import { type CreateNotesRequestDto, type UpdateNotesRequestDto } from '@lib/dtos';
export declare class NotesService {
    private readonly userRepository;
    private readonly notesRepository;
    constructor(userRepository: Repository<User>, notesRepository: Repository<Notes>);
    createNotes(body: CreateNotesRequestDto): Promise<Notes | never>;
    findAll(): Promise<Notes[]>;
    findOne(userId: string): Promise<Notes[]>;
    updateById(id: string, body: UpdateNotesRequestDto): Promise<Notes>;
    deleteById(id: string): Promise<Notes>;
}
