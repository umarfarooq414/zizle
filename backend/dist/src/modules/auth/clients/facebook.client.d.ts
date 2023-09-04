import { SocialLoginRequestDto } from '@lib/dtos';
import { EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
export declare class FacebookClient {
    private readonly entity;
    private readonly repository;
    private readonly configService;
    private readonly profile;
    private readonly helper;
    private readonly mailService;
    private readonly userService;
    private readonly jwt;
    constructor(jwt: JwtService, entity: EntityManager);
    verify(body: SocialLoginRequestDto): Promise<any>;
    saveUserInfo(body: SocialLoginRequestDto): Promise<any>;
}
