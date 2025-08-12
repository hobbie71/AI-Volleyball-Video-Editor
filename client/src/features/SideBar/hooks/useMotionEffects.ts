import { useCallback } from "react";

import { useVideoEditing } from "../../Timeline/context/VideoEditing/useVideoEditing";
import { useTimeline } from "../../Timeline/context/Timeline/useTimeline";

// Type imports
import { MotionEffects, TimelineVideo } from "../../../types/video.types";

export const useMotionEffects = () => {
  const { videoSelected, setVideoSelected } = useVideoEditing();
  const { setTimelineVideos } = useTimeline();

  const setSelectedVideoMotionEffects = useCallback(
    (motionEffects: MotionEffects) => {
      if (!videoSelected) return;

      // Update the video in the timeline videos array
      setTimelineVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoSelected.id
            ? { ...video, motionEffects: motionEffects }
            : video
        )
      );

      // Also update the selected video in context for immediate UI updates
      const updatedVideo = {
        ...videoSelected,
        motionEffects: motionEffects,
      };
      setVideoSelected(updatedVideo);
    },
    [videoSelected, setVideoSelected, setTimelineVideos]
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
