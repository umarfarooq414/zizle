// src/modules/auth/entities/userBonusCode.entity.ts
import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BonusCode } from './bonusCode.entity';

@Entity({ name: 'user_bonus_code' })
export class UserBonusCode {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => BonusCode, { onDelete: 'CASCADE' })
  bonusCode: BonusCode;
}
