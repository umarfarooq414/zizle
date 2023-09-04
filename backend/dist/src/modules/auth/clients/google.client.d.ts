import { AuthorizeResponseDto, SocialLoginRequestDto } from '@lib/dtos';
import { User } from 'src/modules/user/entities/user.entity';
import { EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
export declare class GoogleClient {
    private readonly entity;
    private readonly repository;
    private readonly profile;
    private readonly configService;
    private readonly helper;
    private readonly userService;
    private readonly mailService;
    private readonly jwt;
    constructor(jwt: JwtService, entity: EntityManager);
    validate(body: SocialLoginRequestDto): Promise<AuthorizeResponseDto | User>;
}
