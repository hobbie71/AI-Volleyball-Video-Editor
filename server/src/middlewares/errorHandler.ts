import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { HTTP_STATUS } from '../constants';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export default function errorHandler(
  err: CustomError, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  Logger.error('Application error occurred', err);

  // Default error response
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.code === 'ENOENT') {
    statusCode = HTTP_STATUS.NOT_FOUND;
    message = 'File not found';
  }

  if (err.code === 'EACCES') {
    statusCode = HTTP_STATUS.FORBIDDEN;
    message = 'Permission denied';
  }

  // Multer errors
  if (err.message?.includes('File too large')) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'File size exceeds limit';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
