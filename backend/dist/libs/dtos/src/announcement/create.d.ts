import { type IAnnouncement } from '@lib/types';
export declare class CreateAnnouncementRequestDto implements IAnnouncement {
    readonly title: string;
    readonly description: string;
    readonly sender: string;
}
