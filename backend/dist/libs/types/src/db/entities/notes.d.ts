export interface INotes {
    id?: string;
    note?: string;
    creator: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface INotesParams {
    note?: string;
    creator: string;
    userId: string;
}
