import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// Context imports
import { useCurrentTime } from "../../../VideoPlayer/context/CurrentTime/useCurrentTime";
import { useTimeline } from "../../context/Timeline/useTimeline";

// Hook imports
import { useCurrentTimelineVideo } from "../../../VideoPlayer/hooks/useCurrentTimelineVideo";

// Type imports
import { TimelineVideo } from "../../../../types/video.types";

export const useSplitVideo = () => {
  const { currentTimeRef } = useCurrentTime();
  const { currentVideo, currentVideoIndex } = useCurrentTimelineVideo();
  const { setTimelineVideos } = useTimeline();

  const splitVideoAtTime = useCallback(
    (time = currentTimeRef.current) => {
      if (!currentVideo) return;

      const timeInVideo =
        currentVideo.startTime + (time - currentVideo.timelineStartTime);

      const videoLeft: TimelineVideo = {
        ...currentVideo,
        id: uuidv4(),
        endTime: timeInVideo,
        timelineEndTime: time,
      };

      const videoRight: TimelineVideo = {
        ...currentVideo,
        id: uuidv4(),
        startTime: timeInVideo,
        timelineStartTime: time,
      };

      setTimelineVideos((prev) => {
        const newTimeline = [...prev];
        newTimeline.splice(currentVideoIndex, 1, videoLeft, videoRight);
        return newTimeline;
      });
    },
    [currentTimeRef, currentVideo, currentVideoIndex, setTimelineVideos]
  );

  return { splitVideoAtTime };
};
