import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BlockUserReason } from '../../../../libs/types/src';

@Entity({ name: 'block_users' })
export class Block {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  blocked: User;

  @Column({
    type: 'enum',
    enum: BlockUserReason,
  })
  reason: BlockUserReason;

  @Column()
  status: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
