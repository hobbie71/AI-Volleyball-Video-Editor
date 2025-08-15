export type MotionEffects = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

export type Resolution =
  | "3840x2160"
  | "2560x1440"
  | "1920x1080"
  | "1280x720"
  | "854x480";

export type Format = "mp4" | "webm" | "mov";
export type Bitrate =
  | "1000k"
  | "1500k"
  | "2500k"
  | "3500k"
  | "4500k"
  | "6000k"
  | "10000k"
  | "16000k"
  | "35000k"
  | "45000k";

export type Framerate = "24" | "30" | "60";

export type ExportSettings = {
  resolution: Resolution;
  format: Format;
  bitrate: Bitrate;
  framerate: Framerate;
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
