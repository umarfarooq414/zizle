import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BlockUserReason } from '../../../../libs/types/src';

@Entity({ name: 'user_photos' })
export class Photo {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  photos: string;

  @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  setPhotosPath(path: string) {
    this.photos = path;
  }
}
