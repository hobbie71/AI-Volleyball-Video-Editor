import { useVideo } from "../../../contexts/video/VideoContext";

interface Props {
  id: string;
  url: string;
}

const VideoElement = ({ id, url }: Props) => {
  const { videoRefs } = useVideo();

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
