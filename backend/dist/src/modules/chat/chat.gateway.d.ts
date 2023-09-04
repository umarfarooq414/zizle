import { UserService } from './../user/user.service';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { AuthHelper } from '../auth/auth.helper';
import { IMessage, IUnseen } from '@lib/dtos';
import { VisitProfile } from '../user/entities/visit.profile.entity';
export declare class ChatsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private chatRepository;
    private readonly helper;
    private readonly userService;
    constructor(chatService: ChatService, chatRepository: Repository<Chat>, helper: AuthHelper, userService: UserService);
    server: Server;
    connectedClients: Map<string, Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
    moderatorSockets: Map<string, Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
    afterInit(server: any): void;
    handleConnection(socket: Socket, _: any): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    attachEvents(socket: Socket): void;
    updateUserStatusAndRemoveClient(socket: Socket): Promise<void>;
    onSendMessage(socket: Socket, data: IMessage): Promise<void>;
    handleStatus(token: string): Promise<void>;
    acknowledge(client: Socket, data: any): Promise<void>;
    unseenMessageCount(client: Socket, data: IUnseen): Promise<void>;
    sendBulk(customerIds: string[], profileVisits: VisitProfile[]): Promise<void>;
    notifyModerators(): void;
    getAvailableModerators(): Promise<any[]>;
    selectModRandomly(modIds: any): Promise<any>;
}
