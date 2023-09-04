import { IAttachmentParams } from '@lib/types';
import { Chat } from './chat.entity';
export declare class Attachment {
    constructor(params?: IAttachmentParams);
    readonly id: string;
    readonly createdAt: Date;
    fileUrl: string;
    fileType: string;
    fileName: string;
    chat: Chat;
    readonly updatedAt: Date;
}
