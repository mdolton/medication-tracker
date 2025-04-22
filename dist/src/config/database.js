"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Profile_1 = require("../entities/Profile");
const Medication_1 = require("../entities/Medication");
const path_1 = __importDefault(require("path"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: path_1.default.join(__dirname, '../../database.sqlite'),
    synchronize: true,
    logging: true,
    entities: [Profile_1.Profile, Medication_1.Medication],
    migrations: [],
    subscribers: [],
});
