export interface IToken {
    id?: string;
    userId: string;
    token: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ITokenParams {
    userId: string;
    token: string;
}
