import { useCallback } from "react";

// Context imports
import { useVideoRendering } from "../context/VideoRendering/useVideoRendering";

// Hook imports
import { useCurrentTimelineVideo } from "./useCurrentTimelineVideo";

// Lib imports
import { drawVideoFrame } from "../libs/drawVideoFrame";

export const useDrawFrame = () => {
  const { canvasRef, videoRefs } = useVideoRendering();
  const { currentVideo } = useCurrentTimelineVideo();

  const drawFrameAtCurrentTime = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentVideo) return;

    const videoElement = videoRefs.current[currentVideo.id];
    if (!videoElement) return;

    drawVideoFrame(canvas, videoElement, currentVideo.motionEffects);
  }, [canvasRef, videoRefs, currentVideo]);

  const drawFrameAtTime = useCallback(
    async (timelineTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !currentVideo) return;

      const timeInVideo =
        timelineTime - currentVideo.timelineStartTime + currentVideo.startTime;

      const videoElement = videoRefs.current[currentVideo.id];

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
    [canvasRef, videoRefs, currentVideo]
  );

  return { drawFrameAtCurrentTime, drawFrameAtTime };
};
