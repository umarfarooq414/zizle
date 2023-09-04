"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsGateway = void 0;
const user_service_1 = require("./../user/user.service");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const chat_entity_1 = require("./entities/chat.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_helper_1 = require("../auth/auth.helper");
const types_1 = require("../../../libs/types/src");
let ChatsGateway = class ChatsGateway {
    constructor(chatService, chatRepository, helper, userService) {
        this.chatService = chatService;
        this.chatRepository = chatRepository;
        this.helper = helper;
        this.userService = userService;
        this.connectedClients = new Map();
        this.moderatorSockets = new Map();
    }
    afterInit(server) {
        console.log('Initialized');
    }
    async handleConnection(socket, _) {
        var _a, _b, _c;
        try {
            const token = (_c = (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b.token) !== null && _c !== void 0 ? _c : '';
            const decoded = await this.helper.decode(token);
            if (!decoded)
                throw new common_1.HttpException('Invalid token', common_1.HttpStatus.NOT_ACCEPTABLE);
            const user = await this.helper.validateUser(decoded);
            socket.data.user = user;
            socket.data.token = token;
            socket.data.connectionTime = Date.now();
            this.connectedClients.set(user === null || user === void 0 ? void 0 : user.id, socket);
            if ((user === null || user === void 0 ? void 0 : user.role) === types_1.UserRoleEnum.MODERATOR) {
                this.moderatorSockets.set(user === null || user === void 0 ? void 0 : user.id, socket);
                this.notifyModerators();
            }
            await this.userService.updateOnlineStatus(user === null || user === void 0 ? void 0 : user.id, true);
            this.attachEvents(socket);
        }
        catch (error) {
            socket.disconnect();
        }
    }
    async handleDisconnect(socket) {
        var _a, _b, _c, _d;
        await this.updateUserStatusAndRemoveClient(socket);
        if (((_b = (_a = socket === null || socket === void 0 ? void 0 : socket.data) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.role) === types_1.UserRoleEnum.MODERATOR) {
            this.moderatorSockets.delete((_d = (_c = socket === null || socket === void 0 ? void 0 : socket.data) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id);
        }
    }
    attachEvents(socket) {
        socket.on('ping', () => {
            socket.emit('pong');
        });
        socket.on('disconnect', async () => {
            await this.updateUserStatusAndRemoveClient(socket);
        });
    }
    async updateUserStatusAndRemoveClient(socket) {
        var _a, _b, _c, _d;
        await this.userService.updateOnlineStatus((_b = (_a = socket === null || socket === void 0 ? void 0 : socket.data) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id, false);
        this.connectedClients.delete((_d = (_c = socket === null || socket === void 0 ? void 0 : socket.data) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id);
    }
    async onSendMessage(socket, data) {
        var _a, _b;
        const coins = await this.userService.getActionTypeCostFromDB(types_1.TransactionActionTypes.SENDMESSAGE);
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
                if (senderSocket || modSocket || (receiverUser === null || receiverUser === void 0 ? void 0 : receiverUser.role) === types_1.UserRoleEnum.FAKE) {
                    const modIds = await this.getAvailableModerators();
                    const latest = await this.chatService.getLatestMessage(sender, receiver);
                    if (!latest) {
                        if (modIds.length > 0) {
                            const mod = await this.selectModRandomly(modIds);
                            data.moderator = data.moderator ? data.moderator : mod;
                        }
                        else {
                            moderatorUser = await this.chatService.getNewRandomModeratorDB();
                            if (!moderatorUser) {
                                data.moderator = admin.id;
                            }
                            else {
                                data.moderator = moderatorUser.id;
                            }
                        }
                    }
                    else {
                        data.moderator = (_a = latest === null || latest === void 0 ? void 0 : latest.chat) === null || _a === void 0 ? void 0 : _a.moderatorId;
                    }
                    moderatorUser = await this.chatService.findUserById(data.moderator);
                    if (moderatorUser.status === types_1.UserStatusEnum.BLOCK || moderatorUser.status === types_1.UserStatusEnum.INACTIVE) {
                        moderatorUser = await this.chatService.getNewRandomModeratorDB();
                        data.moderator = moderatorUser.id;
                    }
                    const res = await this.chatService.createChat(data, (_b = socket === null || socket === void 0 ? void 0 : socket.data) === null || _b === void 0 ? void 0 : _b.token, senderUser);
                    if (res) {
                        if (modSocket || (receiverUser === null || receiverUser === void 0 ? void 0 : receiverUser.role) === types_1.UserRoleEnum.FAKE) {
                            this.chatService.detectFakeAndSendMail(sender, receiver, data === null || data === void 0 ? void 0 : data.message);
                            if (moderatorUser) {
                                await this.chatService.createModeratorFakeUserReference(data.moderator, res);
                            }
                            modSocket = this.moderatorSockets.get(data.moderator);
                            if (modSocket && senderUser.role === types_1.UserRoleEnum.FAKE)
                                modSocket === null || modSocket === void 0 ? void 0 : modSocket.emit('sendMessage', res);
                        }
                        senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.emit('sendMessage', res);
                        if (receiverSocket) {
                            const unseenMessages = await this.chatService.getUnseenMessagesCount(data.receiver);
                            data.createdAt = new Date();
                            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.emit('receiveMessage', data);
                            receiverSocket.emit('getUnseenMessageCountNotification', unseenMessages);
                        }
                        if (modSocket && receiverUser.role === types_1.UserRoleEnum.FAKE) {
                            const unseenMessages = await this.chatService.getUnseenMessagesCount(data.receiver);
                            data.createdAt = new Date();
                            modSocket === null || modSocket === void 0 ? void 0 : modSocket.emit('receiveMessage', data);
                            modSocket.emit('getUnseenMessageCountNotification', unseenMessages);
                        }
                    }
                    else {
                        senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.emit('sendMessage', {
                            successful: false,
                            data: message,
                        });
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
            const { sender } = data;
            const senderUser = await this.chatService.findUserById(sender);
            if (senderUser) {
                const senderSocket = this.connectedClients.get(sender);
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.emit('sendMessage', {
                    successful: false,
                    data: message,
                });
            }
        }
    }
    async handleStatus(token) {
        const decoded = await this.helper.decode(token);
        if (decoded) {
            const user = await this.helper.validateUser(decoded);
            this.connectedClients.delete(user === null || user === void 0 ? void 0 : user.id);
            await this.userService.updateOnlineStatus(user === null || user === void 0 ? void 0 : user.id, false);
        }
    }
    async acknowledge(client, data) {
        var _a, _b, _c;
        const receiver = (_a = data[0]) === null || _a === void 0 ? void 0 : _a.currentUser;
        const sender = (_b = data[1]) === null || _b === void 0 ? void 0 : _b.currentSelectedUser;
        const moderator = (_c = data[2]) === null || _c === void 0 ? void 0 : _c.currentModerator;
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
    async unseenMessageCount(client, data) {
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
    async sendBulk(customerIds, profileVisits) {
        for (const customerId of customerIds) {
            const customerSocket = this.connectedClients.get(customerId);
            if (customerSocket) {
                const customerProfileVisits = profileVisits.filter((profileVisit) => profileVisit.visited.id === customerId);
                const visitorIds = [...new Set(customerProfileVisits.map((profileVisit) => profileVisit.visitor.id))];
                customerSocket.emit('receiveBulkVisits', visitorIds);
            }
        }
    }
    notifyModerators() {
        const customerClients = Array.from(this.connectedClients.entries()).filter(([_, socket]) => { var _a, _b; return ((_b = (_a = socket === null || socket === void 0 ? void 0 : socket.data) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.role) === types_1.UserRoleEnum.CUSTOMER; });
        const customerUsers = customerClients.map(([_, socket]) => { var _a; return (_a = socket === null || socket === void 0 ? void 0 : socket.data) === null || _a === void 0 ? void 0 : _a.user; });
        const sortedCustomerUsers = customerUsers.sort((a, b) => {
            var _a, _b;
            const socketA = this.connectedClients.get(a.id);
            const socketB = this.connectedClients.get(b.id);
            return ((_a = socketB === null || socketB === void 0 ? void 0 : socketB.data) === null || _a === void 0 ? void 0 : _a.connectionTime) - ((_b = socketA === null || socketA === void 0 ? void 0 : socketA.data) === null || _b === void 0 ? void 0 : _b.connectionTime);
        });
        for (const moderatorSocket of this.moderatorSockets.values()) {
            moderatorSocket.emit('availableUsersFromServer', sortedCustomerUsers);
        }
    }
    async getAvailableModerators() {
        var _a, _b;
        const modIds = [];
        for (const moderatorSocket of this.moderatorSockets.values()) {
            modIds.push((_b = (_a = moderatorSocket === null || moderatorSocket === void 0 ? void 0 : moderatorSocket.data) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
        }
        return modIds;
    }
    async selectModRandomly(modIds) {
        return modIds[Math.floor(Math.random() * modIds.length)];
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "onSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('logout'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleStatus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('acknowledge'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "acknowledge", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unseenMessageCount'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "unseenMessageCount", null);
ChatsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        transports: ['websocket'],
        cors: {
            origin: [`${process.env.FRONTEND_URL}`],
        },
    }),
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __param(2, (0, common_1.Inject)(auth_helper_1.AuthHelper)),
    __param(3, (0, common_1.Inject)(user_service_1.UserService)),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        typeorm_2.Repository,
        auth_helper_1.AuthHelper,
        user_service_1.UserService])
], ChatsGateway);
exports.ChatsGateway = ChatsGateway;
//# sourceMappingURL=chat.gateway.js.map