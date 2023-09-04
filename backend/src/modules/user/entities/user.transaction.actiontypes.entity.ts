import { UserAccountTransaction } from './user.account.transaction.entity';
import { TransactionActionTypes } from '../../../../libs/types/src';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
@Entity({ name: 'user_transaction_action_types' })
export class UserTransactionActionTypes {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column({
    readonly: true,
    nullable: true,
  })
  actionType: string;

  @Column({ nullable: true })
  cost: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  adminId: string;

  @Column({ nullable: true })
  gift: boolean;

  @OneToMany(() => UserAccountTransaction, (transaction) => transaction.actionType, { eager: true, cascade: true })
  transaction: UserAccountTransaction;

  setGiftImageUrl(imageUrl: string) {
    this.imageUrl = imageUrl;
  }

  setGiftActionType(actionType: string) {
    this.actionType = actionType;
  }
  setGiftCost(cost: number) {
    this.cost = cost;
  }
}
