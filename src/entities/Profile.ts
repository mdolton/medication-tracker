import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Medication } from './Medication';
import { InteractionAnalysis } from './InteractionAnalysis';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => Medication, medication => medication.profile)
  medications!: Medication[];

  @OneToMany(() => InteractionAnalysis, analysis => analysis.profile)
  interactionAnalyses!: InteractionAnalysis[];
} 