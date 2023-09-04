export declare class CloudinaryConfigService {
    constructor();
    uploadImage(file: any, folderName: string): Promise<unknown>;
    getFolderImagesUrls(folderName: string): Promise<any>;
    uploadFile(fileBuffer: any, folderName: any): Promise<unknown>;
}
