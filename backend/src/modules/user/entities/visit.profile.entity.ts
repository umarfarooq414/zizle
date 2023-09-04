import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Entity({ name: 'profile_visit' })
export class VisitProfile {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  visitor: User;

  @ManyToOne(() => User)
  visited: User;

  @Column({ nullable: true })
  creatorId: string;

  @Column({ nullable: true, default: false })
  seen: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
