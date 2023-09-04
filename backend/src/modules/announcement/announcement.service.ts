import { UserRoleEnum } from '@lib/types';
import { type CreateAnnouncementRequestDto } from '../../../libs/dtos/src/announcement/create';

import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AuthHelper } from '../auth/auth.helper';
import { User } from '../user/entities/user.entity';
import { Announcement } from './entities/announcement.entity';
import { type UpdateAnnouncementRequestDto } from '@lib/dtos';
@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @Inject(AuthHelper)
    private readonly helper: AuthHelper
  ) {}

  public async createAnnouncement(body: CreateAnnouncementRequestDto): Promise<Announcement | never> {
    const { sender }: CreateAnnouncementRequestDto = body;
    const senderExist = await this.userRepository.findOne({
      where: {
        id: sender,
      },
    });
    if (senderExist.role === UserRoleEnum.ADMIN) {
      const announcement = new Announcement({
        ...body,
      });
      return await this.announcementRepository.save(announcement);
    } else {
      throw new HttpException('Sender not found!', HttpStatus.NOT_FOUND);
    }
  }

  public async findAll(): Promise<Announcement[]> {
    return await this.announcementRepository.find();
  }

  public async findOne(id: string) {
    const announcement = await this.announcementRepository.findOneBy({ id });
    if (announcement == null) {
      throw new HttpException('Announcement not found!', HttpStatus.NOT_FOUND);
    }
    return announcement;
  }

  public async updateById(id: string, body: UpdateAnnouncementRequestDto): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOneBy({ id });
    if (announcement == null) {
      throw new HttpException('Announcement not found!', HttpStatus.NOT_FOUND);
    } else {
      if (body.title) announcement.setAnnouncementTitle(body.title);
      if (body.description) announcement.setAnnouncementDescription(body.description);
      return await this.announcementRepository.save(announcement);
    }
  }

  public async deleteById(id: string) {
    const announcement = await this.announcementRepository.findOneBy({ id });
    if (announcement == null) {
      throw new HttpException('Announcement not found!', HttpStatus.NOT_FOUND);
    }
    return await this.announcementRepository.remove(announcement);
  }
}
