import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Subscription } from './subscription.entity';

@Entity({ name: 'user_subscription' })
export class UserSubscription {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Subscription, { onDelete: 'CASCADE' })
  package: Subscription;
}
