import 'dotenv/config';
import logger from './utils/logger';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import errorHandler from './middlewares/error.handler';
import { config } from './config';
import { connectCache, disconnectCache } from './config/rabbitmq';
import { disconnectRedis } from './config/redis';



const app = express();
const PORT = config.port;



// Middleware
app.use(helmet());

// Routes
app.use(errorHandler);




// Start server
const startServer = async () => {
    try {
        await connectCache();
        logger.info('Cache service started successfully');

        process.on('SIGTERM', async () => {
            logger.info('SIGTERM received, shutting down...');
            await disconnectCache();
            await disconnectRedis();
            process.exit(0);
        });
        app.listen(PORT, () => {
            logger.info(`Cache service running on port ${PORT}`);
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