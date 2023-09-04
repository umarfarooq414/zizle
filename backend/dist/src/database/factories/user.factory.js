"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customer_profiledata_entity_1 = require("./../../modules/user/entities/customer.profiledata.entity");
const typeorm_seeding_1 = require("typeorm-seeding");
const falso_1 = require("@ngneat/falso");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../../modules/user/entities/user.entity");
const src_1 = require("../../../libs/types/src");
const typeorm_1 = require("typeorm");
(0, typeorm_seeding_1.define)(user_entity_1.User, () => {
    const profileRepo = (0, typeorm_1.getConnection)().getRepository(customer_profiledata_entity_1.CustomerProfileData);
    const hashedPassword = bcrypt.hash('password', 10);
    const selfGenderArray = [src_1.UserSelfGenderEnum.MALE, src_1.UserSelfGenderEnum.FEMALE];
    const selfGender = selfGenderArray[Math.floor(Math.random() * selfGenderArray.length)];
    const interestedGenderArray = [src_1.UserInterestedGenderEnum.MALE, src_1.UserInterestedGenderEnum.FEMALE];
    const interestedGender = interestedGenderArray[Math.floor(Math.random() * interestedGenderArray.length)];
    const user = new user_entity_1.User();
    user.userName = (0, falso_1.randUserName)();
    user.firstName = (0, falso_1.randFirstName)();
    user.lastName = (0, falso_1.randLastName)();
    user.email = (0, falso_1.randEmail)();
    user.password = hashedPassword;
    user.selfGender = selfGender;
    user.interestedGender = interestedGender;
    const profile = profileRepo.save({ user });
    user.profile = profile;
    return user;
});
//# sourceMappingURL=user.factory.js.map