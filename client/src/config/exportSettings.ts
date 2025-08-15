import {
  Resolution,
  Format,
  Bitrate,
  Framerate,
} from "../../../shared/types/video.types";

export const exportSettingsOptions = {
  resolutions: [
    { value: "3840x2160" as Resolution, label: "3840x2160 (4K UHD)" },
    { value: "2560x1440" as Resolution, label: "2560x1440 (2K QHD)" },
    { value: "1920x1080" as Resolution, label: "1920x1080 (Full HD)" },
    { value: "1280x720" as Resolution, label: "1280x720 (HD)" },
    { value: "854x480" as Resolution, label: "854x480 (SD)" },
  ],
  formats: [
    { value: "mp4" as Format, label: "MP4 (H.264)" },
    { value: "webm" as Format, label: "WebM (VP8)" },
    { value: "mov" as Format, label: "MOV" },
  ],
  bitrates: [
    { value: "1000k" as Bitrate, label: "1000k (SD 480p)" },
    { value: "1500k" as Bitrate, label: "1500k (SD 480p High)" },
    { value: "2500k" as Bitrate, label: "2500k (HD 720p)" },
    { value: "3500k" as Bitrate, label: "3500k (HD 720p High)" },
    { value: "4500k" as Bitrate, label: "4500k (FullHD 1080p)" },
    { value: "6000k" as Bitrate, label: "6000k (FullHD 1080p High)" },
    { value: "10000k" as Bitrate, label: "10000k (2K 1440p)" },
    { value: "16000k" as Bitrate, label: "16000k (2K 1440p High)" },
    { value: "35000k" as Bitrate, label: "35000k (4K 2160p)" },
    { value: "45000k" as Bitrate, label: "45000k (4K 2160p High)" },
  ],
  framerates: [
    { value: "24" as Framerate, label: "24 fps (Film)" },
    { value: "30" as Framerate, label: "30 fps (Standard)" },
    { value: "60" as Framerate, label: "60 fps (High)" },
  ],
};
