import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { NotificationAction } from '@lib/types';

@Entity({ name: 'notifications' })
export class Notifications {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column()
  message: string;

  @Column({ default: false })
  seen: boolean;

  @Column({ type: 'enum', enum: NotificationAction })
  category: NotificationAction;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  notifier: User;

  @ManyToOne(() => User)
  notified: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
