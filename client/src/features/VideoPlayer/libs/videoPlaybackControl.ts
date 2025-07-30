import { TimelineVideo, VideoElementObject } from "../../../types/video.types";

export const pauseAllVideos = (videoElements: VideoElementObject) => {
  Object.values(videoElements).forEach((video) => {
    video.pause();
  });
};

export const resetAllVideos = (
  timelineVideos: TimelineVideo[],
  videoElements: VideoElementObject
) => {
  timelineVideos.forEach((video) => {
    const videoElement = videoElements[video.id];
    if (!videoElement) return;

    videoElement.pause();
    videoElement.currentTime = video.startTime;
  });
};

export const resetAllVideosExceptVideo = (
  timelineVideos: TimelineVideo[],
  videoElements: VideoElementObject,
  exceptVideo: TimelineVideo
) => {
  timelineVideos.forEach((video) => {
    if (video === exceptVideo) return;

    const videoElement = videoElements[video.id];
    if (!videoElement) return;

    videoElement.pause();
    videoElement.currentTime = video.startTime;
  });
};
