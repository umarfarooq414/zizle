import { IAnnouncementParams } from '@lib/types';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'announcement' })
export class Announcement {
  constructor(params?: IAnnouncementParams) {
    if (params != null) {
      this.title = params.title;
      this.description = params.description;
      this.sender = params.sender;
    }
  }

  @PrimaryGeneratedColumn({})
  readonly id: string;

  @Column({
    nullable: true,
  })
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({ length: 250, nullable: false })
  description: string;

  @Column({ length: 36, nullable: true })
  sender: string;

  @Column({ nullable: true })
  @UpdateDateColumn()
  readonly updatedAt: Date;

  setAnnouncementTitle(title: string) {
    this.title = title;
  }

  setAnnouncementDescription(description: string) {
    this.description = description;
  }
}
