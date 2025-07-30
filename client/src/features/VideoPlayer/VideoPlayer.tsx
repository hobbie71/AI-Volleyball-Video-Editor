import Canvas from "./components/Canvas";
import VideoElement from "./components/VideoElement";
import { useVideo } from "../../contexts/video/VideoContext";

import "./VideoPlayer.css";

const VideoPlayer = () => {
  const { allTimelineVideos } = useVideo();

  return (
    <Canvas height={3840} width={2160}>
      {allTimelineVideos.map((video) => (
        <VideoElement key={video.id} id={video.id} url={video.url} />
      ))}
    </Canvas>
  );
};

export default VideoPlayer;
