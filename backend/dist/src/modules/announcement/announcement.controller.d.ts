import { Announcement } from './entities/announcement.entity';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementRequestDto, UpdateAnnouncementRequestDto } from '@lib/dtos';
export declare class AnnouncementController {
    private readonly announcementService;
    constructor(announcementService: AnnouncementService);
    findAll(): Promise<Announcement[]>;
    createdAnnouncement(announcementDto: CreateAnnouncementRequestDto): Promise<Announcement>;
    findOne(id: string): Promise<Announcement>;
    updateById(id: string, body: UpdateAnnouncementRequestDto): Promise<Announcement>;
    deleteById(id: string): Promise<Announcement>;
}
