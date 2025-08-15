import { Request, Response, NextFunction } from "express";
import { VIDEO_CONSTANTS, HTTP_STATUS, ERROR_MESSAGES } from "../constants";

/**
 * Middleware to validate uploaded video files
 */
export const validateVideo = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.file) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.NO_FILE_UPLOADED,
    });
    return;
  }

  // Validate MIME type instead of file extension for better accuracy
  const validMimeTypes = [
    "video/mp4",
    "video/avi",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
  ];
  if (!validMimeTypes.includes(req.file.mimetype)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.INVALID_FILE_FORMAT,
      received: req.file.mimetype,
      supportedFormats: validMimeTypes,
    });
    return;
  }

  // Validate file size (check if file exists and has reasonable size)
  if (req.file.size > VIDEO_CONSTANTS.MAX_FILE_SIZE) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.FILE_TOO_LARGE,
      fileSize: req.file.size,
      maxSize: VIDEO_CONSTANTS.MAX_FILE_SIZE,
    });
    return;
  }

  next();
};

/**
 * Middleware to validate export request body
 */
export const validateExportRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { videos, exportSettings } = req.body;

  if (!videos || !Array.isArray(videos) || videos.length === 0) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: "Videos array is required and must not be empty",
    });
    return;
  }

  if (!exportSettings) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: "Export settings are required",
    });
    return;
  }

  next();
};
