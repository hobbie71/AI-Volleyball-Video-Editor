import { useState } from "react";
import { Video, Upload } from "../../../../contexts/video/types";
import MediaItem from "./MediaItem";
import PrettyImportVideoForm from "../../../PrettyImportVideoForm/PrettyImportVideoForm";

interface Props {
  allTimelineVideos: Video[];
  setAllTimelineVideos: (videos: Video[]) => void;
  allVideoUploads: Upload[];
}

const MediaSection = ({ allVideoUploads }: Props) => {
  // TODO add isLoading feature when uploading from sidebar
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="sidebar-section" style={{ textAlign: "center" }}>
      <PrettyImportVideoForm setIsLoading={setIsLoading} />
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
        {allVideoUploads.map((upload, index) => (
          <MediaItem key={index} upload={upload} />
        ))}
      </div>
    </div>
  );
};

export default MediaSection;
