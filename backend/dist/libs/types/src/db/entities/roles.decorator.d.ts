import { type UserRoleEnum } from './user';
export declare const USER_ROLE_KEY = "roles";
export declare const UserRole: (...roles: UserRoleEnum[]) => import("@nestjs/common").CustomDecorator<string>;
