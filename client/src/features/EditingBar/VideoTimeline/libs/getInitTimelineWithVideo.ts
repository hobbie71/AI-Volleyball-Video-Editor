import { Video, TimelineVideo } from "../../../../types/video.types";
import { v4 as uuidv4 } from "uuid";

export const getInitTimelineWithVideo = (video: Video) => {
  const newTimelineVideo: TimelineVideo = {
    ...video,
    id: uuidv4(),
    videoId: video.id,
    timelineStartTime: 0,
    timelineEndTime: video.duration,
    motionEffects: null,
  };

  return { updateTimeline: [newTimelineVideo], duration: video.duration };
};
