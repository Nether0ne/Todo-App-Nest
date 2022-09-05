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
}
