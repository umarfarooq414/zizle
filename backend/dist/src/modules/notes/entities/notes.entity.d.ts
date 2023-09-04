import { INotesParams } from '@lib/types';
export declare class Notes {
    constructor(params?: INotesParams);
    readonly id: string;
    readonly createdAt: Date;
    note: string;
    creator: string;
    userId: string;
    readonly updatedAt: Date;
    setNotes(notes: string): void;
}
