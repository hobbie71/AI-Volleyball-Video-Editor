// Context imports
import { useVideoRendering } from "../context/VideoRendering/useVideoRendering";

interface Props {
  id: string;
  url: string;
}

const VideoElement = ({ id, url }: Props) => {
  const { videoRefs } = useVideoRendering();

  return (
    <video
      className="video-element"
      src={url}
      id={`video-${id}`}
      preload="auto"
      ref={(el) => {
        if (el) videoRefs.current[id] = el;
      }}
    />
  );
};

export default VideoElement;
