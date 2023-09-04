import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { OAuth2Client } from 'google-auth-library';
import { BonusCode } from './entities/bonusCode.entity';
import { UserBonusCode } from './entities/userBonusCode.entity';
export declare class AuthHelper {
    private readonly repository;
    private readonly configService;
    private readonly bonusRepo;
    private readonly chatRepo;
    private readonly userBonusRepo;
    private readonly jwt;
    constructor(jwt: JwtService);
    decode(token: string): Promise<unknown>;
    validateUser(decoded: any): Promise<User>;
    generateToken(user: User): string;
    calculateBirthday(age: any): string;
    isPasswordValid(password: string, userPassword: string): boolean;
    encodePassword(password: string): Promise<string>;
    validate(token: string): Promise<boolean | never>;
    GoogleClient(): OAuth2Client;
    verifyBonusCode(token: string, bonusCode: string): Promise<boolean>;
    getBonusCode(token: string, id?: string, bonusCode?: string): Promise<BonusCode>;
    useBonusCode(user: User, bonusCode: BonusCode): Promise<UserBonusCode>;
    sendWelcomeMessage(receiver: User): Promise<void>;
}
