import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { BlockChatDto, GetChatDto } from '@lib/dtos';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createdAnnouncement(chatDto: any, token?: string): Promise<Chat>;
    getMessages(token: string, { sender, receiver }: GetChatDto): Promise<{
        chats: Chat[];
        moderatorIds: number[];
    }>;
    getChatUsers(token: string, userId: string): Promise<any>;
    getCleintChatUsers(token: string, userId: string): Promise<import("./chat.service").UserWithLatestChatDTO[]>;
    createdFakeChat(token: string, chatDto: any): Promise<Chat | import("../fake/entities/fakeChat.entity").FakeChat>;
    test(sender: string, receiver: string, message: string): Promise<void>;
    getModChatUsers(token: string, modId: string): Promise<{
        fakeChatPartners: any;
    }>;
    blockModChat(token: string, body: BlockChatDto): Promise<import("../../../libs/dtos/src/common").GlobalResponseDto>;
    unblockModChat(token: string, body: BlockChatDto): Promise<import("../../../libs/dtos/src/common").GlobalResponseDto>;
}
