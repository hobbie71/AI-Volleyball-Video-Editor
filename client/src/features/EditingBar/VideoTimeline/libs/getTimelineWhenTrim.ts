import { TimelineVideo } from "../../../../types/video.types";

export const getTimelineWhenTrim = (
  video: TimelineVideo,
  amountTrimmed: number,
  timelineVideos: TimelineVideo[]
) => {
  const videoIndex = timelineVideos.findIndex((vid) => vid === video);
  if (!Number.isInteger(videoIndex)) return;

  video.timelineEndTime -= amountTrimmed;

  for (let i = videoIndex + 1; i < timelineVideos.length; i++) {
    const currentVideo = timelineVideos[i];

    currentVideo.timelineStartTime -= amountTrimmed;
    currentVideo.timelineEndTime -= amountTrimmed;
  }

  setTimelineDuration(timelineDuration - amountTrimmed);
  return timelineVideos;
};
