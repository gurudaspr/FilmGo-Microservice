import 'dotenv/config';
import logger from './utils/logger';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import errorHandler from './middlewares/error.handler';
import movieRoutes from './routes/movie.routes';
import { connectDB, connectRedis } from './config/db';
import { createRateLimiter, requestLogger } from './middlewares';
import { config } from './config';
import { connectRabbitMQ, consumeEvent } from './config/rabbitmq';
import Redis from 'ioredis';
import { handleMovieAdd } from './events/movie.handle';

const app = express();
const PORT = config.port;

// Connect to MongoDB
connectDB();

declare module 'express-serve-static-core' {
  interface Request {
    redisClient: Redis;
  }
}
// Connect to Redis
const redisClient = connectRedis();


// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(createRateLimiter(redisClient));

// Routes

app.use('/api/movie', (req, res, next) => {
  req.redisClient = redisClient;
  next();
}, movieRoutes);

app.use(errorHandler);


// Start server
const startServer = async () => {
  try {
    await connectRabbitMQ();
    await consumeEvent('movie.add',(data) => handleMovieAdd(data, redisClient)); 
    app.listen(PORT, () => {
      logger.info(`Movie service running on port ${PORT}`);
    });
  }
  catch (error: any) {
    logger.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }

}
startServer();
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});