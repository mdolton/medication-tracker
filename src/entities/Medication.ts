import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profile } from './Profile';

@Entity()
export class Medication {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  dosage!: string;

  @Column()
  frequency!: string;

  @Column('text', { nullable: true })
  notes?: string;

  @ManyToOne(() => Profile, profile => profile.medications)
  profile!: Profile;
} 