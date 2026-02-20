import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  first_name!: string | null;

  @Column({ nullable: true })
  last_name!: string | null;

  @Column({ nullable: true })
  phone!: string | null;



  @Column({ nullable: true })
  avatar_url!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, user => user.profiles)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
