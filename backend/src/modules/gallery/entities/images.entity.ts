import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categories } from './categories.entity';

@Entity({ name: 'categories-images' })
export class Images {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => Categories, { onDelete: 'CASCADE' })
  categories: Categories;

  @Column()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column()
  @UpdateDateColumn()
  readonly updatedAt: Date;
}
