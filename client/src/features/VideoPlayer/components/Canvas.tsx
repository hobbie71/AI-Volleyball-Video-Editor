import { useEffect } from "react";

interface Props {
  children?: React.ReactNode;
  height: number;
  width: number;
}

const Canvas = ({ children, height, width }: Props) => {
  useEffect(() => {
    if (!isVideoPlaying) return;

    let animationFrameId: number;
    let currentVideo = getCurrentVideoPlaying();
    if (!currentVideo) return;

    let videoElement = videoRefs.current[currentVideo.id];
    if (!videoElement) return;

    let prevVideoElement: HTMLVideoElement | null = null;

    const drawLoop = () => {
      const nextVideo = getCurrentVideoPlaying();
      if (!nextVideo || !currentVideo) return;

      if (nextVideo !== currentVideo) {
        if (prevVideoElement) prevVideoElement.pause();

        videoElement = videoRefs.current[nextVideo.id];
        videoElement.play();

        prevVideoElement = videoElement;
        currentVideo = nextVideo;
      }

      if (!videoElement) return;

      const newTime =
        videoElement.currentTime +
        currentVideo.timelineStartTime -
        currentVideo.startTime;

      updateCurrentTime(newTime);
      drawFrameAtCurrentTime();

      if (newTime >= timelineDuration) {
        setIsVideoPlaying(false);
        updateCurrentTime(0);
        drawFrameAtTime(0);
        return;
      }

      animationFrameId = requestAnimationFrame(drawLoop);
    };

    animationFrameId = requestAnimationFrame(drawLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isVideoPlaying,
    getCurrentVideoPlaying,
    updateCurrentTime,
    drawFrameAtCurrentTime,
    drawFrameAtTime,
    videoRefs,
    setIsVideoPlaying,
    timelineDuration,
  ]);

  return (
    <canvas className="canvas" height={height} width={width}>
      {children}
    </canvas>
  );
};

export default Canvas;
