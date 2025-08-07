import { useState } from "react";

// Style import
import "./SideBar.css";

// Icon imports
import { FaFilm, FaRegFileVideo, FaRegEdit } from "react-icons/fa";

// Section imports
import MediaSection from "./Sections/MediaSection/MediaSection";
import ExportSection from "./Sections/ExportSection/ExportSection";
import EditSection from "./Sections/EditSection/EditSection";

const ICONS = [
  { key: "edit", icon: <FaRegEdit />, label: "Edit" },
  { key: "media", icon: <FaFilm />, label: "Media" },
  { key: "export", icon: <FaRegFileVideo />, label: "Export" },
];

const SideBar = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleIconClick = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <div className="sidebar">
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
        {openSection === "media" && <MediaSection />}
        {openSection === "export" && <ExportSection />}
        {openSection === "edit" && <EditSection />}
      </div>
    </div>
  );
};

export default SideBar;
