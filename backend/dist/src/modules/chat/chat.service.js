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
exports.UserWithLatestChatDTO = exports.ChatService = void 0;
const date_fns_1 = require("date-fns");
const user_service_1 = require("./../user/user.service");
const cloudinary_config_1 = require("./../../config/cloudinary.config");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_helper_1 = require("../auth/auth.helper");
const user_entity_1 = require("../user/entities/user.entity");
const chat_entity_1 = require("./entities/chat.entity");
const attachment_entity_1 = require("./entities/attachment.entity");
const types_1 = require("../../../libs/types/src");
const fakeChat_entity_1 = require("../fake/entities/fakeChat.entity");
const mail_service_1 = require("../mail/mail.service");
const config_1 = require("@nestjs/config");
const user_fallout_entity_1 = require("../user/entities/user.fallout.entity");
const common_2 = require("../../../libs/dtos/src/common");
let ChatService = class ChatService {
    constructor(userRepository, chatRepository, fakeChatRepo, fallOutUsersRepo, attachmentRepository, mailService, configService, userService, helper, cloudinary) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.fakeChatRepo = fakeChatRepo;
        this.fallOutUsersRepo = fallOutUsersRepo;
        this.attachmentRepository = attachmentRepository;
        this.mailService = mailService;
        this.configService = configService;
        this.userService = userService;
        this.helper = helper;
        this.cloudinary = cloudinary;
        this.notificationCount = {};
    }
    async createChat(data, token, senderUser) {
        var _a, _b;
        const sender = await this.findUserById(data.sender);
        let transaction;
        if ((sender === null || sender === void 0 ? void 0 : sender.role) === types_1.UserRoleEnum.CUSTOMER && typeof (data === null || data === void 0 ? void 0 : data.attachments) !== 'string') {
            transaction = await this.userService.makeTransaction(token, types_1.TransactionActionTypes.SENDMESSAGE);
        }
        if (transaction || senderUser.role === types_1.UserRoleEnum.FAKE || typeof (data === null || data === void 0 ? void 0 : data.attachments) === 'string') {
            if (senderUser.role === types_1.UserRoleEnum.FAKE) {
                const fallOut = await this.checkFallOutUser(data === null || data === void 0 ? void 0 : data.receiver, data === null || data === void 0 ? void 0 : data.sender);
                if (!fallOut) {
                    const firstTwoMessages = await this.chatRepository.find({
                        where: { sender: data === null || data === void 0 ? void 0 : data.sender, receiver: data === null || data === void 0 ? void 0 : data.receiver },
                        order: { createdAt: 'ASC' },
                        take: 2,
                    });
                    const customerUserHasReplied = await this.hasCustomerUserReplied(firstTwoMessages, data === null || data === void 0 ? void 0 : data.receiver, data === null || data === void 0 ? void 0 : data.sender);
                    if (!customerUserHasReplied && (firstTwoMessages === null || firstTwoMessages === void 0 ? void 0 : firstTwoMessages.length) >= 2) {
                        await this.addToFalloutTable(data === null || data === void 0 ? void 0 : data.sender, data === null || data === void 0 ? void 0 : data.receiver);
                    }
                }
                else {
                }
            }
            const obj = {
                sender: data.sender,
                receiver: data.receiver,
                message: data.message,
                seen: data.seen,
            };
            const savedChat = await this.chatRepository.save(obj);
            if (savedChat) {
                if (data === null || data === void 0 ? void 0 : data.attachments) {
                    let attachmentEntity;
                    if (typeof (data === null || data === void 0 ? void 0 : data.attachments) === 'string') {
                        attachmentEntity = new attachment_entity_1.Attachment();
                        attachmentEntity.fileUrl = data === null || data === void 0 ? void 0 : data.attachments;
                    }
                    else {
                        const res = await this.cloudinary.uploadFile(data.attachments['0'], 'chat');
                        attachmentEntity = new attachment_entity_1.Attachment();
                        attachmentEntity.fileUrl = res === null || res === void 0 ? void 0 : res.url;
                        attachmentEntity.fileName = (_a = data.attachments) === null || _a === void 0 ? void 0 : _a.originalname;
                        attachmentEntity.fileType = (_b = data.attachments) === null || _b === void 0 ? void 0 : _b.mimetype;
                    }
                    attachmentEntity.chat = savedChat;
                    await this.attachmentRepository.save(attachmentEntity);
                    const attachment = await this.chatRepository.findOne({
                        where: {
                            id: savedChat.id,
                        },
                        relations: ['attachments'],
                    });
                    return attachment;
                }
                return savedChat;
            }
            else {
                throw new common_1.HttpException('Something went wrong', common_1.HttpStatus.BAD_GATEWAY);
            }
        }
        else {
            throw new common_1.HttpException('Payment Failed', common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async hasCustomerUserReplied(firstTwoMessages, customerUserId, fakeUserId) {
        const customerUserMessages = await this.chatRepository.count({
            where: { sender: customerUserId, receiver: fakeUserId },
        });
        return customerUserMessages >= firstTwoMessages.length;
    }
    async checkFallOutUser(customerId, fakeId) {
        return await this.fallOutUsersRepo.findOne({
            where: {
                fake: { id: fakeId },
                user: { id: customerId },
            },
            relations: ['fake'],
        });
    }
    async findUserById(id) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.HttpException('user not found!', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            return user;
        }
    }
    async findAdmin() {
        const user = await this.userRepository.findOneBy({ role: types_1.UserRoleEnum.ADMIN });
        if (!user) {
            throw new common_1.HttpException('user not found!', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            return user;
        }
    }
    async getMessages(senderId, receiverId, token) {
        if (token) {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = await this.helper.validateUser(decoded);
            if (!user)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
        const sender = await this.userRepository.findOneBy({ id: senderId });
        const receiver = await this.userRepository.findOneBy({ id: receiverId });
        if (!sender || !receiver)
            throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
        const query = this.chatRepository
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.attachments', 'attachment')
            .leftJoinAndSelect('chat.chat', 'fakeChat')
            .where(new typeorm_2.Brackets((qb) => {
            qb.where('(chat.sender = :senderId AND chat.receiver = :receiverId) OR (chat.sender = :receiverId AND chat.receiver = :senderId)', { senderId, receiverId });
        }))
            .andWhere('chat.id IN (SELECT c2.id FROM chat c2 WHERE c2.sender = :senderId OR c2.receiver = :senderId ORDER BY c2.createdAt DESC)', { senderId })
            .select('chat')
            .addSelect('attachment')
            .addSelect('fakeChat.moderatorId');
        const chats = await query.getMany();
        const moderatorIdsSet = new Set(chats.map((chat) => { var _a; return (_a = chat === null || chat === void 0 ? void 0 : chat.chat) === null || _a === void 0 ? void 0 : _a.moderatorId; }).filter(Boolean));
        const moderatorIds = Array.from(moderatorIdsSet);
        return { chats, moderatorIds };
    }
    async getModsIds(sender, receiver) {
        const { moderatorIds } = await this.getMessages(sender, receiver);
        return moderatorIds;
    }
    async getClientChatsUsers(token, userId) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const verified = await this.helper.validateUser(decoded);
        if (!verified)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        const user = await this.findUserById(userId);
        if (!user)
            throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
        const users = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .where('user.id IN (SELECT chat.sender FROM chat WHERE chat.receiver = :userId)', { userId })
            .orWhere('user.id IN (SELECT chat.receiver FROM chat WHERE chat.sender = :userId)', { userId })
            .andWhere('user.id != :userId', { userId })
            .distinct(true)
            .getMany();
        const usersWithLatestChat = [];
        for (const user of users) {
            const latestChat = await this.chatRepository
                .createQueryBuilder('chat')
                .where('(chat.sender = :userId AND chat.receiver = :user.id) OR (chat.receiver = :userId AND chat.sender = :user.id)', { userId, 'user.id': user.id })
                .orderBy('chat.createdAt', 'DESC')
                .getOne();
            const userWithLatestChat = new UserWithLatestChatDTO();
            userWithLatestChat.user = user;
            if (latestChat) {
                userWithLatestChat.latestChatTime = latestChat.createdAt;
            }
            else {
                userWithLatestChat.latestChatTime = null;
            }
            usersWithLatestChat.push(userWithLatestChat);
        }
        return usersWithLatestChat;
    }
    async getChatUsers(token, userId) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const verified = await this.helper.validateUser(decoded);
        if (!verified)
            throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        const user = await this.findUserById(userId);
        if (!user)
            throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
        const users = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .innerJoin('chat', 'c', '(user.id = c.sender AND c.receiver = :userId) OR (user.id = c.receiver AND c.sender = :userId)', { userId })
            .andWhere('user.id != :userId')
            .distinct(true)
            .getMany();
        const chatIds = users.map((user) => user.id);
        const subQuery = this.chatRepository
            .createQueryBuilder('chatSub')
            .select('LEAST(chatSub.sender, chatSub.receiver)', 'interlocutor1')
            .addSelect('GREATEST(chatSub.sender, chatSub.receiver)', 'interlocutor2')
            .addSelect('MAX(chatSub.createdAt)', 'maxTimestamp')
            .where('chatSub.sender IN (:userId, :...chatIds) AND chatSub.receiver IN (:userId, :...chatIds)', {
            userId,
            chatIds,
        })
            .groupBy('interlocutor1, interlocutor2');
        const chats = await this.chatRepository
            .createQueryBuilder('chat')
            .innerJoin(`(${subQuery.getQuery()})`, 'sub', 'LEAST(chat.sender, chat.receiver) = sub.interlocutor1 AND GREATEST(chat.sender, chat.receiver) = sub.interlocutor2 AND chat.createdAt = sub.maxTimestamp')
            .setParameters(subQuery.getParameters())
            .orderBy('chat.createdAt', 'DESC')
            .distinct(true)
            .getMany();
        users.forEach((user) => {
            const userChat = chats.find((chat) => chat.sender === user.id || chat.receiver === user.id);
            if (userChat) {
                user.lastMessage = userChat === null || userChat === void 0 ? void 0 : userChat.message;
            }
        });
        const unseenMessageCounts = await this.getUnseenMessagesCount(userId);
        const usersWithNotificationCount = users.map((user) => {
            const userWithNotificationCount = Object.assign(Object.assign({}, user), { notificationCount: 0 });
            const notificationEntry = unseenMessageCounts.find((entry) => entry.userId === user.id);
            if (notificationEntry) {
                userWithNotificationCount.notificationCount = notificationEntry.count;
            }
            return userWithNotificationCount;
        });
        return usersWithNotificationCount;
    }
    async isFakeMessage(senderId) {
        const sender = await this.findUserById(senderId);
        return sender.role === types_1.UserRoleEnum.FAKE;
    }
    async createFakeChat(data, accessToken) {
        if (accessToken) {
            const tokenValue = accessToken.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user) {
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            }
            if (user.role === types_1.UserRoleEnum.MODERATOR &&
                (user.status === types_1.UserStatusEnum.BLOCK ||
                    user.status === types_1.UserStatusEnum.INACTIVE ||
                    user.status === types_1.UserStatusEnum.UNVERIFIED)) {
                throw new common_1.HttpException('User not allowed!', common_1.HttpStatus.NOT_FOUND);
            }
            if (user.role !== types_1.UserRoleEnum.MODERATOR)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            const savedChat = await this.createChat(data);
            if (!savedChat)
                throw new common_1.HttpException('Chat not saved!', common_1.HttpStatus.BAD_GATEWAY);
            return await this.createModeratorFakeUserReference(user === null || user === void 0 ? void 0 : user.id, savedChat);
        }
        else {
            const savedChat = await this.createChat(data);
            if (!savedChat)
                throw new common_1.HttpException('Chat not saved!', common_1.HttpStatus.BAD_GATEWAY);
            return savedChat;
        }
    }
    async createModeratorFakeUserReference(moderatorId, table) {
        const user = await this.findUserById(moderatorId);
        if (!user) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.role === types_1.UserRoleEnum.MODERATOR &&
            (user.status === types_1.UserStatusEnum.BLOCK ||
                user.status === types_1.UserStatusEnum.INACTIVE ||
                user.status === types_1.UserStatusEnum.UNVERIFIED)) {
            throw new common_1.HttpException('User not allowed!', common_1.HttpStatus.NOT_FOUND);
        }
        const modTrack = new fakeChat_entity_1.FakeChat();
        modTrack.moderatorId = moderatorId;
        modTrack.chat = table;
        modTrack.type = user.role;
        return await this.fakeChatRepo.save(modTrack);
    }
    async detectFakeAndSendMail(sender, receiverId, message) {
        const user = await this.findUserById(sender);
        message = typeof message === 'string' ? (message === null || message === void 0 ? void 0 : message.substring(0, 10)) + '*****' : null;
        const receiver = await this.findUserById(receiverId);
        if (!user) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const yes = await this.isFakeMessage(sender);
        const subject = 'You received a message from *****';
        if (yes) {
            const online = await this.userService.checkOnlineStatus(sender);
            if (online === false) {
                await this.userService.updateOnlineStatus(sender, true);
            }
            const { frontendUrlClient } = this.configService.get(types_1.ConfigEnum.SERVER);
            this.mailService.sendFakeMessageMail(subject, {
                firstName: user === null || user === void 0 ? void 0 : user.userName,
                message: message,
                email: user === null || user === void 0 ? void 0 : user.email,
                authLoginLink: frontendUrlClient,
            }, receiver === null || receiver === void 0 ? void 0 : receiver.email);
        }
    }
    async updateMessageSeen(receiver, sender) {
        await this.chatRepository.update({ receiver, seen: false, sender }, { seen: true });
        return await this.getUnseenMessagesCount(receiver);
    }
    async getUnseenMessagesCount(receiverId) {
        const unseenChats = await this.chatRepository.findBy({
            receiver: receiverId,
            seen: false,
        });
        const newNotifications = {};
        unseenChats.forEach((chat) => {
            const senderId = chat.sender;
            if (!this.notificationCount[senderId]) {
                this.notificationCount[senderId] = 0;
            }
            if (!newNotifications[senderId]) {
                newNotifications[senderId] = 0;
            }
            if (!chat.seen) {
                newNotifications[senderId]++;
            }
        });
        const notification = {};
        Object.entries(newNotifications).forEach(([userId, count]) => {
            notification[userId] = count;
        });
        const notificationCounts = Object.entries(notification).map(([userId, count]) => ({ userId, count }));
        return notificationCounts;
    }
    async addToFalloutTable(fakeUserId, customerUserId) {
        const fakeUser = await this.findUserById(fakeUserId);
        const customerUser = await this.findUserById(customerUserId);
        if (!fakeUser)
            throw new common_1.HttpException('Fake not allowed!', common_1.HttpStatus.NOT_FOUND);
        if (!customerUser)
            throw new common_1.HttpException('User not allowed!', common_1.HttpStatus.NOT_FOUND);
        const fallOutUser = new user_fallout_entity_1.FallOutUsers();
        fallOutUser.fake = fakeUser;
        fallOutUser.user = customerUser;
        await this.fallOutUsersRepo.save(fallOutUser);
    }
    async statsModGotRepliesFromUser(params, token) {
        var _a;
        try {
            let mod;
            if (token) {
                const tokenValue = token.split(' ')[1];
                const decoded = await this.helper.decode(tokenValue);
                mod = await this.helper.validateUser(decoded);
                if (!mod)
                    throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            }
            else {
                mod = params.mod;
            }
            const { startDate, endDate, duration } = params;
            let query = this.fakeChatRepo
                .createQueryBuilder('fakeChat')
                .leftJoinAndSelect('fakeChat.chat', 'chat')
                .where('fakeChat.moderatorId = :modId', { modId: mod.id });
            if (startDate && endDate) {
                query = query.andWhere('chat.createdAt BETWEEN :startDate AND :endDate', {
                    startDate: (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(startDate)),
                    endDate: (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(endDate)),
                });
            }
            query = query
                .andWhere('chat.sender IN (SELECT id FROM user WHERE role = :customerRole)')
                .andWhere('chat.receiver IN (SELECT id FROM user WHERE role = :fakeRole)')
                .setParameter('customerRole', types_1.UserRoleEnum.CUSTOMER)
                .setParameter('fakeRole', types_1.UserRoleEnum.FAKE);
            let groupColumn;
            if (duration === 'monthly') {
                groupColumn = 'DATE_FORMAT(chat.createdAt, "%Y-%m")';
            }
            else if (duration === 'weekly') {
                groupColumn = 'DATE_FORMAT(chat.createdAt, "%x-%v")';
            }
            else {
                groupColumn = 'DATE(chat.createdAt)';
            }
            query = query
                .select(['COUNT(Distinct chat.sender) as Users', 'COUNT(Distinct chat.id) as MessageReplies', groupColumn])
                .groupBy(groupColumn);
            const result = await query.getRawMany();
            const groupedData = {
                Month: (0, date_fns_1.format)(new Date(), 'MMMM'),
                MessageReplies: (_a = result[0]) === null || _a === void 0 ? void 0 : _a.Users,
                mod,
            };
            query = query.select(['COUNT(chat.id) as SendMessages', groupColumn]).groupBy(groupColumn);
            const res = await query.getRawMany();
            const statsMods = Object.assign({}, groupedData);
            return statsMods;
        }
        catch (error) {
            throw new common_1.HttpException('Could not get replies from user', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async statsModGotSentToUser(params, token) {
        var _a;
        try {
            let mod;
            if (token) {
                const tokenValue = token.split(' ')[1];
                const decoded = await this.helper.decode(tokenValue);
                mod = await this.helper.validateUser(decoded);
                if (!mod)
                    throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            }
            else {
                mod = params.mod;
            }
            const { startDate, endDate, duration } = params;
            let query = this.fakeChatRepo
                .createQueryBuilder('fakeChat')
                .leftJoinAndSelect('fakeChat.chat', 'chat')
                .where('fakeChat.moderatorId = :modId', { modId: mod.id });
            if (startDate && endDate) {
                query = query.andWhere('chat.createdAt BETWEEN :startDate AND :endDate', {
                    startDate: (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(startDate)),
                    endDate: (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(endDate)),
                });
            }
            query = query
                .andWhere('chat.sender IN (SELECT id FROM user WHERE role = :fakeRole)')
                .andWhere('chat.receiver IN (SELECT id FROM user WHERE role = :customerRole)')
                .setParameter('fakeRole', types_1.UserRoleEnum.FAKE)
                .setParameter('customerRole', types_1.UserRoleEnum.CUSTOMER);
            let groupColumn;
            if (duration === 'monthly') {
                groupColumn = 'DATE_FORMAT(chat.createdAt, "%Y-%m")';
            }
            else if (duration === 'weekly') {
                groupColumn = 'DATE_FORMAT(chat.createdAt, "%x-%v")';
            }
            else {
                groupColumn = 'DATE(chat.createdAt)';
            }
            query = query.select(['COUNT(chat.id) as SendMessages']);
            const result = await query.getRawMany();
            const groupedData = {
                Month: (0, date_fns_1.format)(new Date(), 'MMMM'),
                SendMessages: (_a = result[0]) === null || _a === void 0 ? void 0 : _a.SendMessages,
                mod,
            };
            return groupedData;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async getNewRandomModeratorDB() {
        return await this.userRepository
            .createQueryBuilder('user')
            .where('user.role = :role', {
            role: types_1.UserRoleEnum.MODERATOR,
        })
            .andWhere('user.status = :status', { status: types_1.UserStatusEnum.ACTIVE })
            .orderBy('RAND()')
            .limit(1)
            .getOne();
    }
    async getLatestMessage(senderId, receiverId) {
        const chat = await this.chatRepository
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.attachments', 'attachment')
            .leftJoinAndSelect('chat.chat', 'fakeChat')
            .where(new typeorm_2.Brackets((qb) => {
            qb.where('(chat.sender = :senderId AND chat.receiver = :receiverId)', { senderId, receiverId });
        }))
            .andWhere('chat.id IN (SELECT c2.id FROM chat c2 WHERE c2.sender = :senderId ORDER BY c2.createdAt DESC)', {
            senderId,
        })
            .andWhere('fakeChat.type = :type', { type: types_1.UserRoleEnum.MODERATOR })
            .select('chat')
            .addSelect('attachment')
            .addSelect('fakeChat.moderatorId')
            .orderBy('chat.createdAt', 'DESC')
            .limit(1)
            .getOne();
        return chat;
    }
    async getModChatUsers(token, userId) {
        const id = await this.getUserId(token, userId);
        const fakeChats = await this.getFakeChats(id);
        const chatMap = new Map();
        await Promise.all(fakeChats.map(async (fakeChat) => {
            const [senderId, receiverId] = this.getChattUsers(fakeChat);
            const chatDetails = await this.getChatDetails(id, senderId, receiverId);
            chatMap.set(chatDetails.key, chatDetails.value);
        }));
        const fakeChatPartners = Array.from(chatMap.values());
        return { fakeChatPartners };
    }
    async getUserId(token, userId) {
        if (token) {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const verified = await this.helper.validateUser(decoded);
            if (!verified)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            return verified.role === types_1.UserRoleEnum.MODERATOR ? verified === null || verified === void 0 ? void 0 : verified.id : userId;
        }
        else {
            return userId;
        }
    }
    async getFakeChats(id) {
        return this.fakeChatRepo
            .createQueryBuilder('fakeChat')
            .leftJoinAndSelect('fakeChat.chat', 'chat')
            .select('fakeChat')
            .where('fakeChat.moderatorId = :modId', { modId: id })
            .andWhere('fakeChat.type = :type', { type: types_1.UserRoleEnum.MODERATOR })
            .addSelect('chat')
            .getMany();
    }
    getChattUsers(fakeChat) {
        var _a, _b;
        return [(_a = fakeChat === null || fakeChat === void 0 ? void 0 : fakeChat.chat) === null || _a === void 0 ? void 0 : _a.sender, (_b = fakeChat === null || fakeChat === void 0 ? void 0 : fakeChat.chat) === null || _b === void 0 ? void 0 : _b.receiver];
    }
    async getChatDetails(id, senderId, receiverId) {
        var _a, _b;
        const [user1, user2] = await Promise.all([this.findUserById(senderId), this.findUserById(receiverId)]);
        let sender, receiver;
        if (user1.role === types_1.UserRoleEnum.FAKE && user2.role === types_1.UserRoleEnum.CUSTOMER) {
            sender = user1;
            receiver = user2;
        }
        else if (user2.role === types_1.UserRoleEnum.FAKE && user1.role === types_1.UserRoleEnum.CUSTOMER) {
            sender = user2;
            receiver = user1;
        }
        else {
        }
        const key = [sender.id, receiver.id].sort().join(',');
        const isBlocked = await this.isChatBlocked(id, receiver.id, sender.id);
        const unseenCount = await this.getUnseenCount(sender.id, receiver.id);
        const latestChatTime = await this.getLatestChatTime(sender.id, receiver.id);
        return {
            key,
            value: {
                sender: {
                    id: sender.id,
                    name: sender === null || sender === void 0 ? void 0 : sender.userName,
                    sender,
                    avatar: (_a = sender === null || sender === void 0 ? void 0 : sender.profile) === null || _a === void 0 ? void 0 : _a.avatarUrl,
                },
                receiver: {
                    id: receiver.id,
                    receiver,
                    name: receiver === null || receiver === void 0 ? void 0 : receiver.userName,
                    avatar: (_b = receiver === null || receiver === void 0 ? void 0 : receiver.profile) === null || _b === void 0 ? void 0 : _b.avatarUrl,
                },
                unseenCount,
                blocked: isBlocked,
                latestChatTime,
            },
        };
    }
    async getUnseenCount(receiverId, senderId) {
        return this.chatRepository
            .createQueryBuilder('chat')
            .where(new typeorm_2.Brackets((qb) => {
            qb.where('(chat.sender = :senderId AND chat.receiver = :receiverId)', {
                senderId: senderId,
                receiverId: receiverId,
            });
        }))
            .andWhere('chat.seen = :seen', { seen: false })
            .getCount();
    }
    async getLatestChatTime(senderId, receiverId) {
        const latestChat = await this.chatRepository
            .createQueryBuilder('chat')
            .where('(chat.sender = :senderId AND chat.receiver = :receiverId) OR (chat.sender = :receiverId AND chat.receiver = :senderId)', {
            senderId: senderId,
            receiverId: receiverId,
        })
            .orderBy('chat.createdAt', 'DESC')
            .getOne();
        return latestChat ? latestChat.createdAt : null;
    }
    async isChatBlocked(modId, userId, fakeId) {
        const queryBuilder = this.chatRepository
            .createQueryBuilder('chat')
            .select('1')
            .innerJoin('chat.chat', 'fake_chat')
            .where(new typeorm_2.Brackets((qb) => {
            qb.where('(chat.sender = :userId AND chat.receiver = :fakeId) OR (chat.sender = :fakeId AND chat.receiver = :userId)', { userId, fakeId });
        }))
            .andWhere('fake_chat.blocked = true')
            .andWhere('fake_chat.type = :type', { type: types_1.UserRoleEnum.MODERATOR })
            .andWhere('fake_chat.moderatorId = :moderatorId', { moderatorId: modId })
            .limit(1);
        const result = await queryBuilder.getRawOne();
        return result ? true : false;
    }
    async blockModChat(token, { chatId, modId }) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const verified = await this.helper.validateUser(decoded);
            if (!verified)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            if (verified.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('user must be admin', common_1.HttpStatus.UNAUTHORIZED);
            const chat = await this.chatRepository.findOne({
                where: {
                    id: chatId,
                },
                relations: ['chat'],
            });
            if (!chat)
                throw new common_1.HttpException('chat not found', common_1.HttpStatus.NOT_FOUND);
            const fakeChat = chat.chat;
            if (fakeChat.moderatorId === modId && fakeChat.type === types_1.UserRoleEnum.MODERATOR) {
                fakeChat.blocked = true;
                await this.fakeChatRepo.save(fakeChat);
                await this.chatRepository.save(chat);
            }
            return new common_2.GlobalResponseDto('chat blocked successfully');
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async unblockModChat(token, { chatId, modId }) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const verified = await this.helper.validateUser(decoded);
            if (!verified)
                throw new common_1.HttpException('USER NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            if (verified.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('user must be admin', common_1.HttpStatus.UNAUTHORIZED);
            const chat = await this.chatRepository.findOne({
                where: {
                    id: chatId,
                },
                relations: ['chat'],
            });
            if (!chat)
                throw new common_1.HttpException('chat not found', common_1.HttpStatus.NOT_FOUND);
            const fakeChat = chat.chat;
            if (fakeChat.moderatorId === modId && fakeChat.type === types_1.UserRoleEnum.MODERATOR) {
                fakeChat.blocked = false;
                await this.fakeChatRepo.save(fakeChat);
                await this.chatRepository.save(chat);
            }
            return new common_2.GlobalResponseDto('chat blocked successfully');
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __param(2, (0, typeorm_1.InjectRepository)(fakeChat_entity_1.FakeChat)),
    __param(3, (0, typeorm_1.InjectRepository)(user_fallout_entity_1.FallOutUsers)),
    __param(4, (0, typeorm_1.InjectRepository)(attachment_entity_1.Attachment)),
    __param(5, (0, common_1.Inject)(mail_service_1.MailService)),
    __param(6, (0, common_1.Inject)(config_1.ConfigService)),
    __param(7, (0, common_1.Inject)(user_service_1.UserService)),
    __param(8, (0, common_1.Inject)(auth_helper_1.AuthHelper)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        mail_service_1.MailService,
        config_1.ConfigService,
        user_service_1.UserService,
        auth_helper_1.AuthHelper,
        cloudinary_config_1.CloudinaryConfigService])
], ChatService);
exports.ChatService = ChatService;
class UserWithLatestChatDTO {
}
exports.UserWithLatestChatDTO = UserWithLatestChatDTO;
//# sourceMappingURL=chat.service.js.map