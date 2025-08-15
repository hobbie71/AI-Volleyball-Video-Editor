import { TimelineVideo, ExportSettings, MotionEffects } from "@shared/types/video.types";

/**
 * Builds FFmpeg command for video processing with motion effects and export settings
 */
export const buildFFmpegCommand = (
  video: TimelineVideo,
  inputPath: string,
  outputPath: string,
  exportSettings: ExportSettings
): string => {
  const start = video.startTime;
  const duration = video.endTime - video.startTime;
  
  let ffmpegCmd = `ffmpeg -ss ${start} -i "${inputPath}" -t ${duration}`;
  
  // Add motion effects if present
  const videoFilter = buildVideoFilter(video.motionEffects, exportSettings);
  if (videoFilter) {
    ffmpegCmd += ` -vf "${videoFilter}"`;
  }
  
  // Add export settings
  const { resolution, bitrate, framerate } = exportSettings;
  ffmpegCmd += ` -b:v ${bitrate} -r ${framerate} -c:v libx264 -c:a aac "${outputPath}"`;
  
  return ffmpegCmd;
};

/**
 * Builds video filter string for motion effects
 */
export const buildVideoFilter = (
  motionEffects: MotionEffects | null,
  exportSettings: ExportSettings
): string => {
  if (!motionEffects) return "";
  
  const [resWidth, resHeight] = exportSettings.resolution.split("x").map(Number);
  
  // Scale Calculations
  const scaledResWidth = resWidth * motionEffects.scale;
  const scaledResHeight = resHeight * motionEffects.scale;
  
  // Offsets Calculations
  const xOffset =
    (resWidth * motionEffects.scale - resWidth) / 2 + motionEffects.x;
  const yOffset =
    (resHeight * motionEffects.scale - resHeight) / 2 + motionEffects.y;
  
  // Rotation Calculations
  const rotationRadians = motionEffects.rotation * (Math.PI / 180);
  
  const vf = `
    rotate=${rotationRadians},
    scale=${scaledResWidth}:${scaledResHeight},
    crop=${resWidth}:${resHeight}:${xOffset}:${yOffset}
  `.replace(/\s+/g, ""); // Removes all spaces in string
  
  return vf;
};
