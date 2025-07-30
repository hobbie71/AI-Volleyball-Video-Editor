export type MotionEffects = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

export type ExportSettings = {
  resolution: string;
  format: string;
  bitrate: string;
  framerate: string;
};

export type Video = {
  id: string;
  file: File;
  fileName: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
};

export type TimelineVideo = {
  id: string;
  videoId: string;
  file: File;
  fileName: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
  timelineStartTime: number;
  timelineEndTime: number;
  motionEffects: MotionEffects | null;
};
