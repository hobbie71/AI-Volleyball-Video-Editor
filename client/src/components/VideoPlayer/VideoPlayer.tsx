import { useEffect } from "react";
import EditingButtons from "../EditingButtons/EditingButtons";
import { useVideo } from "../../contexts/video/VideoContext";
import { useCurrentTime } from "../../contexts/currentTime/CurrentTimeContext";
import { useVideoEditing } from "../../contexts/videoEditing/VideoEditingContext";

interface Props {
  videoPlayerIsReady: () => void;
}

const VideoPlayer = ({ videoPlayerIsReady }: Props) => {
  const { canvasRef, videoRefs, allTimelineVideos, timelineDuration } =
    useVideo();
  const { updateCurrentTime, isVideoPlaying, setIsVideoPlaying } =
    useCurrentTime();
  const {
    drawFrameAtTime,
    drawFrameAtCurrentTime,
    getCurrentVideoPlaying,
    pauseAllVideos,
    resetAllVideosExceptVideoPlaying,
  } = useVideoEditing();

  const checkVideosReady = () => {
    const allReady = Object.values(videoRefs.current).every(
      (video) => video.readyState >= 2
    );
    if (allReady) {
      videoPlayerIsReady();
      drawStartingFrames();
    }
  };

  const drawStartingFrames = () => {
    const video = allTimelineVideos[0];
    const videoElement = videoRefs.current[video.id];
    videoElement.currentTime = 0; // start from beginning
    drawFrameAtTime(0);
  };

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

  useEffect(() => {
    const currentVideo = getCurrentVideoPlaying();
    if (!currentVideo) return;

    const videoElement = videoRefs.current[currentVideo.id];
    if (!videoElement) return;

    if (isVideoPlaying) {
      resetAllVideosExceptVideoPlaying();

      const currentPlaybackTime = videoElement.currentTime;

      // Only seek if we're *before* the start of the current video block
      if (currentPlaybackTime < currentVideo.startTime - 0.01) {
        videoElement.currentTime = currentVideo.startTime;
      }

      videoElement.play();
    } else {
      pauseAllVideos();
      drawFrameAtCurrentTime();
    }
  }, [
    isVideoPlaying,
    getCurrentVideoPlaying,
    resetAllVideosExceptVideoPlaying,
    pauseAllVideos,
    drawFrameAtCurrentTime,
    videoRefs,
  ]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          height: "70vh",
        }}
        width={3840}
        height={2160}>
        {allTimelineVideos.map(({ id, url }) => (
          <video
            key={`${id}`}
            id={`video-${id}`}
            ref={(el) => {
              if (el) {
                videoRefs.current[id] = el;
              } else {
                delete videoRefs.current[id];
              }
            }}
            src={url}
            preload="auto"
            onLoadedData={checkVideosReady}
            style={{
              visibility: "hidden",
              width: "100%",
            }}
          />
        ))}
      </canvas>
      <EditingButtons
        isVideoPlaying={isVideoPlaying}
        setIsVideoPlaying={setIsVideoPlaying}
      />
    </div>
  );
};

export default VideoPlayer;
