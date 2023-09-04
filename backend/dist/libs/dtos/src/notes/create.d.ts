import { type INotes } from '@lib/types';
export declare class CreateNotesRequestDto implements INotes {
    readonly note: string;
    readonly creator: string;
    readonly userId: string;
}
