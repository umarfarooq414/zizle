export interface IChat {
    id?: string;
    message: string;
    receiver: string;
    sender: string;
    seen?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IChatParams {
    message: string;
    receiver: string;
    sender: string;
    seen?: boolean;
}
