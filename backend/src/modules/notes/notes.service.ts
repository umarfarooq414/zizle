import { CreateAnnouncementRequestDto } from '../../../libs/dtos/src/announcement/create';

import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Notes } from './entities/notes.entity';
import { type CreateNotesRequestDto, type UpdateNotesRequestDto } from '@lib/dtos';
import { UserRoleEnum } from '@lib/types';
@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Notes)
    private readonly notesRepository: Repository<Notes>
  ) {}

  public async createNotes(body: CreateNotesRequestDto): Promise<Notes | never> {
    const { creator }: CreateNotesRequestDto = body;
    const creatorExist = await this.userRepository.findOne({
      where: {
        id: creator,
      },
    });
    if (creatorExist.role === UserRoleEnum.MODERATOR) {
      const user = await this.userRepository.findOne({ where: { id: body.userId } });
      if (user != null) {
        const notes = new Notes({
          ...body,
        });
        return await this.notesRepository.save(notes);
      } else {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
    } else {
      throw new HttpException('Sender not found!', HttpStatus.NOT_FOUND);
    }
  }

  public async findAll(): Promise<Notes[]> {
    return await this.notesRepository.find();
  }

  public async findOne(userId: string) {
    const notes = await this.notesRepository.findBy({ userId });
    if (!notes) {
      throw new HttpException('Note not found!', HttpStatus.NOT_FOUND);
    }
    return notes;
  }

  public async updateById(id: string, body: UpdateNotesRequestDto): Promise<Notes> {
    const notes = await this.notesRepository.findOneBy({ id, userId: body.userId });
    if (notes == null) {
      throw new HttpException('Note not found!', HttpStatus.NOT_FOUND);
    } else {
      if (body.note) notes.setNotes(body.note);
      return await this.notesRepository.save(notes);
    }
  }

  public async deleteById(id: string) {
    const notes = await this.notesRepository.findOneBy({ id });
    if (notes == null) {
      throw new HttpException('Note not found!', HttpStatus.NOT_FOUND);
    }
    return await this.notesRepository.remove(notes);
  }
}
