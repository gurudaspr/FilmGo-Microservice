import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Custom error interface to include statusCode
interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

export default errorHandler;