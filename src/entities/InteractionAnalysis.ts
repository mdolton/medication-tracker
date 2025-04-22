import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Profile } from './Profile';

@Entity()
export class InteractionAnalysis {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  analysis!: string;

  @Column('simple-array')
  medicationIds!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Profile, profile => profile.interactionAnalyses)
  profile!: Profile;
} 