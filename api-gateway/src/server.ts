import 'dotenv/config';
import logger from './utils/logger';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import errorHandler from './middlewares/error.handler';
import { connectRedis } from './config/db';
import { rateLimiterOptions, requestLogger } from './middlewares';
import { config } from './config';
import proxy from 'express-http-proxy';
import { ProxyOptions } from 'express-http-proxy';


const app = express();
const PORT = config.port
const redisClient = connectRedis();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(rateLimiterOptions(redisClient));
app.use(requestLogger);

const proxyOptions: ProxyOptions = {
    proxyReqPathResolver: (req: Request): string => {
        return req.originalUrl.replace(/^\/v1/, "/api");
    },
    proxyErrorHandler: ((err: any, res: Response, next: NextFunction): void => {
        logger.error(`Proxy error: ${err.message}`);
        res.status(500).json({
            message: `Internal server error`,
            error: err,
        });
    })
};

// proxy for identity service
app.use(
    "/v1/auth",
    proxy(config.identityServiceUrl, {
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq: Request) => {
            proxyReqOpts.headers = {
                ...proxyReqOpts.headers,
                "Content-Type": "application/json",
            };
            return proxyReqOpts;
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
            logger.info(
                `Response received from Identity service: ${proxyRes.statusCode}`
            );

            return proxyResData;
        },
    })
);

// proy for movie service
app.use(
    "/v1/movie",
    proxy(config.movieServiceUrl, {
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq: Request) => {
            proxyReqOpts.headers = {
                ...proxyReqOpts.headers,
                "Content-Type": "application/json",
            };
            return proxyReqOpts;
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
            logger.info(
                `Response received from Movie service: ${proxyRes.statusCode}`
            );

            return proxyResData;
        },
    })
);


// proy for admin service
app.use(
    "/v1/admin",
    proxy(config.adminServiceUrl, {
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq: Request) => {
            proxyReqOpts.headers = {
                ...proxyReqOpts.headers,
                "Content-Type": "application/json",
            };
            return proxyReqOpts;
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
            logger.info(
                `Response received from Admin service: ${proxyRes.statusCode}`
            );

            return proxyResData;
        },
    })
);


app.use(errorHandler);


app.listen(PORT, () => {
    logger.info(`API Gateway running on port ${config.port}`);
    logger.info(`Identity service is running on port ${config.identityServiceUrl}`);
    logger.info(`Movie service is running on port ${config.movieServiceUrl}`);
    logger.info(`Admin service is running on port ${config.adminServiceUrl}`);
    logger.info(`Redis server is running on port ${config.redis.url}`);
});