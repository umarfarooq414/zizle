import { Chat } from 'src/modules/chat/entities/chat.entity';
import {
  UserSelfGenderEnum,
  UserInterestedGenderEnum,
  type IFake,
  IFakeParams,
  UserRoleEnum,
  CustomerLifeStatus,
  CustomerSmokeStatus,
  CustomerRelationShipStatus,
  CustomerChildrenEnum,
} from './../../../../libs/types/src/db/entities/user';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  PrimaryColumn,
  Generated,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity({ name: 'email' })
export class Email {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column({ nullable: true })
  receiver: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column()
  @UpdateDateColumn()
  readonly updatedAt: Date;
}
