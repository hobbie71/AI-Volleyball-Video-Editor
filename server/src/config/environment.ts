import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // File upload settings
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '524288000'), // 500MB default
  
  // Directory paths
  uploadsDir: process.env.UPLOADS_DIR || 'uploads',
  videosDir: process.env.VIDEOS_DIR || 'videos',
  exportsDir: process.env.EXPORTS_DIR || 'exports',
  tempDir: process.env.TEMP_DIR || 'temp',
  
  // FFmpeg settings
  defaultBitrate: process.env.DEFAULT_BITRATE || '4500k',
  defaultFramerate: parseInt(process.env.DEFAULT_FRAMERATE || '24'),
  defaultResolution: process.env.DEFAULT_RESOLUTION || '1920x1080'
} as const;
