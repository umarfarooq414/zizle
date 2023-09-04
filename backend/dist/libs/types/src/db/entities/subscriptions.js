"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionActionTypes = exports.getAmountForEachAction = exports.getPackageFromNumber = exports.Package = void 0;
var Package;
(function (Package) {
    Package["Package1"] = "Package 1";
    Package["Package2"] = "Package 2";
    Package["Package3"] = "Package 3";
    Package["Package4"] = "Package 4";
    Package["Package5"] = "Package 5";
    Package["Package6"] = "Package 6";
})(Package = exports.Package || (exports.Package = {}));
function getPackageFromNumber(num) {
    switch (num) {
        case 1:
            return Package.Package1;
        case 2:
            return Package.Package2;
        case 3:
            return Package.Package3;
        case 4:
            return Package.Package4;
        case 5:
            return Package.Package5;
        case 6:
            return Package.Package6;
        default:
            return undefined;
    }
}
exports.getPackageFromNumber = getPackageFromNumber;
async function getAmountForEachAction(action, packageId, subscriptionService) {
    switch (action) {
        case TransactionActionTypes.SENDMESSAGE:
            return -13;
        case TransactionActionTypes.VIEWPHOTO:
            return -10;
        case TransactionActionTypes.PROFILEVISIT:
            return -2;
        case TransactionActionTypes.PROFILEVERIFIED:
            return 5;
        case TransactionActionTypes.AVATARUPLOADED:
            return 3;
        case TransactionActionTypes.EMAILCONFIRMED:
            return 16;
        case TransactionActionTypes.MOBILENUMBER:
            return 2;
        case TransactionActionTypes.ACCOUNTCREATION:
            return 26;
        case TransactionActionTypes.SENDEMOJI:
            return -6;
        case TransactionActionTypes.RECEIVEEMOJI:
            return 6;
        case TransactionActionTypes.PACKAGE_SUBSCRIPTION:
            if (packageId && subscriptionService) {
                const packageObject = await subscriptionService.findOne(packageId);
                return packageObject.noOfCoins;
            }
            else {
                return undefined;
            }
        default:
            return undefined;
    }
}
exports.getAmountForEachAction = getAmountForEachAction;
var TransactionActionTypes;
(function (TransactionActionTypes) {
    TransactionActionTypes["SENDMESSAGE"] = "SendMessage";
    TransactionActionTypes["EMAILCONFIRMED"] = "EmailConfirmed";
    TransactionActionTypes["AVATARUPLOADED"] = "AvatarUploaded";
    TransactionActionTypes["PROFILEVERIFIED"] = "ProfileVerified";
    TransactionActionTypes["MOBILENUMBER"] = "MobileNumber";
    TransactionActionTypes["ACCOUNTCREATION"] = "AccountCreation";
    TransactionActionTypes["VIEWPHOTO"] = "ViewPhoto";
    TransactionActionTypes["PROFILEVISIT"] = "ProfileVisit";
    TransactionActionTypes["SENDEMOJI"] = "SendEmoji";
    TransactionActionTypes["RECEIVEEMOJI"] = "ReceiveEmoji";
    TransactionActionTypes["PACKAGE_SUBSCRIPTION"] = "PackageSubscription";
    TransactionActionTypes["SENDGIFT"] = "SendGift";
    TransactionActionTypes["RECEIVEGIFT"] = "ReceiveGift";
    TransactionActionTypes["BONUSCODE"] = "BonusCode";
})(TransactionActionTypes = exports.TransactionActionTypes || (exports.TransactionActionTypes = {}));
//# sourceMappingURL=subscriptions.js.map