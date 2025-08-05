// Lib imports
import { getTimelineWhenMoved } from "../../libs/getTimelineWhenMoved";

// Context imports
import { useTimeline } from "../../context/Timeline/useTimeline";
import { useCallback } from "react";

export const useMoveVideo = () => {
  const { setTimelineVideos } = useTimeline();

  const moveVideoToIndex = useCallback(
    (videoIndex: number, toIndex: number) => {
      setTimelineVideos((prev) => {
        const updatedVideos = [...prev];
        const [moved] = updatedVideos.splice(videoIndex, 1);
        updatedVideos.splice(toIndex, 0, moved);
        return getTimelineWhenMoved(updatedVideos);
      });
    },
    [setTimelineVideos]
  );

  return { moveVideoToIndex };
};
