import { QueryStatus } from './../../../../libs/types/src/db/entities/user';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'contact_support' })
export class ContactSupport {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column({ type: 'text' })
  query: string;

  @Column({ type: 'enum', enum: QueryStatus, default: QueryStatus.IN_PROGRESS })
  status: QueryStatus;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column()
  @UpdateDateColumn()
  readonly updatedAt: Date;
}
