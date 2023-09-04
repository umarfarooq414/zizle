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
exports.SubscriptionsController = void 0;
const subscriptions_service_1 = require("./subscriptions.service");
const subscription_entity_1 = require("./entities/subscription.entity");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../../libs/constants/src");
const subscriptions_1 = require("../../../libs/dtos/src/subscriptions");
let SubscriptionsController = class SubscriptionsController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    demo() {
    }
    async findAll() {
        return await this.subscriptionService.findAll();
    }
    async findUserPackages(token) {
        return await this.subscriptionService.findUserPackages(token);
    }
    async createdSubscription(subscriptionDto) {
        return await this.subscriptionService.createSubscription(subscriptionDto);
    }
    async findOne(id) {
        return await this.subscriptionService.findOne(id);
    }
    async updateById(id, body) {
        return await this.subscriptionService.updateById(id, body);
    }
    async deleteById(id) {
        return await this.subscriptionService.deleteById(id);
    }
};
__decorate([
    (0, common_1.Get)('demo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "demo", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'All Subscription!' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Subscription!',
        type: subscription_entity_1.Subscription,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user-subscriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'All Subscription!' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Subscription!',
        type: subscription_entity_1.Subscription,
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "findUserPackages", null);
__decorate([
    (0, common_1.Post)('createSubscription'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Create Subscription' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Subscription created!',
        type: subscription_entity_1.Subscription,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscriptions_1.CreateSubscriptionRequestDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "createdSubscription", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Subscription' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter subscription id',
        type: 'string',
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Subscription' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter subscription id',
        type: 'string',
    }),
    (0, common_1.Put)('updateSubscription/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscriptions_1.UpdateSubscriptionRequestDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "updateById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete Subscription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deleted.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter subscription id',
        type: 'string',
    }),
    (0, common_1.Delete)('deleteSubscription/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "deleteById", null);
SubscriptionsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('subscriptions'),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.SUBSCRIPTIONS),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], SubscriptionsController);
exports.SubscriptionsController = SubscriptionsController;
//# sourceMappingURL=subscriptions.controller.js.map