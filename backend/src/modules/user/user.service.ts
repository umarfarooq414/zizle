import { AuthService } from './../auth/auth.service';
import { ContactSupportDto, GetNotificationsQueryParamsDto, GetUsersQueryParamsDto } from '@lib/dtos';
import { type UpdateProfileRequestDto } from '@lib/dtos/profile';
import {
  BlockUserReason,
  ConfigEnum,
  CustomerProfileEnum,
  getAmountForEachAction,
  getBlockReason,
  IUserAccountTransaction,
  TransactionActionTypes,
  UserInterestedGenderEnum,
  UserRoleEnum,
  UserSelfGenderEnum,
  UserStatusEnum,
  type IServerConfig,
  type IUserParams,
  type ServerConfigEnum,
  NotificationAction,
} from '@lib/types';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randEmail, randFirstName, randLastName, randUserName } from '@ngneat/falso';
import axios from 'axios';
import * as bcrypt from 'bcryptjs';
import { EntityManager, Repository } from 'typeorm';
import { AuthHelper } from '../auth/auth.helper';
import { MailService } from '../mail/mail.service';
import { GlobalResponseDto } from './../../../libs/dtos/src/common/index';
import { Favorite } from './entities/customer.favourite.entity';
import { CustomerProfileData } from './entities/customer.profiledata.entity';
import { UserAccountTransaction } from './entities/user.account.transaction.entity';
import { Address } from './entities/user.address.entity';
import { Block } from './entities/user.block.entity';
import { User } from './entities/user.entity';
import { Photo } from './entities/user.photos.entity';
import { UserTransactionActionTypes } from './entities/user.transaction.actiontypes.entity';
import { VisitProfile } from './entities/visit.profile.entity';
import { CloudinaryConfigService } from '@config/cloudinary.config';
import * as schedule from 'node-schedule';
import { ContactSupport } from './entities/contactSupport.entity';
import * as fs from 'fs';
import { Notifications } from './entities/notifications.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entity: EntityManager,
    @Inject(ConfigService)
    private readonly config: ConfigService,
    @Inject(AuthHelper)
    private readonly helper: AuthHelper,
    @Inject(MailService)
    private readonly mailService: MailService,
    private cloudinary: CloudinaryConfigService
  ) {
    this.scheduleRandomlySetOnline();
    this.scheduleRandomVisit();
  }

  async createAdmin() {
    const isAdminExit = await this.userRepository.findOneBy({
      role: UserRoleEnum.ADMIN,
    });
    if (isAdminExit != null) return;
    const adminDetail: IServerConfig[ServerConfigEnum.ADMIN] = this.config.get<IServerConfig>(ConfigEnum.SERVER).admin;
    const adminUser: IUserParams = {
      ...adminDetail,
      role: UserRoleEnum.ADMIN,
      status: UserStatusEnum.VERIFIED,
    };
    const admin = new User(adminUser);

    const profile = new CustomerProfileData();
    admin.profile = profile;
    profile.avatarUrl = 'https://res.cloudinary.com/dxpzb2i1u/image/upload/v1688455274/favicon_jsjvbr.png';
    await this.entity.save(CustomerProfileData, profile);
    const hashedPassword = await this.helper.encodePassword(adminDetail.password);
    admin.setPassword(hashedPassword);
    this.userRepository.save(admin);
  }
  async createAdminFake() {
    const isAdminFakeExit = await this.userRepository.findOneBy({
      role: UserRoleEnum.FAKE,
    });
    if (isAdminFakeExit != null) return;

    const adminFakeUser: IUserParams = {
      userName: 'Demo',
      firstName: 'admin',
      lastName: 'demo',
      email: 'adminFake@demo.com',
      role: UserRoleEnum.FAKE,
      status: UserStatusEnum.VERIFIED,
    };
    const adminFake = new User(adminFakeUser);
    const hashedPassword = await this.helper.encodePassword('password');
    adminFake.setPassword(hashedPassword);
    this.userRepository.save(adminFake);
  }

  public async updateInfoById(id: string, body: UpdateProfileRequestDto, files) {
    let user: User | any = await this.userRepository.findOne({ where: { id } });
    if (user == null) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const gid = user?.profile?.id;
    const data = await this.entity.findOneBy(CustomerProfileData, { id: gid });
    let currentCoins = await this.getCurrentCoinsFromDB(user);
    let avatarPath = '';
    const photosPaths = [];
    const plainFile = { ...files };
    delete plainFile.buffer;
    let avatar;
    let photos;
    if (plainFile?.avatar) {
      avatar = plainFile.avatar[0];
    }
    if (plainFile?.photos) {
      photos = plainFile.photos;
    }
    if (avatar) {
      avatarPath = await this.savePhoto(avatar, 'user');
    }
    if (photos) {
      await this.saveMultiplePhotosToDB(photosPaths, photos, user, 'user');
    }
    if (data == null) {
      throw new HttpException('GenealInfo not found!', HttpStatus.NOT_FOUND);
    } else {
      if (body.profileText) data.setProfileText(body.profileText);
      if (body.children) data.setChildren(body.children);
      if (body.smoker) data.setSmoker(body.smoker);
      if (body.life) data.setLife(body.life);
      if (body.relationshipStatus) data.setRelationShipStatus(body.relationshipStatus);
      if (avatarPath) {
        data.setAvatarUrl(avatarPath);
        if (user?.profile?.avatarUrl === null) {
          currentCoins += await this.getActionTypeCostFromDB(TransactionActionTypes.AVATARUPLOADED);
          await this.transaction(user, currentCoins, TransactionActionTypes.AVATARUPLOADED);
        }
      }
      if (body.mobileNumber) {
        data.setMobileNumber(body.mobileNumber);
        if (user?.profile?.mobileNumber === null) {
          currentCoins += await this.getActionTypeCostFromDB(TransactionActionTypes.MOBILENUMBER);
          await this.transaction(user, currentCoins, TransactionActionTypes.MOBILENUMBER);
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
  // Fetch the current coins value from the DB for the user
  public async getCurrentCoinsFromDB(user: User | any): Promise<number> {
    const length = user?.transaction?.length;
    if (length === 0 || !length) {
      // If there's no transaction for the user, return 0 coins.
      return 0;
    }

    const id = user?.transaction[length - 1]?.id;
    const trans: IUserAccountTransaction = await this.entity.findOne(UserAccountTransaction, {
      where: {
        id,
      },
      order: {
        id: 'DESC',
      },
    });

    return trans?.currentCoins || 0;
  }

  public async getActionTypeCostFromDB(actionType: TransactionActionTypes | string) {
    const action: UserTransactionActionTypes = await this.entity.findOne(UserTransactionActionTypes, {
      where: {
        actionType,
      },
    });
    if (action) {
      return action?.cost;
    } else {
      throw new HttpException('Action type not found', HttpStatus.BAD_REQUEST);
    }
  }

  async mockData() {
    const actionTypes = [
      {
        id: '1',
        actionType: TransactionActionTypes.SENDMESSAGE,
        cost: await getAmountForEachAction(TransactionActionTypes.SENDMESSAGE),
      },
      {
        id: '2',
        actionType: TransactionActionTypes.EMAILCONFIRMED,
        cost: await getAmountForEachAction(TransactionActionTypes.EMAILCONFIRMED),
      },
      {
        id: '3',
        actionType: TransactionActionTypes.AVATARUPLOADED,
        cost: await getAmountForEachAction(TransactionActionTypes.AVATARUPLOADED),
      },
      {
        id: '4',
        actionType: TransactionActionTypes.PROFILEVERIFIED,
        cost: await getAmountForEachAction(TransactionActionTypes.PROFILEVERIFIED),
      },
      {
        id: '5',
        actionType: TransactionActionTypes.MOBILENUMBER,
        cost: await getAmountForEachAction(TransactionActionTypes.MOBILENUMBER),
      },
      {
        id: '6',
        actionType: TransactionActionTypes.ACCOUNTCREATION,
        cost: await getAmountForEachAction(TransactionActionTypes.ACCOUNTCREATION),
      },
      {
        id: '7',
        actionType: TransactionActionTypes.VIEWPHOTO,
        cost: await getAmountForEachAction(TransactionActionTypes.VIEWPHOTO),
      },
      {
        id: '8',
        actionType: TransactionActionTypes.SENDEMOJI,
        cost: await getAmountForEachAction(TransactionActionTypes.SENDEMOJI),
      },
      {
        id: '9',
        actionType: TransactionActionTypes.RECEIVEEMOJI,
        cost: await getAmountForEachAction(TransactionActionTypes.RECEIVEEMOJI),
      },
      {
        id: '10',
        actionType: TransactionActionTypes.PACKAGE_SUBSCRIPTION,
        cost: 0,
      },
      {
        id: '11',
        actionType: TransactionActionTypes.SENDGIFT,
        cost: await getAmountForEachAction(TransactionActionTypes.SENDGIFT),
      },
      {
        id: '12',
        actionType: TransactionActionTypes.BONUSCODE,
        cost: 0,
      },
    ];
    await Promise.all(
      actionTypes.map(async (actionType) => {
        const exists = await this.entity.findOne(UserTransactionActionTypes, { where: { id: actionType.id } });
        if (!exists) {
          const newActionType: any = this.entity.create(UserTransactionActionTypes);
          newActionType.id = actionType.id;
          newActionType.actionType = actionType.actionType;
          newActionType.cost = actionType.cost;
          await this.entity.save(UserTransactionActionTypes, newActionType);
        }
      })
    );
  }
  public async addToVisit(visited: string, token: string, fakeId?: string) {
    const tokenValue = token.split(' ')[1];
    const visitedUser = await this.userRepository.findOneBy({ id: visited });
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const visitorUser = decoded ? await this.helper.validateUser(decoded) : null;
    if (!visitedUser || !visitorUser) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const existingVisit = await this.entity.findOne(VisitProfile, {
      where: {
        visited: { id: visitedUser.id },
        visitor: { id: visitorUser.id },
      },
    });
    if (existingVisit) {
      existingVisit.timestamp = new Date();
      return await this.entity.save(existingVisit);
    } else {
      const visit = new VisitProfile();
      visit.visited = visitedUser;
      visit.visitor = visitorUser;
      if (visitorUser.role === UserRoleEnum.MODERATOR) visit.creatorId = visitorUser.id;
      const notification = new Notifications();
      notification.category = NotificationAction.VISITED;
      notification.seen = false;
      notification.notifier = visitorUser;
      notification.notified = visitedUser;
      const message = `${visitorUser.userName} ${notification.category.toLowerCase()} your profile`;
      notification.message = message;
      await this.entity.save(Notifications, notification);
      return await this.entity.save(VisitProfile, visit);
    }
  }

  public async getVisits(token: string) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    if (user == null) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const visits = await this.entity.find(VisitProfile, {
      where: {
        visited: { id: user.id },
      },
      relations: ['visitor'],
    });
    visits.forEach((visit: any) => {
      delete visit?.visitor?.password;
      delete visit?.visitor?.transaction;
      delete visit?.visitor?.visits;
      delete visit?.visitor?.favorite;
    });
    return visits;
  }

  public async markFavorite(favoriteId: string, token: string) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    const favoriteUser: User | any = await this.userRepository.findOneBy({ id: favoriteId });
    if (!user || !favoriteUser) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const existingFavorite = await this.entity.findOne(Favorite, {
      where: { userId: user.id, favorites: { id: favoriteUser.id } },
    });
    if (existingFavorite) {
      await this.entity.remove(Favorite, existingFavorite);
    } else {
      const favorite = new Favorite();
      favorite.userId = user.id;
      favorite.favorites = favoriteUser;
      const notification = new Notifications();
      notification.category = NotificationAction.LIKED;
      notification.seen = false;
      notification.notifier = user;
      notification.notified = favoriteUser;
      const message = `${user.userName} ${notification.category.toLowerCase()} your profile`;
      notification.message = message;
      await this.entity.save(Notifications, notification);
      await this.entity.save(Favorite, favorite);
    }
  }

  public async getFavorites(token: string) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    if (user == null) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const favorites = await this.entity.find(Favorite, {
      where: {
        userId: user.id,
      },
      relations: ['favorites'],
    });
    favorites.forEach((fav: any) => {
      delete fav.favorites.password;
      delete fav.favorites.transaction;
      delete fav.favorites.visits;
      delete fav.favorites.favorite;
    });
    return favorites;
  }

  public async getRandom(token: string) {
    const tokenValue = token?.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const currentUser = decoded ? await this.helper.validateUser(decoded) : null;
    if (currentUser == null) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const randomUser = await this.userRepository
      .createQueryBuilder('user')
      .select()
      .orderBy('RAND()')
      .where('user.id != :currentUserId AND (user.role = :customerRole OR user.role = :fakeRole)', {
        currentUserId: currentUser?.id,
        customerRole: UserRoleEnum.CUSTOMER,
        fakeRole: UserRoleEnum.FAKE,
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

  public async findAll(token?: string, params?: GetUsersQueryParamsDto, schedule?: boolean) {
    const schedulee = String(params.schedule) === 'true';
    const tokenValue = schedulee === false ? token.split(' ')[1] : null;
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const currentUser = decoded ? await this.helper.validateUser(decoded) : null;
    if (currentUser === null && schedule === false) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const { page, pageSize, gender, nickname, online, startAge, endAge, distanceInKms, newUsers, fsk, postalCode } =
      params;
    const distance = parseInt(distanceInKms);
    let pageNo;
    let limit = parseInt(pageSize);
    if (page) {
      pageNo = parseInt(page);
    } else {
      pageNo = 1;
    }
    limit = limit <= 20 ? limit : 20;
    const query = this.userRepository.createQueryBuilder('user');
    query.leftJoinAndSelect('user.profile', 'profile');
    query.leftJoinAndSelect('user.address', 'address');
    query.leftJoinAndSelect('user.favorite', 'favorite');
    query.leftJoinAndSelect('user.blocked', 'blocked');

    schedulee === false ? query.where('user.id != :currentUserId', { currentUserId: currentUser.id }) : '';
    schedulee === true ? query.andWhere('user.role != :userRole', { userRole: UserRoleEnum.FAKE }) : '';
    query.andWhere('user.disable = :disable', { disable: false });
    query.andWhere('user.role != :modRole AND user.role != :adminRole', {
      modRole: UserRoleEnum.MODERATOR,
      adminRole: UserRoleEnum.ADMIN,
    });
    if (gender) {
      query.andWhere('user.selfGender = :gender', { gender: gender.toUpperCase() as UserSelfGenderEnum });
    }
    if (nickname) {
      query.andWhere(`user.userName LIKE '%${nickname}%'`);
    }
    if (online) {
      query.andWhere('user.online = :status', { status: true });
    }
    if (distance && distance > 0 && distance <= 120) {
      const distanceInMeters = distance * 1000; // convert miles to meters
      if (currentUser?.address?.latitude && currentUser?.address?.longitude) {
        schedulee === false ? query.where('user.id != :currentUserId', { currentUserId: currentUser.id }) : '';
        query.andWhere(
          `ST_Distance_Sphere(
        point(:userLongitude, :userLatitude),
        point(address.longitude, address.latitude)
      ) <= :distanceInMeters`,
          {
            userLongitude: currentUser.address.longitude,
            userLatitude: currentUser.address.latitude,
            distanceInMeters,
          }
        );
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
      maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 18); // calculate birth date for someone who is 18 years old
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

    // Add pagination
    // eslint-disable-next-line prefer-const
    let [users, totalCount]: any = await query
      .skip((pageNo - 1) * limit)
      .take(limit)
      .getManyAndCount();
    const hasNextPage = totalCount > pageNo * limit;
    const nextPage: number = hasNextPage ? pageNo + 1 : null;
    // users = await this.randomlySetOnline(users);
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

  async getCustomer(userId: string) {
    const user: User | any = await this.userRepository.findOneBy({ id: userId });
    return user;
  }

  async getCustomerData(email: string) {
    return await this.userRepository.findOneBy({ email: email });
  }

  async updateOnlineStatus(userId: string, onlineStatus: boolean) {
    const user: User = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      user.online = onlineStatus;
      await this.userRepository.save(user);
    }
  }

  async checkOnlineStatus(userId: string): Promise<boolean> {
    const user: User = await this.userRepository.findOneBy({ id: userId });
    if (user.online) {
      return true;
    } else {
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
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async transaction(user: User, currentCoins: number, action) {
    await this.addTransactions(
      action,
      user,
      this.entity,
      UserAccountTransaction,
      UserTransactionActionTypes,
      currentCoins
    );
  }

  async getCoordinatesFromAddress(address: string): Promise<[number, number, string]> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

      const { data } = await axios.get(url);

      if (data.length === 0) {
        throw new Error(`Could not find coordinates for address: ${address}`);
      }
      return [+data[0].lat, +data[0].lon, data[0].display_name];
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  async validateAndSaveAddress(address: string, user: User) {
    const coordinates = await this.getCoordinatesFromAddress(address);
    const existingAddress = await this.entity.findOneBy(Address, { user: { email: user.email } });
    if (!existingAddress) {
      const addressEntity = new Address();
      if (coordinates) {
        addressEntity.setAddress(address);
        addressEntity.setLatitude(coordinates[0]);
        addressEntity.setLongitude(coordinates[1]);
        addressEntity.user = user;
        return await this.entity.save(Address, addressEntity);
      }
    }
  }

  async validateAndSaveDOB(table: CustomerProfileData, dob: string) {
    try {
      const [year, month, day] = dob.split('-');
      // The correct order is year, month, and day
      const parsedDateOfBirth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const now = new Date();
      const ageInMs: number = now.getTime() - parsedDateOfBirth.getTime();
      const ageInYears: number = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
      // 365.25 days in a year to account for leap years
      if (ageInYears >= 18 && ageInYears <= 65) {
        // date of birth is valid
        return table.setDateOfBirth(parsedDateOfBirth);
      } else {
        console.log(Math.floor(ageInYears));
        throw new HttpException('Invalid date of birth', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getUsersDistance(user1Id: string, user2Id: string): Promise<number> {
    const user1 = await this.userRepository.findOneBy({ id: user1Id });
    const user2 = await this.userRepository.findOneBy({ id: user2Id });
    const existingAddressUser1 = await this.entity.findOneBy(Address, { user: { id: user1.id } });
    const existingAddressUser2 = await this.entity.findOneBy(Address, { user: { id: user2.id } });
    const R = 6371; // Radius of the earth in km
    const dLat: number = await this.deg2rad(existingAddressUser2.latitude - existingAddressUser1.latitude);
    const dLon: number = await this.deg2rad(existingAddressUser2.longitude - existingAddressUser1.longitude);
    const a: number =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(await this.deg2rad(existingAddressUser1.latitude)) *
        Math.cos(await this.deg2rad(existingAddressUser2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 0.621371; //miles;
  }

  async deg2rad(deg) {
    return (await deg) * (Math.PI / 180);
  }

  public async markBlock(userId: string, token: string, reason: BlockUserReason) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    const blockUser: User | any = await this.userRepository.findOneBy({ id: userId });
    if (!user || !blockUser) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const existingBlock = await this.entity.findOne(Block, {
      where: { userId: user.id, blocked: { id: blockUser.id } },
    });
    if (existingBlock) {
      await this.entity.update(Block, { userId: user.id, blocked: { id: blockUser.id } }, { status: true });
    } else {
      const block = new Block();
      block.userId = user.id;
      block.blocked = blockUser;
      block.status = true;
      block.reason = getBlockReason(reason);
      await this.entity.save(Block, block);
    }
  }

  public async getBlocked(token: string) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    if (user == null) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const blocks = await this.entity.find(Block, {
      where: {
        userId: user.id,
        status: true,
      },
      relations: ['blocked'],
    });
    blocks.forEach((block: any) => {
      delete block.blocked.password;
      delete block.blocked.transaction;
      delete block.blocked.visits;
      delete block.blocked.favorite;
    });
    return blocks;
  }

  public async removeBlocked(userId: string, token: string) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    const blockUser: User | any = await this.userRepository.findOneBy({ id: userId });
    if (!user || !blockUser) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const existingBlock = await this.entity.findOne(Block, {
      where: { userId: user.id, blocked: { id: blockUser.id }, status: true },
    });
    if (existingBlock) {
      await this.entity.update(Block, { userId: user.id, blocked: { id: blockUser.id } }, { status: false });
    }
  }

  public async validateAndUpdatePassword(currentPassword: string, newPassword: string, user: User) {
    const isPasswordValid = this.helper.isPasswordValid(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Wrong Password', HttpStatus.CONFLICT);
    }
    const hashedPassword = await this.helper.encodePassword(newPassword);
    await this.userRepository.update({ id: user.id }, { password: hashedPassword });
  }

  async convertToBase64(image: string | any, user: User) {
    const imageData = fs.readFileSync(image);
    return imageData.toString('base64');
  }

  async saveMultiplePhotosToDB(photosPaths, photos, user: User, folder: string) {
    for (const photo of photos) {
      const photoPath = await this.savePhoto(photo, folder);
      photosPaths.push(photoPath);
    }

    if (photosPaths.length > 0) {
      for (const photoPath of photosPaths) {
        const photo = new Photo();
        photo.photos = photoPath;
        photo.user = user; // Associate the photo with the user
        user.photos?.push(photo);
        await this.entity.save(Photo, photo);
      }
    }
    await this.userRepository.save(user);
  }

  public async removeUser(token: string) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const user = decoded ? await this.helper.validateUser(decoded) : null;
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    } else {
      const deletedUser = await this.userRepository.update({ id: user.id }, { disable: true });
      let message = '';
      if (deletedUser) {
        message = 'Account Deleted';
      } else {
        message = 'Something went wrong';
      }
      return new GlobalResponseDto(message);
    }
  }

  public async removePhoto(id: string, token: string) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    let user: User | any = decoded ? await this.helper.validateUser(decoded) : null;
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    } else {
      await this.entity.delete(Photo, {
        id,
      });
      user = await this.userRepository.findOne({ where: { id: user.id } });
      delete user.password;
      return user;
    }
  }

  public async contactSupport(body: ContactSupportDto): Promise<GlobalResponseDto> {
    const { token, theme, message } = body;
    if (token) {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      } else {
        const admin: User = await this.userRepository.findOneBy({ role: UserRoleEnum.ADMIN });
        await this.addContactRecord(body.message, user);
        this.mailService.sendSupportMail(
          theme,
          {
            firstName: user.userName,
            message: message,
            email: user.email,
          },
          admin.email
        );
        return new GlobalResponseDto('Your message has been sent Successfully!');
      }
    } else {
      const admin: User = await this.userRepository.findOneBy({ role: UserRoleEnum.ADMIN });
      await this.addContactRecord(body.message);
      this.mailService.sendSupportMail(
        body.theme,
        {
          firstName: body.email,
          message: body.message,
          email: body.email,
        },
        admin.email
      );
      return new GlobalResponseDto('Your message has been sent Successfully!');
    }
  }

  async addContactRecord(message: string, user?: User) {
    try {
      const contactSupport = new ContactSupport();
      contactSupport.query = message;
      contactSupport.user = user;
      await this.entity.save(ContactSupport, contactSupport);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  public async demoUsers() {
    for (let i = 0; i < 10; i++) {
      const hashedPassword: string = await bcrypt.hash('password', 10);
      const selfGenderArray = [UserSelfGenderEnum.MALE, UserSelfGenderEnum.FEMALE];
      const selfGender = selfGenderArray[Math.floor(Math.random() * selfGenderArray.length)];
      const interestedGenderArray = [UserInterestedGenderEnum.MALE, UserInterestedGenderEnum.FEMALE];
      const interestedGender = interestedGenderArray[Math.floor(Math.random() * interestedGenderArray.length)];
      const user: User | any = new User();
      user.userName = randUserName();
      user.firstName = randFirstName();
      user.lastName = randLastName();
      user.email = randEmail();
      user.password = hashedPassword;
      user.selfGender = selfGender;
      user.interestedGender = interestedGender;
      user.status = UserStatusEnum.VERIFIED;
      const profile = this.entity.save(CustomerProfileData, { user });
      user.profile = profile as any;
      await this.userRepository.save(user);
    }
  }

  public async getCoins(token: string) {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue as string); // verify access token and get user from db
    const user: User = decoded ? await this.helper.validateUser(decoded) : null;
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    } else {
      return await this.getCurrentCoinsFromDB(user);
    }
  }

  public async makeTransaction(
    token: string,
    actionType: TransactionActionTypes,
    receiverId?: string,
    subAction?: string,
    bonus?: string
  ): Promise<{ success: boolean }> {
    token = token.includes('Bearer') ? token.split(' ')[1] : token;
    const decoded = await this.helper.decode(token as string);
    const user: User = decoded ? await this.helper.validateUser(decoded) : null;
    const receiver = await this.getCustomer(receiverId);
    let res = null;
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    if (!receiver) throw new HttpException('Receiver not found!', HttpStatus.NOT_FOUND);
    const currentCoins = await this.getCurrentCoinsFromDB(user);
    if (actionType === TransactionActionTypes.BONUSCODE) {
      const valid = await this.helper.verifyBonusCode(`Bearer ${token}`, bonus);
      const bonusCode = await this.helper.getBonusCode(`Bearer ${token}`, null, bonus);
      if (valid) {
        const foundBonus = await this.helper.useBonusCode(user, bonusCode);
        if (foundBonus) {
          res = await this.addTransactions(
            actionType,
            user,
            this.entity,
            UserAccountTransaction,
            UserTransactionActionTypes,
            currentCoins + bonusCode.coins,
            bonusCode.coins
          );
          return res ? { success: true } : { success: false };
        }
      }
    }

    if (actionType === TransactionActionTypes.VIEWPHOTO) {
      const visit = await this.markUserAsSeenInProfileVisits(receiverId, user?.id);
      if (visit) {
        res = await this.addTransactions(
          actionType,
          user,
          this.entity,
          UserAccountTransaction,
          UserTransactionActionTypes,
          currentCoins
        );
        return res ? { success: true } : { success: false };
      }
    }

    res =
      actionType === TransactionActionTypes.SENDEMOJI || actionType === TransactionActionTypes.SENDGIFT
        ? await this.processEmojiGiftTransaction(
            user,
            receiver,
            actionType,
            subAction,
            this.entity,
            UserAccountTransaction,
            UserTransactionActionTypes
          )
        : await this.addTransactions(
            actionType,
            user,
            this.entity,
            UserAccountTransaction,
            UserTransactionActionTypes,
            currentCoins
          );

    return res ? { success: true } : { success: false };
  }

  public async processEmojiGiftTransaction(
    sender: User,
    receiver: User,
    action: TransactionActionTypes,
    subAction: string,
    entity: EntityManager,
    tableTransactions: any,
    tableActionTypes: any
  ) {
    const senderCurrentCoins = await this.getCurrentCoinsFromDB(sender);
    const receiverCurrentCoins = await this.getCurrentCoinsFromDB(receiver);
    const cost: number = await this.getActionTypeCostFromDB(subAction);
    if (Math.abs(cost) <= senderCurrentCoins) {
      await this.addTransactions(
        action === TransactionActionTypes.SENDEMOJI ? action : subAction,
        sender,
        entity,
        tableTransactions,
        tableActionTypes,
        senderCurrentCoins
      );
      const actionType = await this.entity.findOne(UserTransactionActionTypes, {
        where: { actionType: `Receive${subAction}` },
      });

      await this.addTransactions(
        action === TransactionActionTypes.SENDEMOJI ? TransactionActionTypes.RECEIVEEMOJI : actionType?.actionType,
        receiver,
        entity,
        tableTransactions,
        tableActionTypes,
        receiverCurrentCoins
      );
      return { success: true };
    } else {
      throw new HttpException('Sender balance is not enough!', HttpStatus.PAYMENT_REQUIRED);
    }
  }

  public async addTransactions(
    action: TransactionActionTypes | string,
    user: User | any,
    entity: EntityManager,
    tableTransactions: any,
    tableActionTypes: any,
    currentCoins?: number,
    bonusCost?: number
  ) {
    const amount: number = await this.getActionTypeCostFromDB(action);
    const cost = bonusCost > 0 ? bonusCost : amount;

    if (action !== TransactionActionTypes.ACCOUNTCREATION) {
      const isReceiver = action === TransactionActionTypes.RECEIVEEMOJI || action.includes('Receive');
      let newCurrentCoins = currentCoins;
      if ((amount < 0 && currentCoins > 0 && Math.abs(amount) <= currentCoins) || amount > 0 || isReceiver) {
        const actionType: any = await entity.findOne(tableActionTypes, { where: { actionType: action } });
        if (
          action === TransactionActionTypes.MOBILENUMBER ||
          action === TransactionActionTypes.EMAILCONFIRMED ||
          action === TransactionActionTypes.AVATARUPLOADED ||
          action === TransactionActionTypes.PROFILEVERIFIED
        ) {
          newCurrentCoins = currentCoins;
        } else {
          newCurrentCoins += cost;
        }
        const obj = {
          user,
          cost,
          currentCoins: newCurrentCoins,
          actionType,
        };
        const transaction: IUserAccountTransaction = entity.create(tableTransactions, obj);
        return await entity.save(tableTransactions, transaction);
      } else if (action === TransactionActionTypes.BONUSCODE) {
        const actionType: any = await entity.findOne(tableActionTypes, { where: { actionType: action } });
        const obj = {
          user,
          cost,
          currentCoins: newCurrentCoins,
          actionType,
        };
        const transaction: IUserAccountTransaction = entity.create(tableTransactions, obj);
        return await entity.save(tableTransactions, transaction);
      } else {
        throw new HttpException('Current Balance is not Enough!', HttpStatus.PAYMENT_REQUIRED);
      }
    } else {
      const actionType = await entity.findOne(tableActionTypes, { where: { actionType: action } });
      const obj = {
        user,
        cost,
        currentCoins: cost,
        actionType,
      };
      const transaction: IUserAccountTransaction = entity.create(tableTransactions, obj);
      return await entity.save(tableTransactions, transaction);
    }
  }

  public async markUserAsSeenInProfileVisits(visitorId: string, visitedId: string) {
    const visit = await this.entity.findOne(VisitProfile, {
      where: {
        visited: { id: visitedId },
        visitor: { id: visitorId },
      },
    });
    if (!visit) {
      throw new HttpException('Profile visits not found', HttpStatus.NOT_FOUND);
    } else {
      visit.seen = true;
      return await this.entity.save(VisitProfile, visit);
    }
  }

  async randomlySetOnline(users: User[]) {
    return users?.map((user) => {
      if (user.role === UserRoleEnum.FAKE && !user.online) {
        const isOnline = Math.random() >= 0.5;
        return {
          ...user,
          online: isOnline,
        };
      } else {
        return user;
      }
    });
  }

  scheduleRandomlySetOnline() {
    schedule.scheduleJob('0 0 * * *', async () => {
      try {
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({ online: () => 'RAND() > 0.5' })
          .where('online = true')
          .andWhere('role = :role', { role: UserRoleEnum.FAKE })
          .execute();

        const offlineUsers = await this.userRepository
          .createQueryBuilder()
          .select()
          .where('online = false')
          .andWhere('role = :role', { role: UserRoleEnum.FAKE })
          .andWhere((qb) => {
            const subQuery = qb
              .subQuery()
              .select('id')
              .from(User, 'user')
              .where('online = true')
              .andWhere('role = :role', { role: UserRoleEnum.FAKE })
              .getQuery();
            return 'id NOT IN ' + subQuery;
          })
          .orderBy('RAND()')
          .limit(5)
          .getMany();
        if (offlineUsers.length > 0) {
          await this.userRepository
            .createQueryBuilder()
            .update(User)
            .set({ online: () => 'RAND() > 0.5' })
            .where('id IN (:...userIds)', { userIds: offlineUsers.map((user) => user.id) })
            .execute();
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    });
  }

  scheduleRandomVisit() {
    schedule.scheduleJob('0 */10 * * *', async () => {
      // schedule.scheduleJob('* * * * * *', async () => {
      try {
        const randomFakeUser = await this.userRepository
          .createQueryBuilder('user')
          .select()
          .orderBy('RAND()')
          .where('user.role =:role', { role: UserRoleEnum.FAKE })
          .limit(1)
          .getOne();
        const users = await this.userRepository.findBy({
          role: UserRoleEnum.CUSTOMER,
          status: UserStatusEnum.VERIFIED,
        });
        users.forEach(async (user) => {
          const existingVisit = await this.entity.findOne(VisitProfile, {
            where: {
              visited: { id: user.id },
              visitor: { id: randomFakeUser.id },
            },
          });
          if (existingVisit) {
            existingVisit.timestamp = new Date();
            return await this.entity.save(existingVisit);
          } else {
            const visit = new VisitProfile();
            visit.visited = user;
            visit.visitor = randomFakeUser;
            const notification = new Notifications();
            notification.category = NotificationAction.VISITED;
            notification.seen = false;
            notification.notifier = randomFakeUser;
            notification.notified = user;
            const message = `${randomFakeUser.userName} ${notification.category.toLowerCase()} your profile`;
            notification.message = message;
            await this.entity.save(Notifications, notification);
            await this.entity.save(VisitProfile, visit);
          }
        });
      } catch (error) {
        console.error('An error occurred:', error);
      }
    });
  }

  public async getNotifications(token: string, params: GetNotificationsQueryParamsDto) {
    try {
      const { page, pageSize } = params;
      let pageNo;
      let limit = parseInt(pageSize);
      if (page) {
        pageNo = parseInt(page);
      } else {
        pageNo = 1;
      }
      limit = limit <= 10 ? limit : 10;
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
      const query = this.entity
        .createQueryBuilder(Notifications, 'notifications')
        .leftJoinAndSelect('notifications.notifier', 'notifier')
        .where('notifications.notified.id = :userId', { userId: user.id })
        .andWhere('notifications.seen = :seen', { seen: false });

      const [notifications, totalCount]: any = await query
        .skip((pageNo - 1) * limit)
        .take(limit)
        .getManyAndCount();
      const hasNextPage = totalCount > pageNo * limit;
      const nextPage: number = hasNextPage ? pageNo + 1 : null;
      const queryCount = await this.entity
        .createQueryBuilder(Notifications, 'notifications')
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
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async seenNotification(token: string, id: string) {
    try {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
      const notification = await this.entity.findOne(Notifications, {
        where: {
          id,
          notified: { id: user.id },
        },
      });
      if (!notification) throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
      notification.seen = true;
      await this.entity.save(Notifications, notification);
      const query = await this.entity
        .createQueryBuilder(Notifications, 'notifications')
        .leftJoinAndSelect('notifications.notifier', 'notifier')
        .where('notifications.notified.id = :userId', { userId: user.id })
        .andWhere('notifications.seen = :seen', { seen: false })
        .getMany();
      const newArr = [...query, { count: query.length }];
      return newArr;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async seenNotifications(token: string) {
    try {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
      const notifications = await this.entity.find(Notifications, {
        where: {
          notified: { id: user.id },
        },
      });
      if (!notifications) throw new HttpException('Notifications not found', HttpStatus.NOT_FOUND);
      notifications.forEach((notification) => (notification.seen = true));
      await this.entity.save(Notifications, notifications);
      const query = await this.entity
        .createQueryBuilder(Notifications, 'notifications')
        .leftJoinAndSelect('notifications.notifier', 'notifier')
        .where('notifications.notified.id = :userId', { userId: user.id })
        .andWhere('notifications.seen = :seen', { seen: false })
        .getMany();
      const newArr = [...query, { count: query.length }];
      return newArr;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
