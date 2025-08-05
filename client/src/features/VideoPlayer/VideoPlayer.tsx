import { useEffect } from "react";

// Style import
import "./VideoPlayer.css";

// Component imports
import Canvas from "./components/Canvas";
import VideoElement from "./components/VideoElement";

// Context imports
import { useTimeline } from "../Timeline/context/Timeline/useTimeline";

// Hook imports
import { useVideoPlaybackControl } from "./hooks/useVideoPlaybackControl";
import { useCurrentTimelineVideo } from "./hooks/useCurrentTimelineVideo";

const VideoPlayer = () => {
  const { timelineVideos } = useTimeline();
  const { resetAllVideoElementsExcept, resetAllVideoElements } =
    useVideoPlaybackControl();
  const { currentVideo } = useCurrentTimelineVideo();

  useEffect(() => {
    if (currentVideo) {
      resetAllVideoElementsExcept(currentVideo);
    } else {
      resetAllVideoElements();
    }
  }, [
    timelineVideos,
    currentVideo,
    resetAllVideoElements,
    resetAllVideoElementsExcept,
  ]);

  return (
    <div className="video-player">
      <Canvas width={3840} height={2160}>
        {timelineVideos.map((video) => (
          <VideoElement key={video.id} id={video.id} url={video.url} />
        ))}
      </Canvas>
    </div>
  );
};

export default VideoPlayer;
