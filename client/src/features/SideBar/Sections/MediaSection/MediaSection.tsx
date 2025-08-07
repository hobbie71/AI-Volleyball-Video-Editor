// Component imports
import ImportVideoForm from "../../../../shared/components/ImportVideoForm/ImportVideoForm";
import MediaItem from "./MediaItem";

// Hook imports
import { useVideoLibrary } from "../../../../shared/VideoUpload/context/VideoLibrary/useVideoLibrary";

const MediaSection = () => {
  // Hooks
  const { videos } = useVideoLibrary();
  return (
    <div className="sidebar-section" style={{ textAlign: "center" }}>
      <ImportVideoForm />
      <div
        style={{
          fontWeight: "600",
          margin: "20px 5px 10px 5px",
          fontSize: "1.25rem",
        }}>
        Media
      </div>
      <div
        className="media"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
        }}>
        {videos.map((video, index) => (
          <MediaItem key={index} video={video} />
        ))}
      </div>
    </div>
  );
};

export default MediaSection;
