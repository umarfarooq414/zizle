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
exports.FakeService = void 0;
const fakeUser_entity_1 = require("./../user/entities/fakeUser.entity");
const user_1 = require("./../../../libs/types/src/db/entities/user");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_helper_1 = require("../auth/auth.helper");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const types_1 = require("../../../libs/types/src");
const customer_profiledata_entity_1 = require("../user/entities/customer.profiledata.entity");
const user_service_1 = require("../user/user.service");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const bcrypt = require("bcryptjs");
const falso_1 = require("@ngneat/falso");
let FakeService = class FakeService {
    constructor(userRepository, profile, fakeCreator, helper, userService, cloudinary) {
        this.userRepository = userRepository;
        this.profile = profile;
        this.fakeCreator = fakeCreator;
        this.helper = helper;
        this.userService = userService;
        this.cloudinary = cloudinary;
    }
    async createFake(accessToken, body, files) {
        const accessTokenValue = accessToken.split(' ')[1];
        const decodedToken = await this.helper.decode(accessTokenValue);
        const user = decodedToken ? await this.helper.validateUser(decodedToken) : null;
        const find = await this.userRepository.findOne({ where: { email: body.email } });
        if (find)
            throw new common_1.HttpException('User already Exists!', common_1.HttpStatus.CONFLICT);
        if (!user) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
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
            avatarPath = await this.userService.savePhoto(avatar, 'fake');
        }
        const fakeUser = new user_entity_1.User({
            role: types_1.UserRoleEnum.FAKE,
            status: types_1.UserStatusEnum.VERIFIED,
            selfGender: body.selfGender,
            interestedGender: body.interestedGender,
            userName: body.userName,
            email: body.email,
        });
        if (fakeUser) {
            const profile = new customer_profiledata_entity_1.CustomerProfileData();
            profile.children = body.children;
            profile.isEmailVerified = types_1.UserStatusEnum.VERIFIED;
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
                const creator = new fakeUser_entity_1.FakeCreator();
                creator.user = savedUser;
                creator.createdBy = user === null || user === void 0 ? void 0 : user.id;
                await this.fakeCreator.save(creator);
                savedUser.address = await this.userService.validateAndSaveAddress(body.postalCode, savedUser);
            }
        }
    }
    async findAll() {
        const result = await this.userRepository.find({ where: { role: types_1.UserRoleEnum.FAKE } });
        return result;
    }
    async findOne(id) {
        const fake = await this.userRepository.findOneBy({ id, role: types_1.UserRoleEnum.FAKE });
        if (fake == null) {
            throw new common_1.HttpException('Fake Account not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return fake;
    }
    async updateById(id, body, files) {
        var _a;
        const fake = await this.userRepository.findOneBy({ id, role: types_1.UserRoleEnum.FAKE });
        if (fake == null) {
            throw new common_1.HttpException('Fake Account not found!', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            const pid = (_a = fake === null || fake === void 0 ? void 0 : fake.profile) === null || _a === void 0 ? void 0 : _a.id;
            const data = await this.profile.findOneBy({ id: pid });
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
                avatarPath = await this.userService.savePhoto(avatar, 'fake');
            }
            if (plainFile === null || plainFile === void 0 ? void 0 : plainFile.photos) {
                await this.userService.saveMultiplePhotosToDB(photosPaths, plainFile.photos, fake, 'fake');
            }
            if (body.userName)
                fake.setUserName(body.userName);
            if (body.email)
                fake.setEmail(body.email);
            if (body.selfGender)
                fake.setSelfGender(body.selfGender);
            if (body.dob) {
                await this.userService.validateAndSaveDOB(data, body.dob);
            }
            if (avatarPath) {
                data.setAvatarUrl(avatarPath);
            }
            if (body.smoker)
                data.setSmoker(body.smoker);
            if (body.relationshipStatus)
                data.setRelationShipStatus(body.relationshipStatus);
            if (body.postalCode)
                fake.address.setAddress(body.postalCode);
            if (body.life)
                data.setLife(body.life);
            if (body.children)
                data.setChildren(body.children);
            if (body.mobileNumber)
                data.setMobileNumber(body.mobileNumber);
            if (body.profileText)
                data.setProfileText(body.profileText);
            await this.userRepository.save(fake);
            await this.profile.save(data);
            return await this.userRepository.findOne({ where: { id: fake.id } });
        }
    }
    async deleteById(id) {
        const fake = await this.userRepository.findOneBy({ id, role: types_1.UserRoleEnum.FAKE });
        if (fake == null) {
            throw new common_1.HttpException('Fake Account not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return await this.userRepository.remove(fake);
    }
    async getRandomFake() {
        const randomUser = await this.userRepository
            .createQueryBuilder('user')
            .select()
            .orderBy('RAND()')
            .where('user.role =:role', { role: types_1.UserRoleEnum.FAKE })
            .limit(1)
            .getOne();
        return randomUser;
    }
    generateRandomMessage() {
        const messages = ['Hey, wanna catch up?', 'Hi there! How are you doing?', 'Hello! Are you new here?'];
        const index = Math.floor(Math.random() * (messages === null || messages === void 0 ? void 0 : messages.length));
        return messages[index];
    }
    generateRandomTimeInterval() {
        const min = 1;
        const max = 5;
        return Math.floor(Math.random() * (max - min + 1) + min) * 60 * 1000;
    }
    async validateDateOfBirth(dob) {
        const [year, month, day] = dob.split('-');
        const parsedDateOfBirth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const now = new Date();
        const ageInMs = now.getTime() - parsedDateOfBirth.getTime();
        const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
        if (ageInYears >= 18 && ageInYears <= 65) {
            return parsedDateOfBirth;
        }
        else {
            throw new common_1.HttpException('Invalid date of birth', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createDynamicFakes(token, body) {
        try {
            console.log(body);
            const profileTextArray = [
                'Adventurous spirit, always chasing the next adrenaline rush.',
                'Bookworm by day, dreamer by night, with a passion for storytelling.',
                'Empowering women, one stride at a time.',
                "Lost in the world of art, painting her way through life's colors.",
                'Avid foodie, searching for the perfect blend of flavors.',
                'Nature lover, finding solace in the beauty of the great outdoors.',
                'Dancing through life with grace and rhythm.',
                'Bold and fierce, breaking down barriers with every step.',
                'Geeky chic with a love for all things tech.',
                "Life is a stage, and she's the leading lady stealing the show.'",
            ];
            const { gender, startAge, endAge } = body;
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const user = decoded ? await this.helper.validateUser(decoded) : null;
            if (!user) {
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            }
            if (user.role !== types_1.UserRoleEnum.ADMIN) {
                throw new common_1.HttpException('User must be Admin!', common_1.HttpStatus.NOT_FOUND);
            }
            const randAge = this.generateRandomDOB(startAge, endAge);
            for (let i = 0; i < 10; i++) {
                const hashedPassword = await bcrypt.hash('password', 10);
                const interestedGenderArray = [user_1.UserInterestedGenderEnum.MALE, user_1.UserInterestedGenderEnum.FEMALE];
                const interestedGender = interestedGenderArray[Math.floor(Math.random() * interestedGenderArray.length)];
                const relationshipStatusArray = [
                    user_1.CustomerRelationShipStatus.DIVORCED,
                    user_1.CustomerRelationShipStatus.IN_A_RELATIONSHIP,
                    user_1.CustomerRelationShipStatus.ITS_COMPLICATED,
                    user_1.CustomerRelationShipStatus.MARRIED,
                    user_1.CustomerRelationShipStatus.OPEN_RELATIONSHIP,
                    user_1.CustomerRelationShipStatus.SINGLE,
                    user_1.CustomerRelationShipStatus.WIDOWED,
                ];
                const randProfile = profileTextArray[Math.floor(Math.random() * profileTextArray.length)];
                const relationshipStatus = relationshipStatusArray[Math.floor(Math.random() * relationshipStatusArray.length)];
                const childrenStatusArray = [user_1.CustomerChildrenEnum.NO, user_1.CustomerChildrenEnum.YES];
                const childrenStatus = childrenStatusArray[Math.floor(Math.random() * childrenStatusArray.length)];
                const smokerStatusArray = [user_1.CustomerSmokeStatus.NO, user_1.CustomerSmokeStatus.YES, user_1.CustomerSmokeStatus.OCCASIONALLY];
                const smokerStatus = smokerStatusArray[Math.floor(Math.random() * smokerStatusArray.length)];
                const lifeStatusArray = [
                    user_1.CustomerLifeStatus.ALONE,
                    user_1.CustomerLifeStatus.AT_PARENTS,
                    user_1.CustomerLifeStatus.FLAT_SHARE,
                    user_1.CustomerLifeStatus.MISCELLANEOUS,
                    user_1.CustomerLifeStatus.WITH_PARTNER,
                ];
                const lifeStatus = lifeStatusArray[Math.floor(Math.random() * lifeStatusArray.length)];
                const user = new user_entity_1.User();
                user.userName = (0, falso_1.randUserName)();
                user.firstName = (0, falso_1.randFirstName)();
                user.lastName = (0, falso_1.randLastName)();
                user.email = (0, falso_1.randEmail)();
                user.password = hashedPassword;
                user.selfGender = gender;
                user.interestedGender = interestedGender;
                user.status = types_1.UserStatusEnum.VERIFIED;
                user.role = types_1.UserRoleEnum.FAKE;
                const profile = new customer_profiledata_entity_1.CustomerProfileData();
                profile.children = childrenStatus;
                profile.isEmailVerified = types_1.UserStatusEnum.VERIFIED;
                profile.life = lifeStatus;
                profile.mobileNumber = (0, falso_1.randPhoneNumber)();
                profile.relationshipStatus = relationshipStatus;
                profile.smoker = smokerStatus;
                profile.profileText = randProfile;
                profile.dateOfBirth = randAge;
                const savedProfile = await this.profile.save(profile);
                user.profile = savedProfile;
                const savedUser = await this.userRepository.save(user);
                if (savedUser) {
                    const creator = new fakeUser_entity_1.FakeCreator();
                    creator.user = savedUser;
                    creator.createdBy = user === null || user === void 0 ? void 0 : user.id;
                    await this.fakeCreator.save(creator);
                    try {
                        savedUser.address = await this.userService.validateAndSaveAddress((0, falso_1.randZipCode)(), savedUser);
                    }
                    catch (error) {
                    }
                }
            }
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    generateRandomDOB(startAge, endAge) {
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
};
FakeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_profiledata_entity_1.CustomerProfileData)),
    __param(2, (0, typeorm_1.InjectRepository)(fakeUser_entity_1.FakeCreator)),
    __param(3, (0, common_1.Inject)(auth_helper_1.AuthHelper)),
    __param(4, (0, common_1.Inject)(user_service_1.UserService)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_helper_1.AuthHelper,
        user_service_1.UserService,
        cloudinary_config_1.CloudinaryConfigService])
], FakeService);
exports.FakeService = FakeService;
//# sourceMappingURL=fake.service.js.map