import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserBonusCode } from './userBonusCode.entity';

@Entity({ name: 'bonus-code' })
export class BonusCode {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    nullable: true,
  })
  bonusCode: string;

  @Column({
    nullable: true,
  })
  coins: number;

  @Column({
    nullable: true,
  })
  expiryDate: Date;

  @ManyToOne(() => User)
  creator: User;

  @OneToMany(() => UserBonusCode, (userBonusCode) => userBonusCode.bonusCode, { eager: true, cascade: true })
  users: UserBonusCode[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  setExpiryDate(expiryDate: Date) {
    this.expiryDate = expiryDate;
  }
}
