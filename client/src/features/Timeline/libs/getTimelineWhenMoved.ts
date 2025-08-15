import { TimelineVideo } from "../../../../../shared/types/video.types";

export const getTimelineWhenMoved = (timelineVideos: TimelineVideo[]) => {
  timelineVideos.forEach((video, index) => {
    if (index === 0) {
      video.timelineStartTime = 0;
      video.timelineEndTime = video.endTime - video.startTime;
    } else {
      const prevVideo = timelineVideos[index - 1];
      video.timelineStartTime = prevVideo.timelineEndTime;
      video.timelineEndTime =
        video.timelineStartTime + video.endTime - video.startTime;
    }
  });

  return timelineVideos;
};
