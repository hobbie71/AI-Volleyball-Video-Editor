import { TimelineVideo } from "../../../types/video.types";

export const getCurrentTimelineVideoPlaying = (
  timeSeconds: number,
  timelineVideos: TimelineVideo[]
) => {
  const currentVideo = timelineVideos.find(
    (video) =>
      timeSeconds >= video.timelineStartTime &&
      timeSeconds < video.timelineEndTime
  );

  return currentVideo ? currentVideo : null;
};
