import {
    UserSelfGenderEnum,
    UserInterestedGenderEnum,
    IUserParams,
    type IOathUser,
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
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  // import {
  //   IUserParams,
  //   IUser,
  //   UserStatusEnum,
  //   UserRoleEnum,
  //   SocialProviderEnum,
  // } from "@lib/types";
  import { CustomerProfileData } from './customer.profiledata.entity';
  import { profile } from 'console';
  import { UserAccountTransaction } from './user.account.transaction.entity';
  import { VisitProfile } from './visit.profile.entity';
  import { Favorite } from './customer.favourite.entity';
  import { Address } from './user.address.entity';
  import { BlockList } from 'net';
  import { Block } from './user.block.entity';
  import { Photo } from './user.photos.entity';
  import { Payments } from 'src/modules/payments/entities/payment.entity';
  @Entity({ name: 'user' })
  export class OauthUser implements IOathUser {
    constructor(params?: IOathUser) {
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
      nullable: true,
    })
    selfGender: string;
  
    @Column({
      nullable: true,
    })
    interestedGender: string;
  
    @Column({
      nullable: true,
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
  
    @OneToOne(() => Address, (address) => address.user, { cascade: true, eager: true })
    address: Address;
  
    @OneToMany(() => UserAccountTransaction, (transaction) => transaction.user, { eager: true, cascade: true })
    transaction: UserAccountTransaction;
  
    @OneToMany(() => VisitProfile, (visit) => visit.visitor, { eager: true, cascade: true })
    visits: VisitProfile;
  
    @OneToMany(() => Block, (block) => block.blocked, { eager: true, cascade: true })
    blocked: Block;
  
    @OneToMany(() => Favorite, (fav) => fav.favorites, { eager: true, cascade: true })
    favorite: Favorite;
  
    @OneToMany(() => Photo, (photo) => photo.user, { eager: true, cascade: true })
    photos: Photo;
  
    @OneToMany(() => Payments, (payment) => payment.user, { eager: true, cascade: true })
    payments: Payments;
  
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
  