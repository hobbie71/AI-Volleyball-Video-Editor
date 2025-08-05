import { useRef } from "react";

// Style import
import "./VideoTrack.css";

// Component imports
import VideoBlock from "./components/VideoBlock/VideoBlock";

// Context imports
import { useTimeline } from "../context/Timeline/useTimeline";

interface Props {
  zoomDuration: number;
  setShowHoverPointer: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoTrack = ({ zoomDuration, setShowHoverPointer }: Props) => {
  // Hooks
  const { timelineDuration, timelineVideos } = useTimeline();

  // Refs
  const videoTrackRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={videoTrackRef}
      className="video-track"
      style={{
        width: `${(timelineDuration / zoomDuration) * 100}%`,
      }}>
      {timelineVideos?.map((video, index) => (
        <VideoBlock
          key={video.id}
          index={index}
          video={video}
          timelineDuration={timelineDuration}
          setShowHoverPointer={setShowHoverPointer}
          prevEndTime={
            index === 0 ? 0 : timelineVideos[index - 1].timelineEndTime
          }
        />
      ))}
    </div>
  );
};

export default VideoTrack;
