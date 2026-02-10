import express, { Application } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { sequelize } from './models';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { initializeSocket } from './sockets';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Home Builder API is running' });
});

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

initializeSocket(httpServer);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Development mode: Using sync. Consider using migrations for production.');
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized');
    }

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
