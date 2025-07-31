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
import { useCurrentTimelineVideo } from "./useCurrentTimelineVideo";

// Context imports
import { useCurrentTime } from "../context/CurrentTime/useCurrentTime";

export const useVideoPlaybackControl = () => {
  const { videoRefs } = useVideoRendering();
  const { timelineVideos } = useTimeline();
  const { isVideoPlaying, setIsVideoPlaying } = useCurrentTime();
  const { getCurrentVideoElement } = useCurrentTimelineVideo();

  const resetAllVideoElements = useCallback(() => {
    resetAllVideos(timelineVideos, videoRefs.current);
  }, [videoRefs, timelineVideos]);

  const resetAllVideoElementsExcept = useCallback(
    (exceptVideo: TimelineVideo) => {
      resetAllVideosExceptVideo(timelineVideos, videoRefs.current, exceptVideo);
    },
    [videoRefs, timelineVideos]
  );

  const playVideo = useCallback(() => {
    const currentVideoElement = getCurrentVideoElement();
    currentVideoElement?.play();
    setIsVideoPlaying(true);
  }, [setIsVideoPlaying, getCurrentVideoElement]);

  const pauseVideo = useCallback(() => {
    pauseAllVideos(videoRefs.current);
    setIsVideoPlaying(false);
  }, [setIsVideoPlaying, videoRefs]);

  const toggleVideoPlaying = useCallback(() => {
    if (isVideoPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  }, [pauseVideo, playVideo, isVideoPlaying]);

  return {
    resetAllVideoElements,
    resetAllVideoElementsExcept,
    playVideo,
    pauseVideo,
    isVideoPlaying,
    toggleVideoPlaying,
  };
};
