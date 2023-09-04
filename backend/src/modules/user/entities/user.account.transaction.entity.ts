import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity';
import { UserTransactionActionTypes } from './user.transaction.actiontypes.entity';
@Entity({ name: 'user_account_transaction' })
export class UserAccountTransaction {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column({
    nullable: true,
  })
  currentCoins: number;

  @Column({
    nullable: true,
  })
  cost: number;

  @ManyToOne(() => User, (user) => user.transaction, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => UserTransactionActionTypes, (actionTypes) => actionTypes.transaction, { onDelete: 'CASCADE' })
  actionType: UserTransactionActionTypes;

  @Column()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column()
  @UpdateDateColumn()
  readonly updatedAt: Date;
}
