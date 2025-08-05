// Style import
import "./EditingPage.css";

// Component imports
import VideoPlayer from "../../features/VideoPlayer/VideoPlayer";
import Timeline from "../../features/Timeline/Timeline";

const EditingPage = () => {
  return (
    <>
      <div className="video-player-container">
        <VideoPlayer />
      </div>
      <div className="timeline-container">
        <Timeline />
      </div>
    </>
  );
};

export default EditingPage;
