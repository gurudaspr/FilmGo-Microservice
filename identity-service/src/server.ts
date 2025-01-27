import 'dotenv/config';
import logger from './utils/logger';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import errorHandler from './middlewares/error.handler';
import identityRoutes from './routes/identity.routes';
import { connectDB, connectRedis } from './config/db';
import { createRateLimiter, requestLogger } from './middlewares';
import { config } from './config';



const app = express();
const PORT = config.port;

connectDB();
const redisClient = connectRedis();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(createRateLimiter(redisClient));


// Routes
app.use('/api/auth', identityRoutes);
app.use(errorHandler);




// Start server
const startServer = async () => {
    try {
        app.listen(PORT, () => {
            logger.info(`Post service running on port ${PORT}`);
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