import { IToken, ITokenParams } from '@lib/types';
export declare class Token implements IToken {
    constructor(params?: ITokenParams);
    readonly id: string;
    readonly userId: string;
    token: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
