import { useCallback } from "react";

// Context imports
import { useVideoRendering } from "../context/VideoRendering/useVideoRendering";

// Hook imports
import { useCurrentTimelineVideo } from "./useCurrentTimelineVideo";

export const useDrawFrame = () => {
  const { canvasRef, videoRefs } = useVideoRendering();
  const { currentVideo } = useCurrentTimelineVideo();

  const drawFrameAtCurrentTime = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!currentVideo) return;

    const videoElement = videoRefs.current[currentVideo.id];

    if (currentVideo.motionEffects) {
      const { x, y, scale, rotation } = currentVideo.motionEffects;

      const angleRad = (rotation * Math.PI) / 180;

      const vidWidth = videoElement.videoWidth;
      const vidHeight = videoElement.videoHeight;

      const centerX = vidWidth / 2;
      const centerY = vidHeight / 2;

      ctx.clearRect(0, 0, vidWidth, vidHeight);
      ctx.save();

      // Move canvas origin to center
      ctx.translate(centerX + x, centerY + y);

      // Apply rotation
      ctx.rotate(angleRad);

      // Apply scale
      ctx.scale(scale, scale);

      // Draw video frame centered
      ctx.drawImage(
        videoElement,
        -vidWidth / 2,
        -vidHeight / 2,
        vidWidth,
        vidHeight
      );

      ctx.restore();
    } else {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    }
  }, [canvasRef, videoRefs, currentVideo]);

  const drawFrameAtTime = useCallback(
    async (timelineTime: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      if (!currentVideo) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

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

      drawFrameAtCurrentTime();
    },
    [canvasRef, videoRefs, drawFrameAtCurrentTime, currentVideo]
  );

  return { drawFrameAtCurrentTime, drawFrameAtTime };
};
