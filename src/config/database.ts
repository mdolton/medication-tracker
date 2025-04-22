import { DataSource } from 'typeorm';
import { Profile } from '../entities/Profile';
import { Medication } from '../entities/Medication';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '../../database.sqlite'),
  synchronize: true,
  logging: true,
  entities: [Profile, Medication],
  migrations: [],
  subscribers: [],
}); 