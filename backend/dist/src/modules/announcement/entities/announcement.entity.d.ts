import { IAnnouncementParams } from '@lib/types';
export declare class Announcement {
    constructor(params?: IAnnouncementParams);
    readonly id: string;
    readonly createdAt: Date;
    title: string;
    description: string;
    sender: string;
    readonly updatedAt: Date;
    setAnnouncementTitle(title: string): void;
    setAnnouncementDescription(description: string): void;
}
