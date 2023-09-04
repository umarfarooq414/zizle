import { FakeService } from './fake.service';
import { CreateDynamicFakeRequestDto, CreateFakeRequestDto, UpdateFakeRequestDto } from '@lib/dtos';
import { User } from '../user/entities/user.entity';
export declare class FakeController {
    private readonly fakeService;
    constructor(fakeService: FakeService);
    findAll(): Promise<User[]>;
    createdFake(token: string, fakeDto: CreateFakeRequestDto, files: any): Promise<void>;
    findOne(id: string): Promise<User>;
    updateById(id: string, body: UpdateFakeRequestDto, files: any): Promise<User>;
    deleteById(id: string): Promise<User>;
    createDynamicFakes(token: string, body: CreateDynamicFakeRequestDto): Promise<void>;
}
