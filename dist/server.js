"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
const typeorm_1 = require("typeorm");
const Profile_1 = require("./src/entities/Profile");
const Medication_1 = require("./src/entities/Medication");
const InteractionAnalysis_1 = require("./src/entities/InteractionAnalysis");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const router = (0, express_1.Router)();
const port = process.env.PORT || 3000;
// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set');
    process.exit(1);
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files from the dist directory
app.use(express_1.default.static(path_1.default.join(__dirname, 'dist')));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
// Initialize database connection
const databasePath = path_1.default.join(__dirname, 'database.sqlite');
// Create database file if it doesn't exist
if (!fs_1.default.existsSync(databasePath)) {
    console.log('Creating new database file...');
    fs_1.default.writeFileSync(databasePath, '');
}
const AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: databasePath,
    synchronize: true,
    logging: true,
    entities: [Profile_1.Profile, Medication_1.Medication, InteractionAnalysis_1.InteractionAnalysis],
    subscribers: [],
    migrations: [],
});
AppDataSource.initialize()
    .then(() => {
    console.log('Database connection initialized');
    console.log('Database path:', databasePath);
    console.log('Database file exists:', fs_1.default.existsSync(databasePath));
    console.log('Database file size:', fs_1.default.statSync(databasePath).size, 'bytes');
})
    .catch((error) => {
    console.error('Error initializing database:', error);
});
// Profile endpoints
router.get('/profiles', async (req, res) => {
    try {
        console.log('Fetching all profiles...');
        const profiles = await AppDataSource.getRepository(Profile_1.Profile).find({
            relations: ['medications'],
        });
        console.log('Found profiles:', profiles);
        res.json(profiles);
    }
    catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ error: 'Failed to fetch profiles' });
    }
});
router.post('/profiles', async (req, res) => {
    try {
        const { name } = req.body;
        console.log('Creating new profile with name:', name);
        const profile = new Profile_1.Profile();
        profile.name = name;
        const savedProfile = await AppDataSource.getRepository(Profile_1.Profile).save(profile);
        console.log('Created profile:', savedProfile);
        res.json(savedProfile);
    }
    catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
});
router.delete('/profiles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting profile with ID:', id);
        const result = await AppDataSource.getRepository(Profile_1.Profile).delete(id);
        console.log('Delete result:', result);
        res.json({ message: 'Profile deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ error: 'Failed to delete profile' });
    }
});
// Medication endpoints
router.get('/profiles/:profileId/medications', async (req, res) => {
    try {
        const { profileId } = req.params;
        console.log('Fetching medications for profile ID:', profileId);
        const medications = await AppDataSource.getRepository(Medication_1.Medication).find({
            where: { profile: { id: parseInt(profileId) } },
        });
        console.log('Found medications:', medications);
        res.json(medications);
    }
    catch (error) {
        console.error('Error fetching medications:', error);
        res.status(500).json({ error: 'Failed to fetch medications' });
    }
});
router.delete('/profiles/:profileId/medications/:id', (async (req, res) => {
    try {
        const { profileId, id } = req.params;
        const medication = await AppDataSource.getRepository(Medication_1.Medication).findOne({
            where: { id: Number(id), profile: { id: Number(profileId) } }
        });
        if (!medication) {
            return res.status(404).json({ error: 'Medication not found' });
        }
        // Delete the medication
        await AppDataSource.getRepository(Medication_1.Medication).remove(medication);
        // Delete any existing analysis for this profile
        await AppDataSource.getRepository(InteractionAnalysis_1.InteractionAnalysis).delete({ profile: { id: Number(profileId) } });
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting medication:', error);
        res.status(500).json({ error: 'Failed to delete medication' });
    }
}));
router.post('/profiles/:profileId/medications', (async (req, res) => {
    try {
        const { profileId } = req.params;
        const { name, dosage, frequency, notes } = req.body;
        const profile = await AppDataSource.getRepository(Profile_1.Profile).findOne({
            where: { id: Number(profileId) }
        });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        const medication = AppDataSource.getRepository(Medication_1.Medication).create({
            name,
            dosage,
            frequency,
            notes,
            profile
        });
        const savedMedication = await AppDataSource.getRepository(Medication_1.Medication).save(medication);
        // Delete any existing analysis for this profile
        await AppDataSource.getRepository(InteractionAnalysis_1.InteractionAnalysis).delete({ profile: { id: Number(profileId) } });
        res.status(201).json(savedMedication);
    }
    catch (error) {
        console.error('Error adding medication:', error);
        res.status(500).json({ error: 'Failed to add medication' });
    }
}));
// Interaction checking endpoint
const checkInteractionsHandler = async (req, res) => {
    const { medications, profileId } = req.body;
    try {
        // Check for existing analysis with the same medications
        const medicationIds = medications.map(m => m.id?.toString() || '').filter(Boolean);
        const existingAnalysis = await AppDataSource.getRepository(InteractionAnalysis_1.InteractionAnalysis)
            .createQueryBuilder('analysis')
            .where('analysis.profileId = :profileId', { profileId })
            .andWhere('analysis.medicationIds = :medicationIds', { medicationIds: JSON.stringify(medicationIds) })
            .orderBy('analysis.createdAt', 'DESC')
            .getOne();
        if (existingAnalysis) {
            console.log('Returning cached analysis');
            res.json({ analysis: existingAnalysis.analysis });
            return;
        }
        console.log('Generating new analysis');
        const prompt = `You are a clinical‑pharmacology assistant. When asked about drug interactions or optimal dosing times, you must only cite information reputable medical sources like WebMD, PubMed, and Examine.com. 
    Analyze and provide a bullet-pointed summary of potential interactions and provide a recommended daily schedule with concrete recommendations for only these medications and supplements:
    ${medications.map((m) => `${m.name} (${m.dosage})`).join(', ')}`;
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4.1-mini",
        });
        const analysis = completion.choices[0].message.content || '';
        // Store the analysis in the database
        const profile = await AppDataSource.getRepository(Profile_1.Profile).findOne({
            where: { id: profileId }
        });
        if (!profile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }
        const newAnalysis = new InteractionAnalysis_1.InteractionAnalysis();
        newAnalysis.analysis = analysis;
        newAnalysis.medicationIds = medicationIds;
        newAnalysis.profile = profile;
        await AppDataSource.getRepository(InteractionAnalysis_1.InteractionAnalysis).save(newAnalysis);
        console.log('Stored new analysis in database');
        res.json({ analysis });
    }
    catch (error) {
        console.error('Error checking interactions:', error);
        res.status(500).json({ error: 'Failed to analyze interactions' });
    }
};
// Get latest analysis endpoint
const getLatestAnalysisHandler = async (req, res) => {
    try {
        const { profileId } = req.params;
        console.log('Fetching latest analysis for profile:', profileId);
        const latestAnalysis = await AppDataSource.getRepository(InteractionAnalysis_1.InteractionAnalysis)
            .createQueryBuilder('analysis')
            .where('analysis.profileId = :profileId', { profileId })
            .orderBy('analysis.createdAt', 'DESC')
            .getOne();
        if (!latestAnalysis) {
            res.status(404).json({ error: 'No analysis found' });
            return;
        }
        res.json({ analysis: latestAnalysis.analysis });
    }
    catch (error) {
        console.error('Error fetching latest analysis:', error);
        res.status(500).json({ error: 'Failed to fetch analysis' });
    }
};
router.post('/check-interactions', checkInteractionsHandler);
router.get('/profiles/:profileId/latest-analysis', getLatestAnalysisHandler);
app.use('/api', router);
// Handle client-side routing by serving index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'dist', 'index.html'));
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
