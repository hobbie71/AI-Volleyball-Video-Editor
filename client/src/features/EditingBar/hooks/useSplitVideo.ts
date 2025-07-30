import { useCallback } from "react";

export const useSplitVideo = () => {
  const splitVideoAtTime = useCallback(
    (time = currentTimeRef.current) => {
      const currentVideo = getCurrentVideoPlaying();
      if (!currentVideo)
        throw new Error("No currentVideo. Can't splitVideoAtTime");

      if (currentVideo.timelineStartTime >= time - 1) return;
      if (currentVideo.timelineEndTime <= time + 1) return;

      const videoIndex = allTimelineVideos.findIndex(
        (video) => video === currentVideo
      );

      const splitTime =
        currentVideo.startTime + (time - currentVideo.timelineStartTime);

      const videoLeft = { ...currentVideo };
      videoLeft.id = uuidv4();
      videoLeft.endTime = splitTime;
      videoLeft.timelineEndTime = time;

      const videoRight = { ...currentVideo };
      videoRight.id = uuidv4();
      videoRight.startTime = splitTime;
      videoRight.timelineStartTime = time;

      const updatedAllVideos = [...allTimelineVideos];
      updatedAllVideos.splice(videoIndex, 1, videoLeft, videoRight);
      setAllTimelineVideos(updatedAllVideos);
      setCurrentVideoSelected(null);
    },
    [
      allTimelineVideos,
      currentTimeRef,
      getCurrentVideoPlaying,
      setAllTimelineVideos,
    ]
  );

  return { splitVideoAtTime };
};
