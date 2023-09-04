import { IChatParams } from '@lib/types';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Attachment } from './attachment.entity';
import { FakeChat } from 'src/modules/fake/entities/fakeChat.entity';
@Entity({ name: 'chat' })
export class Chat {
  constructor(params?: IChatParams) {
    if (params != null) {
      this.message = params.message;
      this.sender = params.sender;
      this.receiver = params.receiver;
      this.seen = params.seen;
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
    type: 'text',
    nullable: true,
  })
  message: string;

  @Column({ length: 36, nullable: true })
  receiver: string;

  @Column({ length: 36, nullable: true })
  sender: string;

  @Column({ nullable: true })
  seen: boolean;

  @OneToMany(() => Attachment, (attachment) => attachment.chat, { cascade: true, eager: true })
  attachments: Attachment;

  @OneToOne(() => FakeChat, (fakeChat) => fakeChat.chat, { cascade: true, eager: true })
  chat: FakeChat;

  @Column({ nullable: true })
  @UpdateDateColumn()
  readonly updatedAt: Date;
}
