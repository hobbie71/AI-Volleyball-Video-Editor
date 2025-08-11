import { useCallback } from "react";

// Context imports
import { useVideoRendering } from "../context/VideoRendering/useVideoRendering";
import { useCurrentTime } from "../context/CurrentTime/useCurrentTime";

// Hook imports
import { useCurrentTimelineVideo } from "./useCurrentTimelineVideo";

// Lib imports
import { drawVideoFrame } from "../libs/drawVideoFrame";

export const useDrawFrame = () => {
  const { canvasRef, videoRefs } = useVideoRendering();
  const { getCurrentTimelineVideoAt } = useCurrentTimelineVideo();
  const { currentTimeRef } = useCurrentTime();

  const drawFrameAtCurrentTime = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentVideo = getCurrentTimelineVideoAt(currentTimeRef.current);
    if (!currentVideo) return;

    const videoElement = videoRefs.current[currentVideo.id];

    drawVideoFrame(canvas, videoElement, currentVideo.motionEffects);
  }, [canvasRef, videoRefs, currentTimeRef, getCurrentTimelineVideoAt]);

  const drawFrameAtTime = useCallback(
    async (timelineTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const currentVideo = getCurrentTimelineVideoAt(timelineTime);
      if (!currentVideo) return;

      const videoElement = videoRefs.current[currentVideo.id];
      if (!videoElement) return;

      const timeInVideo =
        timelineTime - currentVideo.timelineStartTime + currentVideo.startTime;

      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          videoElement.removeEventListener("seeked", onSeeked);
          resolve();
        };
        videoElement.addEventListener("seeked", onSeeked, { once: true });
        videoElement.currentTime = timeInVideo;
      });

      drawVideoFrame(canvas, videoElement, currentVideo.motionEffects);
    },
    [canvasRef, videoRefs, getCurrentTimelineVideoAt]
  );

  return { drawFrameAtCurrentTime, drawFrameAtTime };
};
