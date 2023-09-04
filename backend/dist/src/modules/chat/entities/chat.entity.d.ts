import { IChatParams } from '@lib/types';
import { Attachment } from './attachment.entity';
import { FakeChat } from 'src/modules/fake/entities/fakeChat.entity';
export declare class Chat {
    constructor(params?: IChatParams);
    readonly id: string;
    readonly createdAt: Date;
    message: string;
    receiver: string;
    sender: string;
    seen: boolean;
    attachments: Attachment;
    chat: FakeChat;
    readonly updatedAt: Date;
}
