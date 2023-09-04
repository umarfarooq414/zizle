export interface IMessage {
    message?: string;
    sender?: string;
    receiver?: string;
    moderator?: string;
    seen?: boolean;
    attachments?: any;
    id?: string;
    moderatorIds?: [];
    createdAt?: Date;
}
export interface IUnseen {
    userId?: string;
    moderatorId?: string;
}
