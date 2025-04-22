import "reflect-metadata";
import { DataSource } from "typeorm";
import { Profile } from "./entities/Profile";
import { Medication } from "./entities/Medication";
import { InteractionAnalysis } from "./entities/InteractionAnalysis";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [Profile, Medication, InteractionAnalysis],
  migrations: [],
  subscribers: [],
}); 