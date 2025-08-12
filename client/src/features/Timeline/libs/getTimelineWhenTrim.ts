import { TimelineVideo } from "../../../types/video.types";

export const getTimelineWhenTrim = (
  video: TimelineVideo,
  amountTrimmed: number,
  timelineVideos: TimelineVideo[]
) => {
  const videoIndex = timelineVideos.findIndex((vid) => vid === video);

  return timelineVideos.map((timelineVideo, i) => {
    if (i <= videoIndex) return timelineVideo;

    return {
      ...timelineVideo,
      timelineStartTime: timelineVideo.timelineStartTime - amountTrimmed,
      timelineEndTime: timelineVideo.timelineEndTime - amountTrimmed,
    };
  });
};
