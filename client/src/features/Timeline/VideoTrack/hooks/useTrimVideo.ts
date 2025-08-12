import { useCallback } from "react";

// Hook imports
import { useCurrentTimelineVideo } from "../../../VideoPlayer/hooks/useCurrentTimelineVideo";
import { useTimelineControl } from "../../hooks/useTimelineControl";

// Lib imports
import { getTimelineWhenTrim } from "../../libs/getTimelineWhenTrim";

// Context imports
import { useTimeline } from "../../context/Timeline/useTimeline";
import { useCurrentTime } from "../../../VideoPlayer/context/CurrentTime/useCurrentTime";

export const useTrimVideo = () => {
  const { getCurrentTimelineVideoAt } = useCurrentTimelineVideo();
  const { setTimelineVideos, setTimelineDuration } = useTimeline();
  const { setIsVideoPlaying } = useCurrentTime();
  const { setTimelineTime } = useTimelineControl();

  const trimLeftSide = useCallback(
    (timelineTime: number) => {
      const currentVideo = getCurrentTimelineVideoAt(timelineTime);
      if (!currentVideo) return;

      setIsVideoPlaying(false);

      const amountTrimmed = timelineTime - currentVideo.timelineStartTime;
      currentVideo.startTime += amountTrimmed;
      currentVideo.timelineEndTime -= amountTrimmed;

      setTimelineVideos((prev) =>
        getTimelineWhenTrim(currentVideo, amountTrimmed, prev)
      );
      setTimelineDuration((prev) => prev - amountTrimmed);
      setTimelineTime(currentVideo.timelineStartTime + 0.01);
    },
    [
      getCurrentTimelineVideoAt,
      setIsVideoPlaying,
      setTimelineDuration,
      setTimelineVideos,
      setTimelineTime,
    ]
  );

  const trimRightSide = useCallback(
    (timelineTime: number) => {
      const currentVideo = getCurrentTimelineVideoAt(timelineTime);
      if (!currentVideo) return;

      setIsVideoPlaying(false);

      const amountTrimmed = currentVideo.timelineEndTime - timelineTime;
      currentVideo.endTime -= amountTrimmed;
      currentVideo.timelineEndTime -= amountTrimmed;

      setTimelineVideos((prev) =>
        getTimelineWhenTrim(currentVideo, amountTrimmed, prev)
      );
      setTimelineDuration((prev) => prev - amountTrimmed);
    },
    [
      setIsVideoPlaying,
      setTimelineVideos,
      setTimelineDuration,
      getCurrentTimelineVideoAt,
    ]
  );

  return { trimLeftSide, trimRightSide };
};
