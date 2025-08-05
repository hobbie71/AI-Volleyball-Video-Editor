import { useCallback } from "react";

// Type imports
import { Video, TimelineVideo } from "../../../types/video.types";

// Lib imports
import { getTimelineWithNewVideo } from "../libs/getTimelineWithNewVideo";
import { getInitTimelineWithVideo } from "../libs/getInitTimelineWithVideo";
import { getTimelineWhenMoved } from "../libs/getTimelineWhenMoved";

// Context imports
import { useTimeline } from "../context/Timeline/useTimeline";

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

  const deleteVideoFromTimeline = useCallback(
    (timelineVideo: TimelineVideo) => {
      let updatedTimelineVideos = [...timelineVideos];

      const videoIndex = updatedTimelineVideos.findIndex(
        (video) => video.id === timelineVideo.id
      );

      if (videoIndex === -1) return;

      updatedTimelineVideos.splice(videoIndex, 1);
      updatedTimelineVideos = getTimelineWhenMoved(updatedTimelineVideos);

      setTimelineVideos(updatedTimelineVideos);

      const newTimelineDuration =
        updatedTimelineVideos[updatedTimelineVideos.length - 1].timelineEndTime;

      setTimelineDuration(newTimelineDuration);
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

  return {
    addVideoToTimeline,
    deleteVideoFromTimeline,
    initTimelineWithVideo,
    timelineVideos,
  };
};
