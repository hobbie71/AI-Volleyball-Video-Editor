import { useCallback } from "react";
import { TimelineVideo } from "../../../types/video.types";

export const useDeleteVideo = () => {
  const deleteTimelineVideo = useCallback(
    (timelineVideo: TimelineVideo) => {
      if (currentVideoSelected === null) return;
      if (allTimelineVideos.length === 1) return;

      let updatedAllVideos = [...allTimelineVideos];
      const videoIndex = updatedAllVideos.findIndex(
        (video) => video.id === currentVideoSelected.id
      );

      if (videoIndex === -1) return;

      updatedAllVideos.splice(videoIndex, 1);
      updatedAllVideos = updateVideoTimesWhenMove(updatedAllVideos);

      setAllTimelineVideos(updatedAllVideos);

      const newTimelineDuration =
        updatedAllVideos[updatedAllVideos.length - 1].timelineEndTime;

      updateCurrentTime(currentVideoSelected.timelineStartTime);
      setTimelineDuration(newTimelineDuration);
      setCurrentVideoSelected(null);
    },
    [
      allTimelineVideos,
      currentVideoSelected,
      setAllTimelineVideos,
      setTimelineDuration,
      updateCurrentTime,
    ]
  );

  return { deleteTimelineVideo };
};
