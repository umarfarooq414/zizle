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
@Entity({ name: 'fake-chat' })
export class FakeChat {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column()
  moderatorId: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: UserRoleEnum,
  })
  type: UserRoleEnum;

  @Column({
    nullable: true,
  })
  blocked: boolean;

  @OneToOne(() => Chat)
  @JoinColumn()
  chat: Chat;

  @Column()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column()
  @UpdateDateColumn()
  readonly updatedAt: Date;
}
