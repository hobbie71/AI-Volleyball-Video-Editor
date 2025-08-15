import fs from "fs";

/**
 * Video validation utilities
 */
export const validateVideoFile = (filePath: string): boolean => {
  const validExtensions = [".mp4", ".avi", ".mov", ".mkv", ".webm"];
  const extension = filePath.toLowerCase().substring(filePath.lastIndexOf("."));
  return validExtensions.includes(extension);
};

/**
 * Get video file size in bytes
 */
export const getVideoFileSize = (filePath: string): number => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
};

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
