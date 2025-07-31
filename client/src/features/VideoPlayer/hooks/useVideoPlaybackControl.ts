import { useCallback } from "react";

// Lib imports
import {
  pauseAllVideos,
  resetAllVideos,
  resetAllVideosExceptVideo,
} from "../libs/videoPlaybackControl";

// Hook imports
import { useVideoRendering } from "../context/VideoRendering/useVideoRendering";
import { useTimeline } from "../../EditingBar/context/Timeline/useTimeline";
import { TimelineVideo } from "../../../types/video.types";

export const useVideoPlaybackControl = () => {
  const { videoRefs } = useVideoRendering();
  const { timelineVideos } = useTimeline();

  const pauseAllVideoElements = useCallback(() => {
    pauseAllVideos(videoRefs.current);
  }, [videoRefs]);

  const resetAllVideoElements = useCallback(() => {
    resetAllVideos(timelineVideos, videoRefs.current);
  }, [videoRefs, timelineVideos]);

  const resetAllVideoElementsExcept = useCallback(
    (exceptVideo: TimelineVideo) => {
      resetAllVideosExceptVideo(timelineVideos, videoRefs.current, exceptVideo);
    },
    [videoRefs, timelineVideos]
  );

  return {
    pauseAllVideoElements,
    resetAllVideoElements,
    resetAllVideoElementsExcept,
  };
};
