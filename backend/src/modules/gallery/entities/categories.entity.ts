import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Images } from './images.entity';

@Entity({ name: 'categories' })
export class Categories {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column()
  name: string;

  @Column({ nullable: true, unique: true })
  position: number;

  @OneToMany(() => Images, (images) => images.categories, { eager: true, cascade: true })
  images: Images[];

  @Column()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column()
  @UpdateDateColumn()
  readonly updatedAt: Date;
}
