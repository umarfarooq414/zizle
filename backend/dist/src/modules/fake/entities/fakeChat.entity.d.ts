import { Chat } from 'src/modules/chat/entities/chat.entity';
import { UserRoleEnum } from './../../../../libs/types/src/db/entities/user';
export declare class FakeChat {
    readonly id: string;
    moderatorId: string;
    type: UserRoleEnum;
    blocked: boolean;
    chat: Chat;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
