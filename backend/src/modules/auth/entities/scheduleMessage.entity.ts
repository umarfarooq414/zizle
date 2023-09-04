// src/modules/auth/entities/userBonusCode.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'schedule_message' })
export class ScheduleMessage {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    nullable: false,
  })
  readonly message: string;

  @Column({
    nullable: false,
  })
  time: string;

  @Column({
    nullable: false,
    type: 'json',
  })
  filters: object;
}
