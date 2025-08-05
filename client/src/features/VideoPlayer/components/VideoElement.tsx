// Context imports
import { useVideoRendering } from "../context/VideoRendering/useVideoRendering";

// Hook imports
import { useDrawFrame } from "../hooks/useDrawFrame";

interface Props {
  id: string;
  url: string;
}

const VideoElement = ({ id, url }: Props) => {
  const { videoRefs } = useVideoRendering();
  const { drawFrameAtTime } = useDrawFrame();

  return (
    <video
      className="video-element"
      src={url}
      id={`video-${id}`}
      preload="auto"
      // Init canvas starting frame
      onLoadedData={() => drawFrameAtTime(0)}
      ref={(el) => {
        if (el) videoRefs.current[id] = el;
      }}
    />
  );
};

export default VideoElement;
