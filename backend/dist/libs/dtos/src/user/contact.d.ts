import { QueryStatus } from './../../../types/src/db/entities/user';
export declare class ContactSupportDto {
    readonly theme?: string;
    readonly token?: string;
    readonly email: string;
    readonly message: string;
}
export declare class UpdateQueryStatusDto {
    readonly id?: string;
    readonly status: QueryStatus;
}
