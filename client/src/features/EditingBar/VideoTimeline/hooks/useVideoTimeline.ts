import { useCallback } from "react";

// Type imports
import { Video } from "../../../../types/video.types";

// Lib imports
import { getTimelineWithNewVideo } from "../libs/getTimelineWithNewVideo";
import { getInitTimelineWithVideo } from "../libs/getInitTimelineWithVideo";

// Context imports
import { useTimeline } from "../context/useTimeline";

export const useVideoTimeline = () => {
  const { timelineVideos, setTimelineVideos, setTimelineDuration } =
    useTimeline();

  const addVideoToTimeline = useCallback(
    (newVideo: Video) => {
      const { updatedTimeline, updatedDuration } = getTimelineWithNewVideo(
        newVideo,
        timelineVideos
      );

      setTimelineVideos(updatedTimeline);
      setTimelineDuration(updatedDuration);
    },
    [setTimelineDuration, setTimelineVideos, timelineVideos]
  );

  const initTimelineWithVideo = useCallback(
    (video: Video) => {
      const { updateTimeline, duration } = getInitTimelineWithVideo(video);

      setTimelineVideos(updateTimeline);
      setTimelineDuration(duration);
    },
    [setTimelineDuration, setTimelineVideos]
  );

  return { addVideoToTimeline, initTimelineWithVideo, timelineVideos };
};
