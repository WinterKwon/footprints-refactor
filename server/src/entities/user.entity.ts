import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, ObjectIdColumn, ObjectID } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  BASIC_USER = 'basic',
  GHOST = 'ghost',
}

export enum UserStatus {
  NORMAL = 'normal',
  EXPIRED = 'expired',
  EXPELLED = 'expelled',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //MongoDB
  // @ObjectIdColumn()
  // id: ObjectID;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BASIC_USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.NORMAL })
  userStatus: UserStatus;

  @Column({ default: ' ' })
  tribe: string;
}
