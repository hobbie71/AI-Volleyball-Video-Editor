import { useEffect } from "react";

// Hook imports
import { useDrawFrame } from "../hooks/useDrawFrame";
import { useCurrentTimelineVideo } from "../hooks/useCurrentTimelineVideo";
import { useVideoPlaybackControl } from "../hooks/useVideoPlaybackControl";

// Context imports
import { useTimeline } from "../../EditingBar/context/Timeline/useTimeline";
import { useCurrentTime } from "../context/CurrentTime/useCurrentTime";
import { useVideoRendering } from "../context/VideoRendering/useVideoRendering";

interface Props {
  children?: React.ReactNode;
  width: number;
  height: number;
}

const Canvas = ({ children, width, height }: Props) => {
  const { drawFrameAtCurrentTime, drawFrameAtTime } = useDrawFrame();
  const { isVideoPlaying, pauseVideo, toggleVideoPlaying } =
    useVideoPlaybackControl();
  const { currentVideo, getCurrentVideoElement } = useCurrentTimelineVideo();
  const { timelineDuration } = useTimeline();
  const { updateCurrentTime } = useCurrentTime();
  const { canvasRef } = useVideoRendering();

  useEffect(() => {
    if (!isVideoPlaying) return;
    let animationFrameId: number;

    const drawLoop = () => {
      drawFrameAtCurrentTime();

      if (!currentVideo) return;

      const currentVideoElement = getCurrentVideoElement();
      if (!currentVideoElement) return;

      const newTime =
        currentVideoElement.currentTime +
        currentVideo.timelineStartTime -
        currentVideo.startTime;

      updateCurrentTime(newTime);
      drawFrameAtCurrentTime();

      if (newTime >= timelineDuration) {
        pauseVideo();
        updateCurrentTime(0);
        drawFrameAtTime(0);
        return;
      }

      animationFrameId = requestAnimationFrame(drawLoop);
    };

    animationFrameId = requestAnimationFrame(drawLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [
    currentVideo,
    drawFrameAtCurrentTime,
    drawFrameAtTime,
    getCurrentVideoElement,
    isVideoPlaying,
    pauseVideo,
    timelineDuration,
    updateCurrentTime,
  ]);

  return (
    <canvas
      className="canvas"
      ref={canvasRef}
      width={width}
      height={height}
      onClick={() => toggleVideoPlaying()}>
      {children}
    </canvas>
  );
};

export default Canvas;
