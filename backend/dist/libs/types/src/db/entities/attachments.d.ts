export interface IAttachment {
    id?: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IAttachmentParams {
    fileName: string;
    fileUrl: string;
    fileType: string;
}
