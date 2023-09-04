import { FakeCreator } from './../user/entities/fakeUser.entity';
import {
  CustomerChildrenEnum,
  CustomerLifeStatus,
  CustomerRelationShipStatus,
  CustomerSmokeStatus,
  UserInterestedGenderEnum,
  UserSelfGenderEnum,
} from './../../../libs/types/src/db/entities/user';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthHelper } from '../auth/auth.helper';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRoleEnum, UserStatusEnum } from '@lib/types';
import { CreateDynamicFakeRequestDto, type CreateFakeRequestDto, type UpdateFakeRequestDto } from '@lib/dtos';
import { CustomerProfileData } from '../user/entities/customer.profiledata.entity';
import { UserService } from '../user/user.service';
import { CloudinaryConfigService } from '@config/cloudinary.config';
import * as bcrypt from 'bcryptjs';
import {
  randEmail,
  randFirstName,
  randLastName,
  randUserName,
  randPhoneNumber,
  randCity,
  randZipCode,
  randImg,
  randFilePath,
  randAvatar,
} from '@ngneat/falso';

@Injectable()
export class FakeService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CustomerProfileData)
    private readonly profile: Repository<CustomerProfileData>,
    @InjectRepository(FakeCreator)
    private readonly fakeCreator: Repository<FakeCreator>,
    @Inject(AuthHelper)
    private readonly helper: AuthHelper,
    @Inject(UserService)
    private readonly userService: UserService,
    private cloudinary: CloudinaryConfigService
  ) {}

  public async createFake(accessToken: string, body: CreateFakeRequestDto, files) {
    const accessTokenValue = accessToken.split(' ')[1];
    const decodedToken = await this.helper.decode(accessTokenValue);
    const user = decodedToken ? await this.helper.validateUser(decodedToken) : null;
    const find = await this.userRepository.findOne({ where: { email: body.email } });
    if (find) throw new HttpException('User already Exists!', HttpStatus.CONFLICT);
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
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
      avatarPath = await this.userService.savePhoto(avatar, 'fake');
    }
    const fakeUser = new User({
      role: UserRoleEnum.FAKE,
      status: UserStatusEnum.VERIFIED,
      selfGender: body.selfGender,
      interestedGender: body.interestedGender,
      userName: body.userName,
      email: body.email,
    });
    if (fakeUser) {
      const profile = new CustomerProfileData();
      profile.children = body.children;
      profile.isEmailVerified = UserStatusEnum.VERIFIED;
      profile.life = body.life;
      profile.relationshipStatus = body.relationshipStatus;
      profile.smoker = body.smoker;
      profile.profileText = body.profileText;
      profile.mobileNumber = body.mobileNumber;
      if (body.dob) {
        profile.dateOfBirth = await this.validateDateOfBirth(body.dob);
      }

      if (avatarPath) {
        profile.avatarUrl = avatarPath;
      }
      if (profile) {
        fakeUser.profile = profile;
        await this.profile.save(profile);
      }
      const savedUser = await this.userRepository.save(fakeUser);
      if (photos) {
        await this.userService.saveMultiplePhotosToDB(photosPaths, photos, savedUser, 'fake');
      }
      if (savedUser) {
        const creator = new FakeCreator();
        creator.user = savedUser;
        creator.createdBy = user?.id;

        await this.fakeCreator.save(creator);

        savedUser.address = await this.userService.validateAndSaveAddress(body.postalCode, savedUser);

        // return savedUser;
      }
    }
  }

  public async findAll() {
    const result: User[] = await this.userRepository.find({ where: { role: UserRoleEnum.FAKE } });
    return result;
  }

  public async findOne(id: string) {
    const fake: User = await this.userRepository.findOneBy({ id, role: UserRoleEnum.FAKE });
    if (fake == null) {
      throw new HttpException('Fake Account not found!', HttpStatus.NOT_FOUND);
    }
    return fake;
  }

  public async updateById(id: string, body: UpdateFakeRequestDto, files): Promise<User> {
    const fake = await this.userRepository.findOneBy({ id, role: UserRoleEnum.FAKE });
    if (fake == null) {
      throw new HttpException('Fake Account not found!', HttpStatus.NOT_FOUND);
    } else {
      const pid = fake?.profile?.id;
      const data = await this.profile.findOneBy({ id: pid });
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
        avatarPath = await this.userService.savePhoto(avatar, 'fake');
      }
      if (plainFile?.photos) {
        await this.userService.saveMultiplePhotosToDB(photosPaths, plainFile.photos, fake, 'fake');
      }
      if (body.userName) fake.setUserName(body.userName);
      if (body.email) fake.setEmail(body.email);
      if (body.selfGender) fake.setSelfGender(body.selfGender);
      if (body.dob) {
        await this.userService.validateAndSaveDOB(data, body.dob);
      }

      if (avatarPath) {
        data.setAvatarUrl(avatarPath);
      }
      if (body.smoker) data.setSmoker(body.smoker);
      if (body.relationshipStatus) data.setRelationShipStatus(body.relationshipStatus);
      if (body.postalCode) fake.address.setAddress(body.postalCode);
      if (body.life) data.setLife(body.life);
      if (body.children) data.setChildren(body.children);
      if (body.mobileNumber) data.setMobileNumber(body.mobileNumber);
      if (body.profileText) data.setProfileText(body.profileText);
      await this.userRepository.save(fake);
      await this.profile.save(data);
      return await this.userRepository.findOne({ where: { id: fake.id } });
    }
  }

  public async deleteById(id: string) {
    const fake = await this.userRepository.findOneBy({ id, role: UserRoleEnum.FAKE });
    if (fake == null) {
      throw new HttpException('Fake Account not found!', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.remove(fake);
  }

  public async getRandomFake() {
    const randomUser = await this.userRepository
      .createQueryBuilder('user')
      .select()
      .orderBy('RAND()')
      .where('user.role =:role', { role: UserRoleEnum.FAKE })
      .limit(1)
      .getOne();
    return randomUser;
    // });
  }

  generateRandomMessage(): string {
    const messages: string[] = ['Hey, wanna catch up?', 'Hi there! How are you doing?', 'Hello! Are you new here?'];
    const index = Math.floor(Math.random() * messages?.length);
    return messages[index];
  }

  generateRandomTimeInterval(): number {
    const min = 1;
    const max = 5;
    return Math.floor(Math.random() * (max - min + 1) + min) * 60 * 1000;
  }

  async validateDateOfBirth(dob) {
    const [year, month, day] = dob.split('-');
    // The correct order is year, month, and day
    const parsedDateOfBirth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const now = new Date();
    const ageInMs: number = now.getTime() - parsedDateOfBirth.getTime();
    const ageInYears: number = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
    // 365.25 days in a year to account for leap years

    if (ageInYears >= 18 && ageInYears <= 65) {
      // date of birth is valid
      return parsedDateOfBirth;
    } else {
      throw new HttpException('Invalid date of birth', HttpStatus.BAD_REQUEST);
    }
  }

  async createDynamicFakes(token: string, body: CreateDynamicFakeRequestDto) {
    try {
      console.log(body)
      const profileTextArray = [
        'Adventurous spirit, always chasing the next adrenaline rush.',
        'Bookworm by day, dreamer by night, with a passion for storytelling.',
        'Empowering women, one stride at a time.',
        // eslint-disable-next-line quotes
        "Lost in the world of art, painting her way through life's colors.",
        'Avid foodie, searching for the perfect blend of flavors.',
        'Nature lover, finding solace in the beauty of the great outdoors.',
        'Dancing through life with grace and rhythm.',
        'Bold and fierce, breaking down barriers with every step.',
        'Geeky chic with a love for all things tech.',
        // eslint-disable-next-line quotes
        "Life is a stage, and she's the leading lady stealing the show.'",
      ];
      const { gender, startAge, endAge } = body;
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const user: User = decoded ? await this.helper.validateUser(decoded) : null;
      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
      if (user.role !== UserRoleEnum.ADMIN) {
        throw new HttpException('User must be Admin!', HttpStatus.NOT_FOUND);
      }
      const randAge = this.generateRandomDOB(startAge, endAge);
      for (let i = 0; i < 10; i++) {
        const hashedPassword: string = await bcrypt.hash('password', 10);
        const interestedGenderArray = [UserInterestedGenderEnum.MALE, UserInterestedGenderEnum.FEMALE];
        const interestedGender = interestedGenderArray[Math.floor(Math.random() * interestedGenderArray.length)];
        const relationshipStatusArray = [
          CustomerRelationShipStatus.DIVORCED,
          CustomerRelationShipStatus.IN_A_RELATIONSHIP,
          CustomerRelationShipStatus.ITS_COMPLICATED,
          CustomerRelationShipStatus.MARRIED,
          CustomerRelationShipStatus.OPEN_RELATIONSHIP,
          CustomerRelationShipStatus.SINGLE,
          CustomerRelationShipStatus.WIDOWED,
        ];
        const randProfile = profileTextArray[Math.floor(Math.random() * profileTextArray.length)];
        const relationshipStatus = relationshipStatusArray[Math.floor(Math.random() * relationshipStatusArray.length)];
        const childrenStatusArray = [CustomerChildrenEnum.NO, CustomerChildrenEnum.YES];
        const childrenStatus = childrenStatusArray[Math.floor(Math.random() * childrenStatusArray.length)];
        const smokerStatusArray = [CustomerSmokeStatus.NO, CustomerSmokeStatus.YES, CustomerSmokeStatus.OCCASIONALLY];
        const smokerStatus = smokerStatusArray[Math.floor(Math.random() * smokerStatusArray.length)];
        const lifeStatusArray = [
          CustomerLifeStatus.ALONE,
          CustomerLifeStatus.AT_PARENTS,
          CustomerLifeStatus.FLAT_SHARE,
          CustomerLifeStatus.MISCELLANEOUS,
          CustomerLifeStatus.WITH_PARTNER,
        ];
        const lifeStatus = lifeStatusArray[Math.floor(Math.random() * lifeStatusArray.length)];
        const user: User = new User();
        user.userName = randUserName();
        user.firstName = randFirstName();
        user.lastName = randLastName();
        user.email = randEmail();
        user.password = hashedPassword;
        user.selfGender = gender;
        user.interestedGender = interestedGender;
        user.status = UserStatusEnum.VERIFIED;
        user.role = UserRoleEnum.FAKE;
        const profile = new CustomerProfileData();
        profile.children = childrenStatus;
        profile.isEmailVerified = UserStatusEnum.VERIFIED;
        profile.life = lifeStatus;
        profile.mobileNumber = randPhoneNumber();
        profile.relationshipStatus = relationshipStatus;
        profile.smoker = smokerStatus;
        profile.profileText = randProfile;
        profile.dateOfBirth = randAge;

        const savedProfile = await this.profile.save(profile);
        user.profile = savedProfile;
        const savedUser = await this.userRepository.save(user);
        if (savedUser) {
          const creator = new FakeCreator();
          creator.user = savedUser;
          creator.createdBy = user?.id;

          await this.fakeCreator.save(creator);
          try {
            savedUser.address = await this.userService.validateAndSaveAddress(randZipCode(), savedUser);
          } catch (error) {
            // console.error('Error storing address:', error);
          }
        }
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  generateRandomDOB(startAge: number, endAge: number) {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - endAge;
    const endYear = currentYear - startAge;

    const birthYear = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;

    const birthMonth = Math.floor(Math.random() * 12);

    const daysInMonth = new Date(birthYear, birthMonth + 1, 0).getDate();
    const birthDay = Math.floor(Math.random() * daysInMonth) + 1;

    const formattedDOB = new Date(birthYear, birthMonth, birthDay);

    return formattedDOB;
  }
}
