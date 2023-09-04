import { CreateBonusCodeDto } from './../../../libs/dtos/src/auth/bonusCode.dto';
import { UpdateModDto } from './../../../libs/dtos/src/auth/updateMod.dto';
import { CreateModDto } from './../../../libs/dtos/src/auth/createMod.dto';
import { GetModsStatsQueryParamsDto } from './../../../libs/dtos/src/auth/mod.stats.dto';
import { EntityManager } from 'typeorm';
import { CustomerProfileData } from '../user/entities/customer.profiledata.entity';
import { type AdminModRegisterRequestDto, AuthorizeResponseDto, type LoginRequestDto, type UserRegisterRequestDto, ResetPasswordRequestDto, SocialLoginRequestDto, ScheduleMessageDto, SpamMessagesDto, UpdateQueryStatusDto } from '@lib/dtos';
import { User } from '../user/entities/user.entity';
import { type UpdateAccessDto } from '@lib/dtos/auth/updateAccess';
import { GlobalResponseDto } from '@lib/dtos/common';
import { type UpdateStatusDto } from '@lib/dtos/auth/updateStatus';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryConfigService } from '@config/cloudinary.config';
import { Chat } from '../chat/entities/chat.entity';
import { BonusCode } from './entities/bonusCode.entity';
import { ScheduleMessage } from './entities/scheduleMessage.entity';
import { ContactSupport } from '../user/entities/contactSupport.entity';
export declare class AuthService {
    private readonly entity;
    private cloudinary;
    private readonly repository;
    private readonly contactSupportRepo;
    private readonly emailRepo;
    private readonly profile;
    private readonly tokenRepository;
    private readonly chatRepo;
    private readonly fakeChat;
    private readonly scheduleMessageRepo;
    private readonly attachmentRepository;
    private readonly bonusRepo;
    private readonly paymentsRepo;
    private readonly helper;
    private readonly mailService;
    private readonly userService;
    private readonly chatService;
    private readonly configService;
    private readonly facebookClient;
    private readonly googleClient;
    private readonly jwt;
    constructor(jwt: JwtService, entity: EntityManager, cloudinary: CloudinaryConfigService);
    registerUser(body: UserRegisterRequestDto): Promise<User | never>;
    socialLogin(body: SocialLoginRequestDto): Promise<AuthorizeResponseDto | User>;
    registerAdminMod(body: AdminModRegisterRequestDto): Promise<User | never>;
    login(body: LoginRequestDto): Promise<AuthorizeResponseDto | never>;
    updateUserAccess(updateAccessDto: UpdateAccessDto): Promise<GlobalResponseDto>;
    updateUserStatus(updateStatusDto: UpdateStatusDto): Promise<GlobalResponseDto>;
    updateModeratorStatus(updateStatusDto: UpdateStatusDto): Promise<GlobalResponseDto>;
    getAllUsers(): Promise<User[]>;
    getUserByMail(email: string): Promise<User>;
    getUserByVerificationToken(token: string): Promise<User>;
    verifyEmail(token: string, res: any): Promise<any>;
    verifyProfile(id: string): Promise<CustomerProfileData>;
    forget(email: string): Promise<GlobalResponseDto>;
    resetPassword(token: string, { newPassword }: ResetPasswordRequestDto): Promise<GlobalResponseDto>;
    onlineUsers(token: string): Promise<{
        moderators: User[];
        customers: User[];
    }>;
    saveEmojis(token: string, file: any): Promise<void>;
    getEmojis(token: string): Promise<any>;
    getUserStats(token: string): Promise<{
        mod: User;
        repliesFromUser: {
            Month: string;
            MessageReplies: any;
            mod: any;
        };
        sentToUser: {
            Month: string;
            SendMessages: any;
            mod: any;
        };
    }[]>;
    getMods(token: string): Promise<User[]>;
    getModSendMessageStats(token: string, params?: GetModsStatsQueryParamsDto): Promise<{
        Month: string;
        SendMessages: any;
        mod: any;
    }[]>;
    createBulkMessages(token: any, fakeUserId: string, customerUserIds: string, message: string, file: any): Promise<Chat[]>;
    createMod(token: string, modDto: CreateModDto): Promise<User>;
    getMod(token: string, id: string): Promise<User>;
    deleteModById(token: string, id: string): Promise<GlobalResponseDto>;
    updateModById(token: string, id: string, body: UpdateModDto): Promise<User>;
    createBonusCode(token: string, bonusCodeDto: CreateBonusCodeDto): Promise<BonusCode>;
    updateBonusCode(token: string, id: string, expiryDate: Date): Promise<BonusCode>;
    getAllBonusCodes(token: string): Promise<BonusCode[]>;
    deleteBonusCodeById(token: string, id: string): Promise<GlobalResponseDto>;
    scheduleMessage(token: string, body: ScheduleMessageDto): Promise<ScheduleMessage>;
    getScheduledMessage(token?: string): Promise<ScheduleMessage[]>;
    deleteScheduledMessage(token: string, id: string): Promise<GlobalResponseDto>;
    sendSpamMessages(token: string, body: SpamMessagesDto, file: any): Promise<GlobalResponseDto>;
    scheduleStarterMessage(): void;
    detectAndReturnNewUser(): Promise<User[]>;
    getAdminUserIds(): Promise<string[]>;
    sendMessageToUsers(): Promise<void>;
    sendMessage(receiver: User, message: string, sender: User): Promise<void>;
    getStats(token: string): Promise<{
        onlineMods: User[];
        onlineUsers: User[];
        newVerifiedUsers: User[];
        emailsSentToday: number;
        sales: {
            today: number;
            yesterday: number;
            percentageChange: string;
            currentMonth: number;
            lastMonth: number;
        };
        MessageStats: {
            mod: User;
            repliesFromUser: {
                Month: string;
                MessageReplies: any;
                mod: any;
            };
            sentToUser: {
                Month: string;
                SendMessages: any;
                mod: any;
            };
        }[];
        openMessages: number;
    }>;
    newVerifiedCustomers(): Promise<User[]>;
    emailsSentToday(): Promise<number>;
    getSales(): Promise<{
        today: number;
        yesterday: number;
        percentageChange: number;
        currentMonth: number;
        lastMonth: number;
    }>;
    getQueries(token: string): Promise<ContactSupport[]>;
    getSpecifiCustomerQueries(token: string): Promise<ContactSupport[]>;
    updateQueryStatus(token: string, body: UpdateQueryStatusDto): Promise<ContactSupport>;
    cleanQueries(): Promise<void>;
    getOpenMessages(): Promise<number>;
}
