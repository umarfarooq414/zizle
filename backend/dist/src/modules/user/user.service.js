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
exports.UserService = void 0;
const types_1 = require("../../../libs/types/src");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const falso_1 = require("@ngneat/falso");
const axios_1 = require("axios");
const bcrypt = require("bcryptjs");
const typeorm_2 = require("typeorm");
const auth_helper_1 = require("../auth/auth.helper");
const mail_service_1 = require("../mail/mail.service");
const index_1 = require("./../../../libs/dtos/src/common/index");
const customer_favourite_entity_1 = require("./entities/customer.favourite.entity");
const customer_profiledata_entity_1 = require("./entities/customer.profiledata.entity");
const user_account_transaction_entity_1 = require("./entities/user.account.transaction.entity");
const user_address_entity_1 = require("./entities/user.address.entity");
const user_block_entity_1 = require("./entities/user.block.entity");
const user_entity_1 = require("./entities/user.entity");
const user_photos_entity_1 = require("./entities/user.photos.entity");
const user_transaction_actiontypes_entity_1 = require("./entities/user.transaction.actiontypes.entity");
const visit_profile_entity_1 = require("./entities/visit.profile.entity");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const schedule = require("node-schedule");
const contactSupport_entity_1 = require("./entities/contactSupport.entity");
const fs = require("fs");
const notifications_entity_1 = require("./entities/notifications.entity");
let UserService = class UserService {
    constructor(userRepository, entity, config, helper, mailService, cloudinary) {
        this.userRepository = userRepository;
        this.entity = entity;
        this.config = config;
        this.helper = helper;
        this.mailService = mailService;
        this.cloudinary = cloudinary;
        this.scheduleRandomlySetOnline();
        this.scheduleRandomVisit();
    }
    async createAdmin() {
        const isAdminExit = await this.userRepository.findOneBy({
            role: types_1.UserRoleEnum.ADMIN,
        });
        if (isAdminExit != null)
            return;
        const adminDetail = this.config.get(types_1.ConfigEnum.SERVER).admin;
        const adminUser = Object.assign(Object.assign({}, adminDetail), { role: types_1.UserRoleEnum.ADMIN, status: types_1.UserStatusEnum.VERIFIED });
        const admin = new user_entity_1.User(adminUser);
        const profile = new customer_profiledata_entity_1.CustomerProfileData();
        admin.profile = profile;
        profile.avatarUrl = 'https://res.cloudinary.com/dxpzb2i1u/image/upload/v1688455274/favicon_jsjvbr.png';
        await this.entity.save(customer_profiledata_entity_1.CustomerProfileData, profile);
        const hashedPassword = await this.helper.encodePassword(adminDetail.password);
        admin.setPassword(hashedPassword);
        this.userRepository.save(admin);
    }
    async createAdminFake() {
        const isAdminFakeExit = await this.userRepository.findOneBy({
            role: types_1.UserRoleEnum.FAKE,
        });
        if (isAdminFakeExit != null)
            return;
        const adminFakeUser = {
            userName: 'Demo',
            firstName: 'admin',
            lastName: 'demo',
            email: 'adminFake@demo.com',
            role: types_1.UserRoleEnum.FAKE,
            status: types_1.UserStatusEnum.VERIFIED,
        };
        const adminFake = new user_entity_1.User(adminFakeUser);
        const hashedPassword = await this.helper.encodePassword('password');
        adminFake.setPassword(hashedPassword);
        this.userRepository.save(adminFake);
    }
    async updateInfoById(id, body, files) {
        var _a, _b, _c;
        let user = await this.userRepository.findOne({ where: { id } });
        if (user == null) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const gid = (_a = user === null || user === void 0 ? void 0 : user.profile) === null || _a === void 0 ? void 0 : _a.id;
        const data = await this.entity.findOneBy(customer_profiledata_entity_1.CustomerProfileData, { id: gid });
        let currentCoins = await this.getCurrentCoinsFromDB(user);
        let avatarPath = '';
        const photosPaths = [];
        const plainFile = Object.assign({}, files);
        delete plainFile.buffer;
        let avatar;
        let photos;
        if (plainFile === null || plainFile === void 0 ? void 0 : plainFile.avatar) {
            avatar = plainFile.avatar[0];
        }
        if (plainFile === null || plainFile === void 0 ? void 0 : plainFile.photos) {
            photos = plainFile.photos;
        }
        if (avatar) {
            avatarPath = await this.savePhoto(avatar, 'user');
        }
        if (photos) {
            await this.saveMultiplePhotosToDB(photosPaths, photos, user, 'user');
        }
        if (data == null) {
            throw new common_1.HttpException('GenealInfo not found!', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            if (body.profileText)
                data.setProfileText(body.profileText);
            if (body.children)
                data.setChildren(body.children);
            if (body.smoker)
                data.setSmoker(body.smoker);
            if (body.life)
                data.setLife(body.life);
            if (body.relationshipStatus)
                data.setRelationShipStatus(body.relationshipStatus);
            if (avatarPath) {
                data.setAvatarUrl(avatarPath);
                if (((_b = user === null || user === void 0 ? void 0 : user.profile) === null || _b === void 0 ? void 0 : _b.avatarUrl) === null) {
                    currentCoins += await this.getActionTypeCostFromDB(types_1.TransactionActionTypes.AVATARUPLOADED);
                    await this.transaction(user, currentCoins, types_1.TransactionActionTypes.AVATARUPLOADED);
                }
            }
            if (body.mobileNumber) {
                data.setMobileNumber(body.mobileNumber);
                if (((_c = user === null || user === void 0 ? void 0 : user.profile) === null || _c === void 0 ? void 0 : _c.mobileNumber) === null) {
                    currentCoins += await this.getActionTypeCostFromDB(types_1.TransactionActionTypes.MOBILENUMBER);
                    await this.transaction(user, currentCoins, types_1.TransactionActionTypes.MOBILENUMBER);
                }
            }
            if (body.dob) {
                await this.validateAndSaveDOB(data, body.dob);
            }
            if (body.address) {
                await this.validateAndSaveAddress(body.address, user);
            }
            if (body.userName) {
                await this.userRepository.update({ id: user.id }, { userName: body.userName });
            }
            if (body.selfGender) {
                await this.userRepository.update({ id: user.id }, { selfGender: body.selfGender });
            }
            if (body.interestedGender) {
                await this.userRepository.update({ id: user.id }, { interestedGender: body.interestedGender });
            }
            if (body.currentPassword && body.newPassword) {
                await this.validateAndUpdatePassword(body.currentPassword, body.newPassword, user);
            }
            await this.entity.save(data);
            user = await this.userRepository.findOne({ where: { id: user.id } });
            delete user.password;
            return user;
        }
    }
    async getCurrentCoinsFromDB(user) {
        var _a, _b;
        const length = (_a = user === null || user === void 0 ? void 0 : user.transaction) === null || _a === void 0 ? void 0 : _a.length;
        if (length === 0 || !length) {
            return 0;
        }
        const id = (_b = user === null || user === void 0 ? void 0 : user.transaction[length - 1]) === null || _b === void 0 ? void 0 : _b.id;
        const trans = await this.entity.findOne(user_account_transaction_entity_1.UserAccountTransaction, {
            where: {
                id,
            },
            order: {
                id: 'DESC',
            },
        });
        return (trans === null || trans === void 0 ? void 0 : trans.currentCoins) || 0;
    }
    async getActionTypeCostFromDB(actionType) {
        const action = await this.entity.findOne(user_transaction_actiontypes_entity_1.UserTransactionActionTypes, {
            where: {
                actionType,
            },
        });
        if (action) {
            return action === null || action === void 0 ? void 0 : action.cost;
        }
        else {
            throw new common_1.HttpException('Action type not found', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async mockData() {
        const actionTypes = [
            {
                id: '1',
                actionType: types_1.TransactionActionTypes.SENDMESSAGE,
                cost: await (0, types_1.getAmountForEachAction)(types_1.TransactionActionTypes.SENDMESSAGE),
            },
            {
                id: '2',
                actionType: types_1.TransactionActionTypes.EMAILCONFIRMED,
                cost: await (0, types_1.getAmountForEachAction)(types_1.TransactionActionTypes.EMAILCONFIRMED),
            },
            {
                id: '3',
                actionType: types_1.TransactionActionTypes.AVATARUPLOADED,
                cost: await (0, types_1.getAmountForEachAction)(types_1.TransactionActionTypes.AVATARUPLOADED),
            },
            {
                id: '4',
                actionType: types_1.TransactionActionTypes.PROFILEVERIFIED,
                cost: await (0, types_1.getAmountForEachAction)(types_1.TransactionActionTypes.PROFILEVERIFIED),
            },
            {
                id: '5',
                actionType: types_1.TransactionActionTypes.MOBILENUMBER,
                cost: await (0, types_1.getAmountForEachAction)(types_1.TransactionActionTypes.MOBILENUMBER),
            },
            {
                id: '6',
                actionType: types_1.TransactionActionTypes.ACCOUNTCREATION,
                cost: await (0, types_1.getAmountForEachAction)(types_1.TransactionActionTypes.ACCOUNTCREATION),
            },
            {
                id: '7',
                actionType: types_1.TransactionActionTypes.VIEWPHOTO,
                cost: await (0, types_1.getAmountForEachAction)(types_1.TransactionActionTypes.VIEWPHOTO),
            },
            {
                id: '8',
                actionType: types_1.TransactionActionTypes.SENDEMOJI,
                cost: await (0, types_1.getAmountForEachAction)(types_1.TransactionActionTypes.SENDEMOJI),
            },
            {
                id: '9',
                actionType: types_1.TransactionActionTypes.RECEIVEEMOJI,
                cost: await (0, types_1.getAmountForEachAction)(types_1.TransactionActionTypes.RECEIVEEMOJI),
            },
            {
                id: '10',
                actionType: types_1.TransactionActionTypes.PACKAGE_SUBSCRIPTION,
                cost: 0,
            },
            {
                id: '11',
                actionType: types_1.TransactionActionTypes.SENDGIFT,
                cost: await (0, types_1.getAmountForEachAction)(types_1.TransactionActionTypes.SENDGIFT),
            },
            {
                id: '12',
                actionType: types_1.TransactionActionTypes.BONUSCODE,
                cost: 0,
            },
        ];
        await Promise.all(actionTypes.map(async (actionType) => {
            const exists = await this.entity.findOne(user_transaction_actiontypes_entity_1.UserTransactionActionTypes, { where: { id: actionType.id } });
            if (!exists) {
                const newActionType = this.entity.create(user_transaction_actiontypes_entity_1.UserTransactionActionTypes);
                newActionType.id = actionType.id;
                newActionType.actionType = actionType.actionType;
                newActionType.cost = actionType.cost;
                await this.entity.save(user_transaction_actiontypes_entity_1.UserTransactionActionTypes, newActionType);
            }
        }));
    }
    async addToVisit(visited, token, fakeId) {
        const tokenValue = token.split(' ')[1];
        const visitedUser = await this.userRepository.findOneBy({ id: visited });
        const decoded = await this.helper.decode(tokenValue);
        const visitorUser = decoded ? await this.helper.validateUser(decoded) : null;
        if (!visitedUser || !visitorUser) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const existingVisit = await this.entity.findOne(visit_profile_entity_1.VisitProfile, {
            where: {
                visited: { id: visitedUser.id },
                visitor: { id: visitorUser.id },
            },
        });
        if (existingVisit) {
            existingVisit.timestamp = new Date();
            return await this.entity.save(existingVisit);
        }
        else {
            const visit = new visit_profile_entity_1.VisitProfile();
            visit.visited = visitedUser;
            visit.visitor = visitorUser;
            if (visitorUser.role === types_1.UserRoleEnum.MODERATOR)
                visit.creatorId = visitorUser.id;
            const notification = new notifications_entity_1.Notifications();
            notification.category = types_1.NotificationAction.VISITED;
            notification.seen = false;
            notification.notifier = visitorUser;
            notification.notified = visitedUser;
            const message = `${visitorUser.userName} ${notification.category.toLowerCase()} your profile`;
            notification.message = message;
            await this.entity.save(notifications_entity_1.Notifications, notification);
            return await this.entity.save(visit_profile_entity_1.VisitProfile, visit);
        }
    }
    async getVisits(token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (user == null) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const visits = await this.entity.find(visit_profile_entity_1.VisitProfile, {
            where: {
                visited: { id: user.id },
            },
            relations: ['visitor'],
        });
        visits.forEach((visit) => {
            var _a, _b, _c, _d;
            (_a = visit === null || visit === void 0 ? void 0 : visit.visitor) === null || _a === void 0 ? true : delete _a.password;
            (_b = visit === null || visit === void 0 ? void 0 : visit.visitor) === null || _b === void 0 ? true : delete _b.transaction;
            (_c = visit === null || visit === void 0 ? void 0 : visit.visitor) === null || _c === void 0 ? true : delete _c.visits;
            (_d = visit === null || visit === void 0 ? void 0 : visit.visitor) === null || _d === void 0 ? true : delete _d.favorite;
        });
        return visits;
    }
    async markFavorite(favoriteId, token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        const favoriteUser = await this.userRepository.findOneBy({ id: favoriteId });
        if (!user || !favoriteUser) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const existingFavorite = await this.entity.findOne(customer_favourite_entity_1.Favorite, {
            where: { userId: user.id, favorites: { id: favoriteUser.id } },
        });
        if (existingFavorite) {
            await this.entity.remove(customer_favourite_entity_1.Favorite, existingFavorite);
        }
        else {
            const favorite = new customer_favourite_entity_1.Favorite();
            favorite.userId = user.id;
            favorite.favorites = favoriteUser;
            const notification = new notifications_entity_1.Notifications();
            notification.category = types_1.NotificationAction.LIKED;
            notification.seen = false;
            notification.notifier = user;
            notification.notified = favoriteUser;
            const message = `${user.userName} ${notification.category.toLowerCase()} your profile`;
            notification.message = message;
            await this.entity.save(notifications_entity_1.Notifications, notification);
            await this.entity.save(customer_favourite_entity_1.Favorite, favorite);
        }
    }
    async getFavorites(token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (user == null) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const favorites = await this.entity.find(customer_favourite_entity_1.Favorite, {
            where: {
                userId: user.id,
            },
            relations: ['favorites'],
        });
        favorites.forEach((fav) => {
            delete fav.favorites.password;
            delete fav.favorites.transaction;
            delete fav.favorites.visits;
            delete fav.favorites.favorite;
        });
        return favorites;
    }
    async getRandom(token) {
        const tokenValue = token === null || token === void 0 ? void 0 : token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const currentUser = decoded ? await this.helper.validateUser(decoded) : null;
        if (currentUser == null) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const randomUser = await this.userRepository
            .createQueryBuilder('user')
            .select()
            .orderBy('RAND()')
            .where('user.id != :currentUserId AND (user.role = :customerRole OR user.role = :fakeRole)', {
            currentUserId: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id,
            customerRole: types_1.UserRoleEnum.CUSTOMER,
            fakeRole: types_1.UserRoleEnum.FAKE,
        })
            .limit(1)
            .getOne();
        if (randomUser) {
            delete randomUser.password;
            delete randomUser.transaction;
            delete randomUser.visits;
            delete randomUser.favorite;
        }
        return randomUser;
    }
    async findAll(token, params, schedule) {
        var _a, _b;
        const schedulee = String(params.schedule) === 'true';
        const tokenValue = schedulee === false ? token.split(' ')[1] : null;
        const decoded = await this.helper.decode(tokenValue);
        const currentUser = decoded ? await this.helper.validateUser(decoded) : null;
        if (currentUser === null && schedule === false) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const { page, pageSize, gender, nickname, online, startAge, endAge, distanceInKms, newUsers, fsk, postalCode } = params;
        const distance = parseInt(distanceInKms);
        let pageNo;
        let limit = parseInt(pageSize);
        if (page) {
            pageNo = parseInt(page);
        }
        else {
            pageNo = 1;
        }
        limit = limit <= 20 ? limit : 20;
        const query = this.userRepository.createQueryBuilder('user');
        query.leftJoinAndSelect('user.profile', 'profile');
        query.leftJoinAndSelect('user.address', 'address');
        query.leftJoinAndSelect('user.favorite', 'favorite');
        query.leftJoinAndSelect('user.blocked', 'blocked');
        schedulee === false ? query.where('user.id != :currentUserId', { currentUserId: currentUser.id }) : '';
        schedulee === true ? query.andWhere('user.role != :userRole', { userRole: types_1.UserRoleEnum.FAKE }) : '';
        query.andWhere('user.disable = :disable', { disable: false });
        query.andWhere('user.role != :modRole AND user.role != :adminRole', {
            modRole: types_1.UserRoleEnum.MODERATOR,
            adminRole: types_1.UserRoleEnum.ADMIN,
        });
        if (gender) {
            query.andWhere('user.selfGender = :gender', { gender: gender.toUpperCase() });
        }
        if (nickname) {
            query.andWhere(`user.userName LIKE '%${nickname}%'`);
        }
        if (online) {
            query.andWhere('user.online = :status', { status: true });
        }
        if (distance && distance > 0 && distance <= 120) {
            const distanceInMeters = distance * 1000;
            if (((_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.address) === null || _a === void 0 ? void 0 : _a.latitude) && ((_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser.address) === null || _b === void 0 ? void 0 : _b.longitude)) {
                schedulee === false ? query.where('user.id != :currentUserId', { currentUserId: currentUser.id }) : '';
                query.andWhere(`ST_Distance_Sphere(
        point(:userLongitude, :userLatitude),
        point(address.longitude, address.latitude)
      ) <= :distanceInMeters`, {
                    userLongitude: currentUser.address.longitude,
                    userLatitude: currentUser.address.latitude,
                    distanceInMeters,
                });
            }
        }
        if (startAge && endAge) {
            const now = new Date();
            const startYear = now.getFullYear() - parseInt(endAge);
            const endYear = now.getFullYear() - parseInt(startAge);
            const startDate = new Date(startYear, now.getMonth(), now.getDate());
            const endDate = new Date(endYear, now.getMonth(), now.getDate());
            query.andWhere('profile.dateOfBirth BETWEEN :startDate AND :endDate', { startDate, endDate });
        }
        if (newUsers) {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            query.andWhere('user.createdAt >= :sevenDaysAgo', { sevenDaysAgo });
        }
        if (fsk) {
            const maxBirthDate = new Date();
            maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 18);
            query.andWhere('profile.dateOfBirth <= :maxBirthDate', { maxBirthDate });
        }
        if (postalCode) {
            const targetLocation = await this.getCoordinatesFromAddress(postalCode);
            if (targetLocation) {
                const targetLatitude = targetLocation[0];
                const targetLongitude = targetLocation[1];
                schedulee === false ? query.where('user.id != :currentUserId', { currentUserId: currentUser.id }) : '';
                query.andWhere('address.latitude = :userLatitude AND address.longitude = :userLongitude', {
                    userLatitude: targetLatitude,
                    userLongitude: targetLongitude,
                });
            }
        }
        let [users, totalCount] = await query
            .skip((pageNo - 1) * limit)
            .take(limit)
            .getManyAndCount();
        const hasNextPage = totalCount > pageNo * limit;
        const nextPage = hasNextPage ? pageNo + 1 : null;
        users.forEach(async (user) => {
            delete user.password;
        });
        return {
            page,
            pageSize: limit,
            nextPage,
            total: totalCount,
            data: users,
        };
    }
    async getCustomer(userId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        return user;
    }
    async getCustomerData(email) {
        return await this.userRepository.findOneBy({ email: email });
    }
    async updateOnlineStatus(userId, onlineStatus) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (user) {
            user.online = onlineStatus;
            await this.userRepository.save(user);
        }
    }
    async checkOnlineStatus(userId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (user.online) {
            return true;
        }
        else {
            return false;
        }
    }
    async savePhoto(file, folderName) {
        let result;
        let url;
        if (file) {
            try {
                result = await this.cloudinary.uploadImage(file, folderName);
                url = result.url;
                return url;
            }
            catch (err) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
            }
        }
    }
    async transaction(user, currentCoins, action) {
        await this.addTransactions(action, user, this.entity, user_account_transaction_entity_1.UserAccountTransaction, user_transaction_actiontypes_entity_1.UserTransactionActionTypes, currentCoins);
    }
    async getCoordinatesFromAddress(address) {
        try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
            const { data } = await axios_1.default.get(url);
            if (data.length === 0) {
                throw new Error(`Could not find coordinates for address: ${address}`);
            }
            return [+data[0].lat, +data[0].lon, data[0].display_name];
        }
        catch (error) {
            throw new common_1.HttpException(error === null || error === void 0 ? void 0 : error.message, error === null || error === void 0 ? void 0 : error.status);
        }
    }
    async validateAndSaveAddress(address, user) {
        const coordinates = await this.getCoordinatesFromAddress(address);
        const existingAddress = await this.entity.findOneBy(user_address_entity_1.Address, { user: { email: user.email } });
        if (!existingAddress) {
            const addressEntity = new user_address_entity_1.Address();
            if (coordinates) {
                addressEntity.setAddress(address);
                addressEntity.setLatitude(coordinates[0]);
                addressEntity.setLongitude(coordinates[1]);
                addressEntity.user = user;
                return await this.entity.save(user_address_entity_1.Address, addressEntity);
            }
        }
    }
    async validateAndSaveDOB(table, dob) {
        try {
            const [year, month, day] = dob.split('-');
            const parsedDateOfBirth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            const now = new Date();
            const ageInMs = now.getTime() - parsedDateOfBirth.getTime();
            const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
            if (ageInYears >= 18 && ageInYears <= 65) {
                return table.setDateOfBirth(parsedDateOfBirth);
            }
            else {
                console.log(Math.floor(ageInYears));
                throw new common_1.HttpException('Invalid date of birth', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async getUsersDistance(user1Id, user2Id) {
        const user1 = await this.userRepository.findOneBy({ id: user1Id });
        const user2 = await this.userRepository.findOneBy({ id: user2Id });
        const existingAddressUser1 = await this.entity.findOneBy(user_address_entity_1.Address, { user: { id: user1.id } });
        const existingAddressUser2 = await this.entity.findOneBy(user_address_entity_1.Address, { user: { id: user2.id } });
        const R = 6371;
        const dLat = await this.deg2rad(existingAddressUser2.latitude - existingAddressUser1.latitude);
        const dLon = await this.deg2rad(existingAddressUser2.longitude - existingAddressUser1.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(await this.deg2rad(existingAddressUser1.latitude)) *
                Math.cos(await this.deg2rad(existingAddressUser2.latitude)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d * 0.621371;
    }
    async deg2rad(deg) {
        return (await deg) * (Math.PI / 180);
    }
    async markBlock(userId, token, reason) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        const blockUser = await this.userRepository.findOneBy({ id: userId });
        if (!user || !blockUser) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const existingBlock = await this.entity.findOne(user_block_entity_1.Block, {
            where: { userId: user.id, blocked: { id: blockUser.id } },
        });
        if (existingBlock) {
            await this.entity.update(user_block_entity_1.Block, { userId: user.id, blocked: { id: blockUser.id } }, { status: true });
        }
        else {
            const block = new user_block_entity_1.Block();
            block.userId = user.id;
            block.blocked = blockUser;
            block.status = true;
            block.reason = (0, types_1.getBlockReason)(reason);
            await this.entity.save(user_block_entity_1.Block, block);
        }
    }
    async getBlocked(token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (user == null) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const blocks = await this.entity.find(user_block_entity_1.Block, {
            where: {
                userId: user.id,
                status: true,
            },
            relations: ['blocked'],
        });
        blocks.forEach((block) => {
            delete block.blocked.password;
            delete block.blocked.transaction;
            delete block.blocked.visits;
            delete block.blocked.favorite;
        });
        return blocks;
    }
    async removeBlocked(userId, token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        const blockUser = await this.userRepository.findOneBy({ id: userId });
        if (!user || !blockUser) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        const existingBlock = await this.entity.findOne(user_block_entity_1.Block, {
            where: { userId: user.id, blocked: { id: blockUser.id }, status: true },
        });
        if (existingBlock) {
            await this.entity.update(user_block_entity_1.Block, { userId: user.id, blocked: { id: blockUser.id } }, { status: false });
        }
    }
    async validateAndUpdatePassword(currentPassword, newPassword, user) {
        const isPasswordValid = this.helper.isPasswordValid(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.HttpException('Wrong Password', common_1.HttpStatus.CONFLICT);
        }
        const hashedPassword = await this.helper.encodePassword(newPassword);
        await this.userRepository.update({ id: user.id }, { password: hashedPassword });
    }
    async convertToBase64(image, user) {
        const imageData = fs.readFileSync(image);
        return imageData.toString('base64');
    }
    async saveMultiplePhotosToDB(photosPaths, photos, user, folder) {
        var _a;
        for (const photo of photos) {
            const photoPath = await this.savePhoto(photo, folder);
            photosPaths.push(photoPath);
        }
        if (photosPaths.length > 0) {
            for (const photoPath of photosPaths) {
                const photo = new user_photos_entity_1.Photo();
                photo.photos = photoPath;
                photo.user = user;
                (_a = user.photos) === null || _a === void 0 ? void 0 : _a.push(photo);
                await this.entity.save(user_photos_entity_1.Photo, photo);
            }
        }
        await this.userRepository.save(user);
    }
    async removeUser(token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (!user) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            const deletedUser = await this.userRepository.update({ id: user.id }, { disable: true });
            let message = '';
            if (deletedUser) {
                message = 'Account Deleted';
            }
            else {
                message = 'Something went wrong';
            }
            return new index_1.GlobalResponseDto(message);
        }
    }
    async removePhoto(id, token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        let user = decoded ? await this.helper.validateUser(decoded) : null;
        if (!user) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            await this.entity.delete(user_photos_entity_1.Photo, {
                id,
            });
            user = await this.userRepository.findOne({ where: { id: user.id } });
            delete user.password;
            return user;
        }
    }
    async contactSupport(body) {
        const { token, theme, message } = body;
        if (token) {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user) {
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            }
            else {
                const admin = await this.userRepository.findOneBy({ role: types_1.UserRoleEnum.ADMIN });
                await this.addContactRecord(body.message, user);
                this.mailService.sendSupportMail(theme, {
                    firstName: user.userName,
                    message: message,
                    email: user.email,
                }, admin.email);
                return new index_1.GlobalResponseDto('Your message has been sent Successfully!');
            }
        }
        else {
            const admin = await this.userRepository.findOneBy({ role: types_1.UserRoleEnum.ADMIN });
            await this.addContactRecord(body.message);
            this.mailService.sendSupportMail(body.theme, {
                firstName: body.email,
                message: body.message,
                email: body.email,
            }, admin.email);
            return new index_1.GlobalResponseDto('Your message has been sent Successfully!');
        }
    }
    async addContactRecord(message, user) {
        try {
            const contactSupport = new contactSupport_entity_1.ContactSupport();
            contactSupport.query = message;
            contactSupport.user = user;
            await this.entity.save(contactSupport_entity_1.ContactSupport, contactSupport);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async demoUsers() {
        for (let i = 0; i < 10; i++) {
            const hashedPassword = await bcrypt.hash('password', 10);
            const selfGenderArray = [types_1.UserSelfGenderEnum.MALE, types_1.UserSelfGenderEnum.FEMALE];
            const selfGender = selfGenderArray[Math.floor(Math.random() * selfGenderArray.length)];
            const interestedGenderArray = [types_1.UserInterestedGenderEnum.MALE, types_1.UserInterestedGenderEnum.FEMALE];
            const interestedGender = interestedGenderArray[Math.floor(Math.random() * interestedGenderArray.length)];
            const user = new user_entity_1.User();
            user.userName = (0, falso_1.randUserName)();
            user.firstName = (0, falso_1.randFirstName)();
            user.lastName = (0, falso_1.randLastName)();
            user.email = (0, falso_1.randEmail)();
            user.password = hashedPassword;
            user.selfGender = selfGender;
            user.interestedGender = interestedGender;
            user.status = types_1.UserStatusEnum.VERIFIED;
            const profile = this.entity.save(customer_profiledata_entity_1.CustomerProfileData, { user });
            user.profile = profile;
            await this.userRepository.save(user);
        }
    }
    async getCoins(token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        if (!user) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            return await this.getCurrentCoinsFromDB(user);
        }
    }
    async makeTransaction(token, actionType, receiverId, subAction, bonus) {
        token = token.includes('Bearer') ? token.split(' ')[1] : token;
        const decoded = await this.helper.decode(token);
        const user = decoded ? await this.helper.validateUser(decoded) : null;
        const receiver = await this.getCustomer(receiverId);
        let res = null;
        if (!user)
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        if (!receiver)
            throw new common_1.HttpException('Receiver not found!', common_1.HttpStatus.NOT_FOUND);
        const currentCoins = await this.getCurrentCoinsFromDB(user);
        if (actionType === types_1.TransactionActionTypes.BONUSCODE) {
            const valid = await this.helper.verifyBonusCode(`Bearer ${token}`, bonus);
            const bonusCode = await this.helper.getBonusCode(`Bearer ${token}`, null, bonus);
            if (valid) {
                const foundBonus = await this.helper.useBonusCode(user, bonusCode);
                if (foundBonus) {
                    res = await this.addTransactions(actionType, user, this.entity, user_account_transaction_entity_1.UserAccountTransaction, user_transaction_actiontypes_entity_1.UserTransactionActionTypes, currentCoins + bonusCode.coins, bonusCode.coins);
                    return res ? { success: true } : { success: false };
                }
            }
        }
        if (actionType === types_1.TransactionActionTypes.VIEWPHOTO) {
            const visit = await this.markUserAsSeenInProfileVisits(receiverId, user === null || user === void 0 ? void 0 : user.id);
            if (visit) {
                res = await this.addTransactions(actionType, user, this.entity, user_account_transaction_entity_1.UserAccountTransaction, user_transaction_actiontypes_entity_1.UserTransactionActionTypes, currentCoins);
                return res ? { success: true } : { success: false };
            }
        }
        res =
            actionType === types_1.TransactionActionTypes.SENDEMOJI || actionType === types_1.TransactionActionTypes.SENDGIFT
                ? await this.processEmojiGiftTransaction(user, receiver, actionType, subAction, this.entity, user_account_transaction_entity_1.UserAccountTransaction, user_transaction_actiontypes_entity_1.UserTransactionActionTypes)
                : await this.addTransactions(actionType, user, this.entity, user_account_transaction_entity_1.UserAccountTransaction, user_transaction_actiontypes_entity_1.UserTransactionActionTypes, currentCoins);
        return res ? { success: true } : { success: false };
    }
    async processEmojiGiftTransaction(sender, receiver, action, subAction, entity, tableTransactions, tableActionTypes) {
        const senderCurrentCoins = await this.getCurrentCoinsFromDB(sender);
        const receiverCurrentCoins = await this.getCurrentCoinsFromDB(receiver);
        const cost = await this.getActionTypeCostFromDB(subAction);
        if (Math.abs(cost) <= senderCurrentCoins) {
            await this.addTransactions(action === types_1.TransactionActionTypes.SENDEMOJI ? action : subAction, sender, entity, tableTransactions, tableActionTypes, senderCurrentCoins);
            const actionType = await this.entity.findOne(user_transaction_actiontypes_entity_1.UserTransactionActionTypes, {
                where: { actionType: `Receive${subAction}` },
            });
            await this.addTransactions(action === types_1.TransactionActionTypes.SENDEMOJI ? types_1.TransactionActionTypes.RECEIVEEMOJI : actionType === null || actionType === void 0 ? void 0 : actionType.actionType, receiver, entity, tableTransactions, tableActionTypes, receiverCurrentCoins);
            return { success: true };
        }
        else {
            throw new common_1.HttpException('Sender balance is not enough!', common_1.HttpStatus.PAYMENT_REQUIRED);
        }
    }
    async addTransactions(action, user, entity, tableTransactions, tableActionTypes, currentCoins, bonusCost) {
        const amount = await this.getActionTypeCostFromDB(action);
        const cost = bonusCost > 0 ? bonusCost : amount;
        if (action !== types_1.TransactionActionTypes.ACCOUNTCREATION) {
            const isReceiver = action === types_1.TransactionActionTypes.RECEIVEEMOJI || action.includes('Receive');
            let newCurrentCoins = currentCoins;
            if ((amount < 0 && currentCoins > 0 && Math.abs(amount) <= currentCoins) || amount > 0 || isReceiver) {
                const actionType = await entity.findOne(tableActionTypes, { where: { actionType: action } });
                if (action === types_1.TransactionActionTypes.MOBILENUMBER ||
                    action === types_1.TransactionActionTypes.EMAILCONFIRMED ||
                    action === types_1.TransactionActionTypes.AVATARUPLOADED ||
                    action === types_1.TransactionActionTypes.PROFILEVERIFIED) {
                    newCurrentCoins = currentCoins;
                }
                else {
                    newCurrentCoins += cost;
                }
                const obj = {
                    user,
                    cost,
                    currentCoins: newCurrentCoins,
                    actionType,
                };
                const transaction = entity.create(tableTransactions, obj);
                return await entity.save(tableTransactions, transaction);
            }
            else if (action === types_1.TransactionActionTypes.BONUSCODE) {
                const actionType = await entity.findOne(tableActionTypes, { where: { actionType: action } });
                const obj = {
                    user,
                    cost,
                    currentCoins: newCurrentCoins,
                    actionType,
                };
                const transaction = entity.create(tableTransactions, obj);
                return await entity.save(tableTransactions, transaction);
            }
            else {
                throw new common_1.HttpException('Current Balance is not Enough!', common_1.HttpStatus.PAYMENT_REQUIRED);
            }
        }
        else {
            const actionType = await entity.findOne(tableActionTypes, { where: { actionType: action } });
            const obj = {
                user,
                cost,
                currentCoins: cost,
                actionType,
            };
            const transaction = entity.create(tableTransactions, obj);
            return await entity.save(tableTransactions, transaction);
        }
    }
    async markUserAsSeenInProfileVisits(visitorId, visitedId) {
        const visit = await this.entity.findOne(visit_profile_entity_1.VisitProfile, {
            where: {
                visited: { id: visitedId },
                visitor: { id: visitorId },
            },
        });
        if (!visit) {
            throw new common_1.HttpException('Profile visits not found', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            visit.seen = true;
            return await this.entity.save(visit_profile_entity_1.VisitProfile, visit);
        }
    }
    async randomlySetOnline(users) {
        return users === null || users === void 0 ? void 0 : users.map((user) => {
            if (user.role === types_1.UserRoleEnum.FAKE && !user.online) {
                const isOnline = Math.random() >= 0.5;
                return Object.assign(Object.assign({}, user), { online: isOnline });
            }
            else {
                return user;
            }
        });
    }
    scheduleRandomlySetOnline() {
        schedule.scheduleJob('0 0 * * *', async () => {
            try {
                await this.userRepository
                    .createQueryBuilder()
                    .update(user_entity_1.User)
                    .set({ online: () => 'RAND() > 0.5' })
                    .where('online = true')
                    .andWhere('role = :role', { role: types_1.UserRoleEnum.FAKE })
                    .execute();
                const offlineUsers = await this.userRepository
                    .createQueryBuilder()
                    .select()
                    .where('online = false')
                    .andWhere('role = :role', { role: types_1.UserRoleEnum.FAKE })
                    .andWhere((qb) => {
                    const subQuery = qb
                        .subQuery()
                        .select('id')
                        .from(user_entity_1.User, 'user')
                        .where('online = true')
                        .andWhere('role = :role', { role: types_1.UserRoleEnum.FAKE })
                        .getQuery();
                    return 'id NOT IN ' + subQuery;
                })
                    .orderBy('RAND()')
                    .limit(5)
                    .getMany();
                if (offlineUsers.length > 0) {
                    await this.userRepository
                        .createQueryBuilder()
                        .update(user_entity_1.User)
                        .set({ online: () => 'RAND() > 0.5' })
                        .where('id IN (:...userIds)', { userIds: offlineUsers.map((user) => user.id) })
                        .execute();
                }
            }
            catch (error) {
                console.error('An error occurred:', error);
            }
        });
    }
    scheduleRandomVisit() {
        schedule.scheduleJob('0 */10 * * *', async () => {
            try {
                const randomFakeUser = await this.userRepository
                    .createQueryBuilder('user')
                    .select()
                    .orderBy('RAND()')
                    .where('user.role =:role', { role: types_1.UserRoleEnum.FAKE })
                    .limit(1)
                    .getOne();
                const users = await this.userRepository.findBy({
                    role: types_1.UserRoleEnum.CUSTOMER,
                    status: types_1.UserStatusEnum.VERIFIED,
                });
                users.forEach(async (user) => {
                    const existingVisit = await this.entity.findOne(visit_profile_entity_1.VisitProfile, {
                        where: {
                            visited: { id: user.id },
                            visitor: { id: randomFakeUser.id },
                        },
                    });
                    if (existingVisit) {
                        existingVisit.timestamp = new Date();
                        return await this.entity.save(existingVisit);
                    }
                    else {
                        const visit = new visit_profile_entity_1.VisitProfile();
                        visit.visited = user;
                        visit.visitor = randomFakeUser;
                        const notification = new notifications_entity_1.Notifications();
                        notification.category = types_1.NotificationAction.VISITED;
                        notification.seen = false;
                        notification.notifier = randomFakeUser;
                        notification.notified = user;
                        const message = `${randomFakeUser.userName} ${notification.category.toLowerCase()} your profile`;
                        notification.message = message;
                        await this.entity.save(notifications_entity_1.Notifications, notification);
                        await this.entity.save(visit_profile_entity_1.VisitProfile, visit);
                    }
                });
            }
            catch (error) {
                console.error('An error occurred:', error);
            }
        });
    }
    async getNotifications(token, params) {
        try {
            const { page, pageSize } = params;
            let pageNo;
            let limit = parseInt(pageSize);
            if (page) {
                pageNo = parseInt(page);
            }
            else {
                pageNo = 1;
            }
            limit = limit <= 10 ? limit : 10;
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user) {
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            }
            const query = this.entity
                .createQueryBuilder(notifications_entity_1.Notifications, 'notifications')
                .leftJoinAndSelect('notifications.notifier', 'notifier')
                .where('notifications.notified.id = :userId', { userId: user.id })
                .andWhere('notifications.seen = :seen', { seen: false });
            const [notifications, totalCount] = await query
                .skip((pageNo - 1) * limit)
                .take(limit)
                .getManyAndCount();
            const hasNextPage = totalCount > pageNo * limit;
            const nextPage = hasNextPage ? pageNo + 1 : null;
            const queryCount = await this.entity
                .createQueryBuilder(notifications_entity_1.Notifications, 'notifications')
                .leftJoinAndSelect('notifications.notifier', 'notifier')
                .where('notifications.notified.id = :userId', { userId: user.id })
                .andWhere('notifications.seen = :seen', { seen: false })
                .getCount();
            return {
                page,
                pageSize: limit,
                nextPage,
                notifications,
                unseenCount: queryCount,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async seenNotification(token, id) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user) {
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            }
            const notification = await this.entity.findOne(notifications_entity_1.Notifications, {
                where: {
                    id,
                    notified: { id: user.id },
                },
            });
            if (!notification)
                throw new common_1.HttpException('Notification not found', common_1.HttpStatus.NOT_FOUND);
            notification.seen = true;
            await this.entity.save(notifications_entity_1.Notifications, notification);
            const query = await this.entity
                .createQueryBuilder(notifications_entity_1.Notifications, 'notifications')
                .leftJoinAndSelect('notifications.notifier', 'notifier')
                .where('notifications.notified.id = :userId', { userId: user.id })
                .andWhere('notifications.seen = :seen', { seen: false })
                .getMany();
            const newArr = [...query, { count: query.length }];
            return newArr;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async seenNotifications(token) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user) {
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            }
            const notifications = await this.entity.find(notifications_entity_1.Notifications, {
                where: {
                    notified: { id: user.id },
                },
            });
            if (!notifications)
                throw new common_1.HttpException('Notifications not found', common_1.HttpStatus.NOT_FOUND);
            notifications.forEach((notification) => (notification.seen = true));
            await this.entity.save(notifications_entity_1.Notifications, notifications);
            const query = await this.entity
                .createQueryBuilder(notifications_entity_1.Notifications, 'notifications')
                .leftJoinAndSelect('notifications.notifier', 'notifier')
                .where('notifications.notified.id = :userId', { userId: user.id })
                .andWhere('notifications.seen = :seen', { seen: false })
                .getMany();
            const newArr = [...query, { count: query.length }];
            return newArr;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, common_1.Inject)(config_1.ConfigService)),
    __param(3, (0, common_1.Inject)(auth_helper_1.AuthHelper)),
    __param(4, (0, common_1.Inject)(mail_service_1.MailService)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.EntityManager,
        config_1.ConfigService,
        auth_helper_1.AuthHelper,
        mail_service_1.MailService,
        cloudinary_config_1.CloudinaryConfigService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map