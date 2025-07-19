import { useState } from "react";
import { FaFilm, FaRegFileVideo, FaRegEdit } from "react-icons/fa";
import { useVideo } from "../../contexts/video/VideoContext";
import MediaSection from "./Sections/MediaSection/MediaSection";
import ExportSection from "./Sections/ExportSection/ExportSection";
import EditSection from "./Sections/EditSection/EditSection";
import "./SideBar.css";

const ICONS = [
  { key: "edit", icon: <FaRegEdit />, label: "Edit" },
  { key: "media", icon: <FaFilm />, label: "Media" },
  { key: "export", icon: <FaRegFileVideo />, label: "Export" },
];

const SideBar = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const {
    allTimelineVideos,
    setAllTimelineVideos,
    allVideoUploads,
    exportVideo,
    exportSettings,
    setExportSettings,
  } = useVideo();

  const handleIconClick = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <div className="sidebar-layout">
      <div className="sidebar-icons">
        {ICONS.map(({ key, icon, label }) => (
          <div
            key={key}
            className={`sidebar-icon ${openSection === key ? "active" : ""}`}
            onClick={() => handleIconClick(key)}
            title={label}>
            {icon}
            <p className="sidebar-label">{label}</p>
          </div>
        ))}
      </div>
      <div className={`sidebar-panel ${openSection ? "open" : ""}`}>
        {openSection === "media" && (
          <MediaSection
            allTimelineVideos={allTimelineVideos}
            setAllTimelineVideos={setAllTimelineVideos}
            allVideoUploads={allVideoUploads}
          />
        )}
        {openSection === "export" && (
          <ExportSection
            exportVideo={exportVideo}
            exportSettings={exportSettings}
            setExportSettings={setExportSettings}
          />
        )}
        {openSection === "edit" && <EditSection />}
      </div>
    </div>
  );
};

export default SideBar;
