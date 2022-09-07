import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'varchar', nullable: false, unique: true, length: 64 })
  email: string;
  @Column({ type: 'varchar', nullable: false, unique: true, length: 32 })
  username: string;
  @Column({ type: 'varchar', nullable: false, length: 256 }) password: string;
  @CreateDateColumn() createdAt: Date;
  @CreateDateColumn() updatedAt?: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // For testing purposes
  constructor(
    id?: string,
    username?: string,
    email?: string,
    password?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || '';
    this.username = username || '';
    this.email = email || '';
    this.password = bcrypt.hashSync(password || '', 10);
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}
