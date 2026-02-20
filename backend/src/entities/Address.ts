import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column()
  type!: string; // 'shipping' or 'billing'

  @Column({ default: false })
  is_default!: boolean;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column({ nullable: true })
  company!: string | null;

  @Column()
  address_line_1!: string;

  @Column({ nullable: true })
  address_line_2!: string | null;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  postal_code!: string;

  @Column()
  country!: string;

  @Column({ nullable: true })
  phone!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, user => user.addresses)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
