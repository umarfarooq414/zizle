import { User } from 'src/modules/user/entities/user.entity';
export declare class GetModsStatsQueryParamsDto {
    readonly mod?: User;
    readonly startDate?: string;
    readonly endDate?: string;
    readonly duration?: 'daily' | 'weekly' | 'monthly';
}
