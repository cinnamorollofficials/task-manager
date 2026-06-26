import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Base route / healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Task Manager API is running' });
});

export default app;
