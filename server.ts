import "reflect-metadata";
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { AppDataSource } from './src/data-source';
import { Profile } from './src/entities/Profile';
import { Medication } from './src/entities/Medication';
import { InteractionAnalysis } from './src/entities/InteractionAnalysis';
import * as path from 'path';
import * as fs from 'fs';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

// API Routes
const getProfiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profiles = await AppDataSource.getRepository(Profile).find({
      relations: ['medications', 'interactionAnalyses']
    });
    res.json(profiles);
  } catch (error) {
    next(error);
  }
};

const createProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = AppDataSource.getRepository(Profile).create(req.body);
    const result = await AppDataSource.getRepository(Profile).save(profile);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await AppDataSource.getRepository(Profile).findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['medications', 'interactionAnalyses']
    });
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

const addMedication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await AppDataSource.getRepository(Profile).findOne({
      where: { id: parseInt(req.params.id) }
    });
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    const medication = AppDataSource.getRepository(Medication).create({
      ...req.body,
      profile: profile
    });
    const result = await AppDataSource.getRepository(Medication).save(medication);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteMedication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AppDataSource.getRepository(Medication).delete(req.params.id);
    if (result.affected === 0) {
      res.status(404).json({ error: 'Medication not found' });
      return;
    }
    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const checkInteractions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await AppDataSource.getRepository(Profile).findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['medications']
    });
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    const medications = profile.medications;
    if (medications.length === 0) {
      res.status(400).json({ error: 'No medications found for this profile' });
      return;
    }
    const medicationList = medications.map(m => `${m.name} (${m.dosage}, ${m.frequency})`).join(', ');
    const prompt = `You are a clinical‑pharmacology assistant. When asked about drug interactions or optimal dosing times, you must only cite information reputable medical sources like WebMD, PubMed, Mayo Clinic, Examine.com, Nature, etc. 
    Analyze and provide a bullet-pointed summary of potential interactions and provide a recommended daily schedule with concrete recommendations for only these medications and supplements:: ${medicationList}. 
    Consider dosage, frequency, and any notes provided. Consider medically indicated drug combinations. Provide a detailed analysis of potential interactions, 
    risks, and recommendations.`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a medical professional analyzing potential drug interactions. Provide detailed, accurate, and professional analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    const analysis = completion.choices[0].message.content;
    if (!analysis) {
      throw new Error('No analysis generated');
    }
    const interactionAnalysis = AppDataSource.getRepository(InteractionAnalysis).create({
      analysis,
      medicationIds: medications.map(m => m.id.toString()),
      profile: profile
    });
    const savedAnalysis = await AppDataSource.getRepository(InteractionAnalysis).save(interactionAnalysis);
    res.json(savedAnalysis);
  } catch (error) {
    next(error);
  }
};

const getLatestAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await AppDataSource.getRepository(Profile).findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['interactionAnalyses']
    });
    if (!profile || profile.interactionAnalyses.length === 0) {
      res.status(404).json({ error: 'No analysis found for this profile' });
      return;
    }
    const latestAnalysis = profile.interactionAnalyses[profile.interactionAnalyses.length - 1];
    res.json(latestAnalysis);
  } catch (error) {
    next(error);
  }
};

const getMedications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await AppDataSource.getRepository(Profile).findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['medications']
    });
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json(profile.medications);
  } catch (error) {
    next(error);
  }
};

// Register routes
app.get('/api/profiles', getProfiles);
app.post('/api/profiles', createProfile);
app.get('/api/profiles/:id', getProfile);
app.post('/api/profiles/:id/medications', addMedication);
app.delete('/api/medications/:id', deleteMedication);
app.post('/api/profiles/:id/check-interactions', checkInteractions);
app.get('/api/profiles/:id/latest-analysis', getLatestAnalysis);
app.get('/api/profiles/:id/medications', getMedications);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname)));

// Serve the React app for all other routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 