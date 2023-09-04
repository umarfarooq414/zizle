import { BlockChatDto } from './../../../libs/dtos/src/chat/blockChat';
import { GetModsStatsQueryParamsDto } from './../../../libs/dtos/src/auth/mod.stats.dto';
import { UserService } from './../user/user.service';
import { CloudinaryConfigService } from './../../config/cloudinary.config';
import { Repository } from 'typeorm';
import { AuthHelper } from '../auth/auth.helper';
import { User } from '../user/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { Attachment } from './entities/attachment.entity';
import { IMessage } from '@lib/dtos';
import { FakeChat } from '../fake/entities/fakeChat.entity';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { FallOutUsers } from '../user/entities/user.fallout.entity';
import { GlobalResponseDto } from '@lib/dtos/common';
export declare class ChatService {
    private readonly userRepository;
    private readonly chatRepository;
    private readonly fakeChatRepo;
    private readonly fallOutUsersRepo;
    private readonly attachmentRepository;
    private readonly mailService;
    private readonly configService;
    private readonly userService;
    private readonly helper;
    private readonly cloudinary;
    constructor(userRepository: Repository<User>, chatRepository: Repository<Chat>, fakeChatRepo: Repository<FakeChat>, fallOutUsersRepo: Repository<FallOutUsers>, attachmentRepository: Repository<Attachment>, mailService: MailService, configService: ConfigService, userService: UserService, helper: AuthHelper, cloudinary: CloudinaryConfigService);
    private notificationCount;
    createChat(data: IMessage, token?: string, senderUser?: User): Promise<Chat>;
    hasCustomerUserReplied(firstTwoMessages: IMessage[], customerUserId: string, fakeUserId: string): Promise<boolean>;
    checkFallOutUser(customerId: string, fakeId: string): Promise<FallOutUsers>;
    findUserById(id: string): Promise<User>;
    findAdmin(): Promise<User>;
    getMessages(senderId: string, receiverId: string, token?: string): Promise<{
        chats: Chat[];
        moderatorIds: number[];
    }>;
    getModsIds(sender: string, receiver: string): Promise<number[]>;
    getClientChatsUsers(token: string, userId: string): Promise<UserWithLatestChatDTO[]>;
    getChatUsers(token: string, userId: string): Promise<any>;
    isFakeMessage(senderId: string): Promise<boolean>;
    createFakeChat(data: IMessage, accessToken?: string): Promise<Chat | FakeChat>;
    createModeratorFakeUserReference(moderatorId: string, table: Chat): Promise<FakeChat>;
    detectFakeAndSendMail(sender: any, receiverId: any, message: any): Promise<void>;
    updateMessageSeen(receiver: string, sender: string): Promise<{
        userId: string;
        count: unknown;
    }[]>;
    getUnseenMessagesCount(receiverId: string): Promise<{
        userId: string;
        count: unknown;
    }[]>;
    addToFalloutTable(fakeUserId: string, customerUserId: string): Promise<void>;
    statsModGotRepliesFromUser(params?: GetModsStatsQueryParamsDto, token?: string): Promise<{
        Month: string;
        MessageReplies: any;
        mod: any;
    }>;
    statsModGotSentToUser(params: GetModsStatsQueryParamsDto, token?: string): Promise<{
        Month: string;
        SendMessages: any;
        mod: any;
    }>;
    getNewRandomModeratorDB(): Promise<User>;
    getLatestMessage(senderId: string, receiverId: string): Promise<Chat>;
    getModChatUsers(token?: string, userId?: string): Promise<{
        fakeChatPartners: any;
    }>;
    private getUserId;
    private getFakeChats;
    private getChattUsers;
    private getChatDetails;
    private getUnseenCount;
    private getLatestChatTime;
    isChatBlocked(modId: string, userId: string, fakeId: string): Promise<boolean>;
    blockModChat(token: string, { chatId, modId }: BlockChatDto): Promise<GlobalResponseDto>;
    unblockModChat(token: string, { chatId, modId }: BlockChatDto): Promise<GlobalResponseDto>;
}
export declare class UserWithLatestChatDTO {
    user: User;
    latestChatTime: Date;
}
