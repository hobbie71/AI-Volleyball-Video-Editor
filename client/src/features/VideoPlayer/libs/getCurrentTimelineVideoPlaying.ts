import { TimelineVideo } from "../../../types/video.types";

export const getCurrentTimelineVideoPlaying = (
  timeSeconds: number,
  timelineVideos: TimelineVideo[]
) => {
  const index = timelineVideos.findIndex(
    (video) =>
      timeSeconds >= video.timelineStartTime &&
      timeSeconds < video.timelineEndTime
  );
  const currentVideo = index !== -1 ? timelineVideos[index] : null;

  return { currentVideo, index };
};
