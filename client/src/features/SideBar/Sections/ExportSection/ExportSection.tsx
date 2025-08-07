import { useState } from "react";

// Style import
import "./ExportSection.css";

// Icon import
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Hook imports
import { useExportSettings } from "../../context/useExportSettings";
import { useExport } from "../../hooks/useExport";

const ExportSection = () => {
  const { resolutions, formats, bitrates, framerates } = useExportSettings();
  const { exportTimeline, getExportSettings, setExportSetting } = useExport();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleExport = async () => {
    setShowConfirm(false);
    await exportTimeline();
  };

  const handleChange = (
    key: keyof ReturnType<typeof getExportSettings>,
    value: string
  ) => {
    setExportSetting({ [key]: value });
  };

  const currentSettings = getExportSettings();

  return (
    <div className="sidebar-section export-section">
      <h3>Export Settings</h3>
      <label>
        Resolution
        <select
          value={currentSettings.resolution}
          onChange={(e) => handleChange("resolution", e.target.value)}>
          {resolutions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Format
        <select
          value={currentSettings.format}
          onChange={(e) => handleChange("format", e.target.value)}>
          {formats.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Bitrate
        <select
          value={currentSettings.bitrate}
          onChange={(e) => handleChange("bitrate", e.target.value)}>
          {bitrates.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Framerate
        <select
          value={currentSettings.framerate}
          onChange={(e) => handleChange("framerate", e.target.value)}>
          {framerates.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <button className="export-btn" onClick={() => setShowConfirm(true)}>
        Export Video
      </button>
      {showConfirm && (
        <div className="export-confirm-row">
          <button
            className="export-confirm-btn"
            title="Confirm Export"
            onClick={handleExport}>
            <FaCheckCircle color="#43a047" size={28} />
          </button>
          <button
            className="export-cancel-btn"
            title="Cancel"
            onClick={() => setShowConfirm(false)}>
            <FaTimesCircle color="#e53935" size={28} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportSection;
