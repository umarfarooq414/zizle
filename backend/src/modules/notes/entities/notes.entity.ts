import { INotesParams } from '@lib/types';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'notes' })
export class Notes {
  constructor(params?: INotesParams) {
    if (params != null) {
      
      this.note = params.note;
      this.creator = params.creator;
      this.userId = params.userId;
    }
  }

  @PrimaryGeneratedColumn({})
  readonly id: string;

  @Column({
    nullable: true,
  })
  @CreateDateColumn()
  readonly createdAt: Date

  @Column({ type:'text', nullable: false })
  note: string;

  @Column({ length: 36, nullable: true })
  creator: string;

  @Column({ length: 36, nullable: true })
  userId: string;

  @Column({ nullable: true })
  @UpdateDateColumn()
  readonly updatedAt: Date;


  setNotes(notes: string) {
    this.note = notes;
  }
}
