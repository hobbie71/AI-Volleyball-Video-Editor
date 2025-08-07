// Style import
import "./EditingPage.css";

// Component imports
import VideoPlayer from "../../features/VideoPlayer/VideoPlayer";
import Timeline from "../../features/Timeline/Timeline";
import SideBar from "../../features/SideBar/SideBar";

const EditingPage = () => {
  return (
    <div className="editing-page-layout">
      <div className="sidebar-container">
        <SideBar />
      </div>
      <div className="video-player-timeline-container">
        <div className="video-player-container">
          <VideoPlayer />
        </div>
        <div className="timeline-container">
          <Timeline />
        </div>
      </div>
    </div>
  );
};

export default EditingPage;
