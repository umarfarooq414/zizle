import { ICustomerProfileData } from './../../../../libs/types/src/db/entities/user';
import {
  CustomerChildrenEnum,
  CustomerLifeStatus,
  CustomerProfileEnum,
  CustomerRelationShipStatus,
  CustomerSmokeStatus,
  UserStatusEnum,
} from '../../../../libs/types/src/db/entities/user';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
@Entity({ name: 'customer_profile_data' })
export class CustomerProfileData {
  constructor(params?: ICustomerProfileData) {
    if (params != null) {
      if (params.children) this.children = params.children;
      if (params.profileText) this.profileText = params.profileText;
      this.smoker = params.smoke;
      if (params.life) this.life = params.life;
      if (params.relationshipStatus) this.relationshipStatus = params.relationshipStatus;
      if (params.isEmailVerified) this.isEmailVerified = params.isEmailVerified;
      if (params.avatarUrl) this.avatarUrl = params.avatarUrl;
      if (params.isEmailVerified) this.isProfileVerified = params.isProfileVerified;
      if (params.mobileNumber) this.mobileNumber = params.mobileNumber;
      if (params.dob) this.dateOfBirth = params.dob;
    }
  }

  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column({
    nullable: true,
    // type: 'enum',
    // enum: CustomerRelationShipStatus,
    default: null,
  })
  relationshipStatus: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: CustomerChildrenEnum,
    default: null,
  })
  children: CustomerChildrenEnum;

  @Column({ type: 'text', nullable: true })
  profileText: string;

  @Column({
    nullable: true,
    // type: 'enum',
    // enum: CustomerLifeStatus,
    default: null,
  })
  life: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: CustomerSmokeStatus,
    default: null,
  })
  smoker: CustomerSmokeStatus;

  @Column({
    nullable: true,
    default: UserStatusEnum.UNVERIFIED,
  })
  isEmailVerified: UserStatusEnum;

  @Column({ length: 250, nullable: true, default: null })
  avatarUrl: string;

  @Column({ default: CustomerProfileEnum.UNVERIFIED, nullable: true, type: 'enum', enum: CustomerProfileEnum })
  isProfileVerified: CustomerProfileEnum;

  @Column({ length: 30, nullable: true, default: null })
  mobileNumber: string;

  @Column({ nullable: true, type: Date })
  dateOfBirth: Date;

  @Column()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column()
  @UpdateDateColumn()
  readonly updatedAt: Date;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  // Methods
  setRelationShipStatus(relationshipStatus: CustomerRelationShipStatus) {
    this.relationshipStatus = relationshipStatus;
  }

  setChildren(children: CustomerChildrenEnum) {
    this.children = children;
  }

  setProfileText(profileText: string) {
    this.profileText = profileText;
  }

  setSmoker(smoker: CustomerSmokeStatus) {
    this.smoker = smoker;
  }

  setLife(life: CustomerLifeStatus) {
    this.life = life;
  }

  setIsEmailVerified(isEmailVerified: UserStatusEnum) {
    this.isEmailVerified = isEmailVerified;
  }

  setAvatarUrl(avatarUrl: string) {
    this.avatarUrl = avatarUrl;
  }

  setIsProfileVerified(isProfileVerified: CustomerProfileEnum) {
    this.isProfileVerified = isProfileVerified;
  }

  setMobileNumber(mobileNumber: string) {
    this.mobileNumber = mobileNumber;
  }

  setDateOfBirth(dateOfBirth: Date) {
    this.dateOfBirth = dateOfBirth;
  }
}
