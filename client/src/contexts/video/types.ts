import { Dispatch, SetStateAction } from "react";
import { MotionEffects } from "../videoEditing/types";

export type ExportSettings = {
  resolution: string;
  format: string;
  bitrate: string;
  framerate: string;
};

export const defaultExportSettings: ExportSettings = {
  resolution: "1920x1080",
  format: "mp4",
  bitrate: "4500k",
  framerate: "30",
};

export type Upload = {
  id: string;
  file: File;
  fileName: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
};

export type Video = {
  id: string;
  uploadId: string;
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

export type VideoContextType = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  videoRefs: React.RefObject<Record<string, HTMLVideoElement>>;
  allTimelineVideos: Video[];
  setAllTimelineVideos: Dispatch<SetStateAction<Video[]>>;
  uploadVideo: (file: File | File[]) => void;
  timelineDuration: number;
  setTimelineDuration: (time: number) => void;
  allVideoUploads: Upload[];
  addVideoFromUpload: (upload: Upload) => void;
  exportVideo: () => Promise<string>;
  exportSettings: ExportSettings;
  setExportSettings: (settings: ExportSettings) => void;
};
