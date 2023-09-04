import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'payments' })
export class Payments {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    nullable: true,
  })
  transactionId: string;

  @Column({
    nullable: true,
  })
  secretField: string;

  @Column()
  amount: number;

  @Column()
  packageName: string;

  @Column({ nullable: true })
  currency: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
