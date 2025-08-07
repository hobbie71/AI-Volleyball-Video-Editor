import { useCallback } from "react";

import { useVideoEditing } from "../../Timeline/context/VideoEditing/useVideoEditing";

// Type imports
import { MotionEffects, TimelineVideo } from "../../../types/video.types";

export const useMotionEffects = () => {
  const { videoSelected } = useVideoEditing();

  const setSelectedVideoMotionEffects = useCallback(
    (motionEffects: MotionEffects) => {
      if (!videoSelected) return;

      videoSelected.motionEffects = motionEffects;
    },
    [videoSelected]
  );

  const setVideoMotionEffect = useCallback(
    (timelineVideo: TimelineVideo, motionEffects: MotionEffects) => {
      timelineVideo.motionEffects = motionEffects;
    },
    []
  );

  return {
    setSelectedVideoMotionEffects,
    setVideoMotionEffect,
  };
};
