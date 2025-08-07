// Style import
import "./MediaSection.css";

// Component imports
import ImportVideoForm from "../../../../shared/components/ImportVideoForm/ImportVideoForm";
import MediaItem from "./MediaItem/MediaItem";

// Hook imports
import { useVideoLibrary } from "../../../../shared/VideoUpload/context/VideoLibrary/useVideoLibrary";

const MediaSection = () => {
  // Hooks
  const { videos } = useVideoLibrary();
  return (
    <div className="sidebar-section">
      <ImportVideoForm />
      <div className="media-section-title">Media</div>
      <div className="media-list">
        {videos.map((video, index) => (
          <MediaItem key={index} video={video} />
        ))}
      </div>
    </div>
  );
};

export default MediaSection;
