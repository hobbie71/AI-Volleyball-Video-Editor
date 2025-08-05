import { Video, TimelineVideo } from "../../../types/video.types";
import { v4 as uuidv4 } from "uuid";

export const getTimelineWithNewVideo = (
  video: Video,
  currentTimeline: TimelineVideo[]
) => {
  const lastEndTime = currentTimeline.length
    ? currentTimeline[currentTimeline.length - 1].timelineEndTime
    : 0;

  const newTimelineVideo: TimelineVideo = {
    ...video,
    id: uuidv4(),
    videoId: video.id,
    timelineStartTime: lastEndTime,
    timelineEndTime: lastEndTime + video.duration,
    motionEffects: null,
  };

  return {
    updatedTimeline: [...currentTimeline, newTimelineVideo],
    updatedDuration: lastEndTime + video.duration,
  };
};
