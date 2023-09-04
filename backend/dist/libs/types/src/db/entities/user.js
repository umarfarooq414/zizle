"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockReason = exports.BlockUserReason = exports.SocialProviderEnum = exports.CustomerSmokeStatus = exports.CustomerLifeStatus = exports.CustomerRelationShipStatus = exports.UserInterestedGenderEnum = exports.CustomerChildrenEnum = exports.CustomerProfileEnum = exports.UserSelfGenderEnum = exports.NotificationAction = exports.QueryStatus = exports.UserRoleEnum = exports.UserStatusEnum = void 0;
var UserStatusEnum;
(function (UserStatusEnum) {
    UserStatusEnum["UNVERIFIED"] = "UNVERIFIED";
    UserStatusEnum["ACTIVE"] = "ACTIVE";
    UserStatusEnum["INACTIVE"] = "INACTIVE";
    UserStatusEnum["DEACTIVATE"] = "DEACTIVATE";
    UserStatusEnum["BLOCK"] = "BLOCK";
    UserStatusEnum["VERIFIED"] = "VERIFIED";
})(UserStatusEnum = exports.UserStatusEnum || (exports.UserStatusEnum = {}));
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["ADMIN"] = "ADMIN";
    UserRoleEnum["MODERATOR"] = "MODERATOR";
    UserRoleEnum["CUSTOMER"] = "CUSTOMER";
    UserRoleEnum["FAKE"] = "FAKE";
})(UserRoleEnum = exports.UserRoleEnum || (exports.UserRoleEnum = {}));
var QueryStatus;
(function (QueryStatus) {
    QueryStatus["IN_PROGRESS"] = "IN_PROGRESS";
    QueryStatus["REJECTED"] = "REJECTED";
    QueryStatus["RESOLVED"] = "RESOLVED";
})(QueryStatus = exports.QueryStatus || (exports.QueryStatus = {}));
var NotificationAction;
(function (NotificationAction) {
    NotificationAction["LIKED"] = "LIKED";
    NotificationAction["VISITED"] = "VISITED";
})(NotificationAction = exports.NotificationAction || (exports.NotificationAction = {}));
var UserSelfGenderEnum;
(function (UserSelfGenderEnum) {
    UserSelfGenderEnum["MALE"] = "MALE";
    UserSelfGenderEnum["FEMALE"] = "FEMALE";
})(UserSelfGenderEnum = exports.UserSelfGenderEnum || (exports.UserSelfGenderEnum = {}));
var CustomerProfileEnum;
(function (CustomerProfileEnum) {
    CustomerProfileEnum["VERIFIED"] = "VERIFIED";
    CustomerProfileEnum["UNVERIFIED"] = "UNVERIFIED";
})(CustomerProfileEnum = exports.CustomerProfileEnum || (exports.CustomerProfileEnum = {}));
var CustomerChildrenEnum;
(function (CustomerChildrenEnum) {
    CustomerChildrenEnum["YES"] = "Yes";
    CustomerChildrenEnum["NO"] = "No";
})(CustomerChildrenEnum = exports.CustomerChildrenEnum || (exports.CustomerChildrenEnum = {}));
var UserInterestedGenderEnum;
(function (UserInterestedGenderEnum) {
    UserInterestedGenderEnum["MALE"] = "MALE";
    UserInterestedGenderEnum["FEMALE"] = "FEMALE";
    UserInterestedGenderEnum["OTHERS"] = "OTHERS";
})(UserInterestedGenderEnum = exports.UserInterestedGenderEnum || (exports.UserInterestedGenderEnum = {}));
var CustomerRelationShipStatus;
(function (CustomerRelationShipStatus) {
    CustomerRelationShipStatus["SINGLE"] = "Single";
    CustomerRelationShipStatus["IN_A_RELATIONSHIP"] = "In a Relationship";
    CustomerRelationShipStatus["MARRIED"] = "Married";
    CustomerRelationShipStatus["WIDOWED"] = "Widowed";
    CustomerRelationShipStatus["DIVORCED"] = "Divorced";
    CustomerRelationShipStatus["ROMANCE"] = "Romance";
    CustomerRelationShipStatus["OPEN_RELATIONSHIP"] = "Open Relationship";
    CustomerRelationShipStatus["ITS_COMPLICATED"] = "It's complicated";
})(CustomerRelationShipStatus = exports.CustomerRelationShipStatus || (exports.CustomerRelationShipStatus = {}));
var CustomerLifeStatus;
(function (CustomerLifeStatus) {
    CustomerLifeStatus["ALONE"] = "Alone";
    CustomerLifeStatus["AT_PARENTS"] = "At parents";
    CustomerLifeStatus["FLAT_SHARE"] = "Flat Share";
    CustomerLifeStatus["WITH_PARTNER"] = "With partner";
    CustomerLifeStatus["MISCELLANEOUS"] = "Miscellaneous";
})(CustomerLifeStatus = exports.CustomerLifeStatus || (exports.CustomerLifeStatus = {}));
var CustomerSmokeStatus;
(function (CustomerSmokeStatus) {
    CustomerSmokeStatus["YES"] = "Yes";
    CustomerSmokeStatus["NO"] = "No";
    CustomerSmokeStatus["STOPPED"] = "Stopped";
    CustomerSmokeStatus["OCCASIONALLY"] = "Occasionally";
})(CustomerSmokeStatus = exports.CustomerSmokeStatus || (exports.CustomerSmokeStatus = {}));
var SocialProviderEnum;
(function (SocialProviderEnum) {
    SocialProviderEnum["GOOGLE"] = "google";
    SocialProviderEnum["FACEBOOK"] = "facebook";
})(SocialProviderEnum = exports.SocialProviderEnum || (exports.SocialProviderEnum = {}));
var BlockUserReason;
(function (BlockUserReason) {
    BlockUserReason["INAPPROPRIATE_MESSAGE"] = "INAPPROPRIATE_MESSAGE";
    BlockUserReason["HARASSING"] = "HARASSING";
    BlockUserReason["FAKE_ACCOUNT"] = "FAKE_ACCOUNT";
    BlockUserReason["TO_BLOCK"] = "TO_BLOCK";
})(BlockUserReason = exports.BlockUserReason || (exports.BlockUserReason = {}));
function getBlockReason(reason) {
    switch (reason) {
        case BlockUserReason.FAKE_ACCOUNT:
            return BlockUserReason.FAKE_ACCOUNT;
        case BlockUserReason.HARASSING:
            return BlockUserReason.HARASSING;
        case BlockUserReason.INAPPROPRIATE_MESSAGE:
            return BlockUserReason.INAPPROPRIATE_MESSAGE;
        case BlockUserReason.TO_BLOCK:
            return BlockUserReason.TO_BLOCK;
        default:
            return undefined;
    }
}
exports.getBlockReason = getBlockReason;
//# sourceMappingURL=user.js.map