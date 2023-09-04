import { IAttachmentParams } from '@lib/types';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chat } from './chat.entity';
@Entity({ name: 'attachment' })
export class Attachment {
  constructor(params?: IAttachmentParams) {
    if (params != null) {
      this.fileName = params.fileName;
      this.fileType = params.fileType;
      this.fileUrl = params.fileUrl;
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
    length: 250,
    nullable: true,
  })
  fileUrl: string;

  @Column({ length: 36, nullable: true })
  fileType: string;

  @Column({ length: 36, nullable: true })
  fileName: string;

  @ManyToOne(() => Chat, (chat) => chat.attachments)
  chat: Chat;

  @Column({ nullable: true })
  @UpdateDateColumn()
  readonly updatedAt: Date;
}
