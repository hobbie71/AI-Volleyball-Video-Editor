import { useCallback } from "react";

// Lib imports
import { getTimelineWhenMoved } from "../VideoTimeline/libs/getTimelineWhenMoved";

// Hook imports
import { useTimeline } from "../context/Timeline/useTimeline";

// Type imports
import { TimelineVideo } from "../../../types/video.types";

export const useDeleteVideo = () => {
  const { timelineVideos, setTimelineVideos, setTimelineDuration } =
    useTimeline();

  const deleteTimelineVideo = useCallback(
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

  return { deleteTimelineVideo };
};
