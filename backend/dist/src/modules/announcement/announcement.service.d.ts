import { type CreateAnnouncementRequestDto } from '../../../libs/dtos/src/announcement/create';
import { Repository } from 'typeorm';
import { AuthHelper } from '../auth/auth.helper';
import { User } from '../user/entities/user.entity';
import { Announcement } from './entities/announcement.entity';
import { type UpdateAnnouncementRequestDto } from '@lib/dtos';
export declare class AnnouncementService {
    private readonly userRepository;
    private readonly announcementRepository;
    private readonly helper;
    constructor(userRepository: Repository<User>, announcementRepository: Repository<Announcement>, helper: AuthHelper);
    createAnnouncement(body: CreateAnnouncementRequestDto): Promise<Announcement | never>;
    findAll(): Promise<Announcement[]>;
    findOne(id: string): Promise<Announcement>;
    updateById(id: string, body: UpdateAnnouncementRequestDto): Promise<Announcement>;
    deleteById(id: string): Promise<Announcement>;
}
