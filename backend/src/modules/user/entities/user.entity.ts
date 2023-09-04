import { FakeCreator } from './fakeUser.entity';
import {
  UserSelfGenderEnum,
  UserInterestedGenderEnum,
  IUserParams,
  type IUser,
  SocialProviderEnum,
  UserStatusEnum,
  UserRoleEnum,
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
  OneToMany,
} from 'typeorm';
import { CustomerProfileData } from './customer.profiledata.entity';
import { UserAccountTransaction } from './user.account.transaction.entity';
import { VisitProfile } from './visit.profile.entity';
import { Favorite } from './customer.favourite.entity';
import { Address } from './user.address.entity';
import { Block } from './user.block.entity';
import { Photo } from './user.photos.entity';
import { Payments } from 'src/modules/payments/entities/payment.entity';
import { FallOutUsers } from './user.fallout.entity';
import { BonusCode } from 'src/modules/auth/entities/bonusCode.entity';
import { UserBonusCode } from 'src/modules/auth/entities/userBonusCode.entity';
import { ContactSupport } from './contactSupport.entity';
import { Notifications } from './notifications.entity';
@Entity({ name: 'user' })
export class User implements IUser {
  constructor(params?: IUserParams) {
    if (params != null) {
      if (params.firstName) this.firstName = params.firstName;
      if (params.lastName) this.lastName = params.lastName;
      this.email = params.email;
      if (params.userName) this.userName = params.userName;
      this.selfGender = params.selfGender;
      this.interestedGender = params.interestedGender;
      if (params.status) this.setStatus(params.status);
      if (params.role) this.role = params.role;
    }
  }

  @PrimaryColumn()
  @Generated('uuid')
  readonly id: string;

  @Column({
    length: 30,
    nullable: true,
  })
  firstName: string;

  @Column({
    length: 30,
    nullable: true,
  })
  lastName: string;

  @Column({
    length: 30,
    nullable: true,
  })
  userName: string;

  @Index({ unique: true })
  @Column({
    length: 100,
    nullable: false,
  })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: SocialProviderEnum,
    default: null,
  })
  SocialProvider?: SocialProviderEnum;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.UNVERIFIED,
  })
  status: UserStatusEnum = UserStatusEnum.UNVERIFIED;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.CUSTOMER,
  })
  role: UserRoleEnum = UserRoleEnum.CUSTOMER;

  @Column({
    type: 'enum',
    enum: UserSelfGenderEnum,
    nullable: true,
  })
  selfGender: UserSelfGenderEnum;

  @Column({
    type: 'enum',
    enum: UserInterestedGenderEnum,
    nullable: true,
  })
  interestedGender: UserInterestedGenderEnum;

  @Column({
    nullable: true,
    default: false,
  })
  online: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  disable: boolean;

  @Column()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column()
  @UpdateDateColumn()
  readonly updatedAt: Date;

  @OneToOne(() => CustomerProfileData, (profile) => profile.user, { cascade: true, eager: true })
  profile: CustomerProfileData;

  @OneToOne(() => Address, (address) => address.user, { eager: true, cascade: true })
  address: Address;

  @OneToMany(() => UserAccountTransaction, (transaction) => transaction.user, { eager: true, cascade: true })
  transaction: UserAccountTransaction;

  @OneToMany(() => ContactSupport, (query) => query.user, { cascade: true })
  contactSupport: ContactSupport;

  @OneToMany(() => VisitProfile, (visit) => visit.visitor, { eager: true, cascade: true })
  visits: VisitProfile;

  @OneToMany(() => Notifications, (notification) => notification.notifier, { cascade: true })
  notifications: Notifications;

  @OneToMany(() => Block, (block) => block.blocked, { eager: true, cascade: true })
  blocked: Block;

  @OneToMany(() => Favorite, (fav) => fav.favorites, { eager: true, cascade: true })
  favorite: Favorite;

  @OneToMany(() => Photo, (photo) => photo.user, { eager: true, cascade: true })
  photos: Photo[];

  @OneToMany(() => Payments, (payment) => payment.user, { eager: true, cascade: true })
  payments: Payments;

  @OneToMany(() => FakeCreator, (fake) => fake.user, { eager: true, cascade: true })
  fakes: FakeCreator;

  @OneToMany(() => FallOutUsers, (fallOutUsers) => fallOutUsers.fake, { eager: true, cascade: true })
  fallOutFakes: FallOutUsers;

  @OneToMany(() => FallOutUsers, (fallOutUsers) => fallOutUsers.user, { eager: true, cascade: true })
  fallOutUsers: FallOutUsers;

  @OneToMany(() => BonusCode, (bonusCode) => bonusCode.creator, { eager: true, cascade: true })
  bonus: FallOutUsers;

  @OneToMany(() => UserBonusCode, (userBonusCode) => userBonusCode.user, { eager: true, cascade: true })
  usedBonusCodes: UserBonusCode[];

  // Methods
  setStatus(status: UserStatusEnum) {
    this.status = status;
  }

  setRole(role: UserRoleEnum) {
    this.role = role;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setSelfGender(selfGender: UserSelfGenderEnum) {
    this.selfGender = selfGender;
  }

  setFirstName(firstName: string) {
    this.firstName = firstName;
  }

  setUserName(userName: string) {
    this.userName = userName;
  }

  setLastName(lastName: string) {
    this.lastName = lastName;
  }
}
