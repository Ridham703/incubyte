import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api', healthRoutes);

app.use(errorHandler);

export default app;
