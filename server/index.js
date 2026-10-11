import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';

import authRoutes from './routes/authRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import bloodRequestRoutes from './routes/bloodRequestRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BloodConnect API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
