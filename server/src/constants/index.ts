/**
 * Constants for video processing
 */
export const VIDEO_CONSTANTS = {
  SUPPORTED_FORMATS: ['.mp4', '.avi', '.mov', '.mkv', '.webm'],
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
  DEFAULT_EXPORT_SETTINGS: {
    resolution: '1920x1080',
    bitrate: '4500k',
    framerate: 24
  },
  DIRECTORIES: {
    TEMP: 'temp',
    EXPORTS: 'exports',
    UPLOADS: 'uploads',
    VIDEOS: 'videos'
  }
} as const;

/**
 * HTTP Status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NO_FILE_UPLOADED: 'No file uploaded',
  FILE_NOT_FOUND: 'Input file not found',
  INVALID_FILE_FORMAT: 'Invalid file format',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  PROCESSING_FAILED: 'Video processing failed',
  EXPORT_FAILED: 'Video export failed'
} as const;
