import { FakeService } from './../fake/fake.service';
import { UserService } from './../user/user.service';
import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthHelper } from '../auth/auth.helper';
import { IMessage, IUnseen } from '@lib/dtos';
import * as schedule from 'node-schedule';
import { VisitProfile } from '../user/entities/visit.profile.entity';
import { TransactionActionTypes, UserRoleEnum, UserStatusEnum } from '@lib/types';
import { User } from '../user/entities/user.entity';
import { clearConfigCache } from 'prettier';
@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: [`${process.env.FRONTEND_URL}`],
  },
})
@Injectable()
export class ChatsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @Inject(AuthHelper)
    private readonly helper: AuthHelper,
    @Inject(UserService)
    private readonly userService: UserService
  ) {}

  @WebSocketServer() server: Server;
  connectedClients = new Map<string, Socket>();
  moderatorSockets = new Map<string, Socket>();
  afterInit(server: any) {
    console.log('Initialized');
  }

  async handleConnection(socket: Socket, _: any) {
    try {
      const token = socket?.handshake?.query?.token ?? '';
      const decoded = await this.helper.decode(token as string);
      if (!decoded) throw new HttpException('Invalid token', HttpStatus.NOT_ACCEPTABLE);
      const user = await this.helper.validateUser(decoded);
      socket.data.user = user;
      socket.data.token = token;
      socket.data.connectionTime = Date.now();
      this.connectedClients.set(user?.id, socket);
      if (user?.role === UserRoleEnum.MODERATOR) {
        this.moderatorSockets.set(user?.id, socket);
        this.notifyModerators();
      }

      await this.userService.updateOnlineStatus(user?.id, true);
      this.attachEvents(socket);
    } catch (error) {
      socket.disconnect();
    }
  }
  async handleDisconnect(socket: Socket) {
    await this.updateUserStatusAndRemoveClient(socket);
    if (socket?.data?.user?.role === UserRoleEnum.MODERATOR) {
      this.moderatorSockets.delete(socket?.data?.user?.id);
    }
  }
  attachEvents(socket: Socket) {
    socket.on('ping', () => {
      socket.emit('pong');
    });

    socket.on('disconnect', async () => {
      await this.updateUserStatusAndRemoveClient(socket);
    });
  }
  async updateUserStatusAndRemoveClient(socket: Socket) {
    await this.userService.updateOnlineStatus(socket?.data?.user?.id, false);
    this.connectedClients.delete(socket?.data?.user?.id);
  }

  @SubscribeMessage('sendMessage')
  public async onSendMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: IMessage) {
    const coins = await this.userService.getActionTypeCostFromDB(TransactionActionTypes.SENDMESSAGE);
    const message = `You don't have enough credits ${coins} coins`;
    try {
      const { sender, receiver, moderator, moderatorIds } = data;
      const senderUser = await this.chatService.findUserById(sender);
      const receiverUser = await this.chatService.findUserById(receiver);
      let moderatorUser;
      const admin = await this.chatService.findAdmin();
      if (senderUser && receiverUser) {
        const receiverSocket = this.connectedClients.get(receiver);
        const senderSocket = this.connectedClients.get(sender);
        let modSocket = this.moderatorSockets.get(moderator);
        if (senderSocket || modSocket || receiverUser?.role === UserRoleEnum.FAKE) {
          const modIds = await this.getAvailableModerators();
          const latest: any = await this.chatService.getLatestMessage(sender, receiver);
          if (!latest) {
            if (modIds.length > 0) {
              const mod = await this.selectModRandomly(modIds);
              data.moderator = data.moderator ? data.moderator : mod;
            } else {
              moderatorUser = await this.chatService.getNewRandomModeratorDB();
              if (!moderatorUser) {
                data.moderator = admin.id;
              } else {
                data.moderator = moderatorUser.id;
              }
            }
          } else {
            data.moderator = latest?.chat?.moderatorId;
          }
          moderatorUser = await this.chatService.findUserById(data.moderator);

          if (moderatorUser.status === UserStatusEnum.BLOCK || moderatorUser.status === UserStatusEnum.INACTIVE) {
            moderatorUser = await this.chatService.getNewRandomModeratorDB();
            data.moderator = moderatorUser.id;
          }
          const res = await this.chatService.createChat(data, socket?.data?.token, senderUser);
          if (res) {
            if (modSocket || receiverUser?.role === UserRoleEnum.FAKE) {
              this.chatService.detectFakeAndSendMail(sender, receiver, data?.message);
              // Check if a moderator is involved and store a reference in the reference table

              if (moderatorUser) {
                await this.chatService.createModeratorFakeUserReference(data.moderator, res);
              }
              modSocket = this.moderatorSockets.get(data.moderator);
              if (modSocket && senderUser.role === UserRoleEnum.FAKE) modSocket?.emit('sendMessage', res);
            }

            senderSocket?.emit('sendMessage', res);
            if (receiverSocket) {
              const unseenMessages = await this.chatService.getUnseenMessagesCount(data.receiver);
              data.createdAt = new Date();
              receiverSocket?.emit('receiveMessage', data);
              receiverSocket.emit('getUnseenMessageCountNotification', unseenMessages);
            }
            if (modSocket && receiverUser.role === UserRoleEnum.FAKE) {
              const unseenMessages = await this.chatService.getUnseenMessagesCount(data.receiver);
              data.createdAt = new Date();

              modSocket?.emit('receiveMessage', data);
              modSocket.emit('getUnseenMessageCountNotification', unseenMessages);
            }
          } else {
            senderSocket?.emit('sendMessage', {
              successful: false,
              data: message,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      const { sender } = data;
      const senderUser = await this.chatService.findUserById(sender);

      if (senderUser) {
        const senderSocket = this.connectedClients.get(sender);
        senderSocket?.emit('sendMessage', {
          successful: false,
          data: message,
        });
      }
    }
  }

  @SubscribeMessage('logout')
  async handleStatus(@MessageBody() token: string) {
    const decoded = await this.helper.decode(token as string);
    if (decoded) {
      const user = await this.helper.validateUser(decoded);
      this.connectedClients.delete(user?.id);
      await this.userService.updateOnlineStatus(user?.id, false);
    }
  }

  @SubscribeMessage('acknowledge')
  async acknowledge(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const receiver = data[0]?.currentUser;
    const sender = data[1]?.currentSelectedUser;
    const moderator = data[2]?.currentModerator;
    const res = await this.chatService.updateMessageSeen(receiver, sender);
    if (res) {
      const receiverSocket = this.connectedClients.get(receiver);
      const modSocket = this.moderatorSockets.get(moderator);
      if (receiverSocket) {
        receiverSocket.emit('acknowledgementFromServer', res);
      }

      if (moderator && modSocket) {
        modSocket.emit('acknowledgementFromServer', res);
      }
    }
  }

  @SubscribeMessage('unseenMessageCount')
  async unseenMessageCount(@ConnectedSocket() client: Socket, @MessageBody() data: IUnseen) {
    const { userId, moderatorId } = data;
    if (this.connectedClients.has(userId)) {
      const unseenMessages = await this.chatService.getUnseenMessagesCount(userId);
      const receiverSocket = this.connectedClients.get(userId);
      const modSocket = this.moderatorSockets.get(moderatorId);
      receiverSocket
        ? receiverSocket.emit('getUnseenMessageCountNotification', unseenMessages)
        : modSocket.emit('getUnseenMessageCountNotification', unseenMessages);
    }
    if (this.moderatorSockets.has(moderatorId)) {
      const unseenMessages = await this.chatService.getUnseenMessagesCount(userId);
      const modSocket = this.moderatorSockets.get(moderatorId);
      modSocket.emit('getUnseenMessageCountNotification', unseenMessages);
    }
  }
  public async sendBulk(customerIds: string[], profileVisits: VisitProfile[]) {
    for (const customerId of customerIds) {
      const customerSocket = this.connectedClients.get(customerId);
      if (customerSocket) {
        const customerProfileVisits = profileVisits.filter((profileVisit) => profileVisit.visited.id === customerId);
        const visitorIds = [...new Set(customerProfileVisits.map((profileVisit) => profileVisit.visitor.id))];
        customerSocket.emit('receiveBulkVisits', visitorIds);
      }
    }
  }

  public notifyModerators() {
    const customerClients = Array.from(this.connectedClients.entries()).filter(
      ([_, socket]) => socket?.data?.user?.role === UserRoleEnum.CUSTOMER
    );
    const customerUsers = customerClients.map(([_, socket]) => socket?.data?.user);

    const sortedCustomerUsers = customerUsers.sort((a, b) => {
      const socketA = this.connectedClients.get(a.id);
      const socketB = this.connectedClients.get(b.id);

      return socketB?.data?.connectionTime - socketA?.data?.connectionTime;
    });
    for (const moderatorSocket of this.moderatorSockets.values()) {
      moderatorSocket.emit('availableUsersFromServer', sortedCustomerUsers);
    }
  }

  public async getAvailableModerators() {
    const modIds = [];
    for (const moderatorSocket of this.moderatorSockets.values()) {
      modIds.push(moderatorSocket?.data?.user?.id);
    }
    return modIds;
  }

  public async selectModRandomly(modIds) {
    return modIds[Math.floor(Math.random() * modIds.length)];
  }
}
