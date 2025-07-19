import { useRef } from "react";
import VideoBlock from "./VideoBlock";
import { useVideo } from "../../contexts/video/VideoContext";
import { useVideoEditing } from "../../contexts/videoEditing/VideoEditingContext";

interface Props {
  zoomDuration: number;
  setShowHoverPointer: (bool: boolean) => void;
  getClickedTime: (clientX: number) => number;
}

const VideoTrack = ({
  zoomDuration,
  setShowHoverPointer,
  getClickedTime,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { allTimelineVideos, setAllTimelineVideos, timelineDuration } =
    useVideo();

  const {
    updateVideoTimesWhenTrim,
    updateVideoTimesWhenMove,
    setTimelineTime,
    setCurrentVideoSelected,
  } = useVideoEditing();

  return (
    <div
      ref={containerRef}
      className="video-track"
      style={{
        width: `${(timelineDuration / zoomDuration) * 100}%`,
      }}>
      {allTimelineVideos?.map((video, index) => (
        <VideoBlock
          key={video.id}
          index={index}
          video={video}
          setAllTimelineVideos={setAllTimelineVideos}
          timelineDuration={timelineDuration}
          setShowHoverPointer={setShowHoverPointer}
          getClickedTime={getClickedTime}
          prevEndTime={
            index === 0 ? 0 : allTimelineVideos[index - 1].timelineEndTime
          }
          updateVideoTimesWhenTrim={updateVideoTimesWhenTrim}
          updateVideoTimesWhenMove={updateVideoTimesWhenMove}
          setTimelineTime={setTimelineTime}
          zoomDuration={zoomDuration}
          setCurrentVideoSelected={setCurrentVideoSelected}
        />
      ))}
    </div>
  );
};

export default VideoTrack;
