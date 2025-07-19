import { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ExportSettings } from "../../../../contexts/video/types";
import "./ExportSection.css";

interface Props {
  exportVideo: () => Promise<string>;
  exportSettings: ExportSettings;
  setExportSettings: (settings: ExportSettings) => void;
}

const ExportSection = ({
  exportVideo,
  exportSettings,
  setExportSettings,
}: Props) => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // Export settings state
  const [resolution, setResolution] = useState(exportSettings.resolution);
  const [format, setFormat] = useState(exportSettings.format);
  const [bitrate, setBitrate] = useState(exportSettings.bitrate);
  const [framerate, setFramerate] = useState(exportSettings.framerate);

  const handleExport = async () => {
    setShowConfirm(false);

    const url = await exportVideo();
    const link = document.createElement("a");
    link.href = url;
    link.download = `exported_video.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  const handleResolutionChange = (resolution: string) => {
    setExportSettings({ ...exportSettings, resolution });
    setResolution(resolution);
  };

  const handleFormatChange = (format: string) => {
    setExportSettings({ ...exportSettings, format });
    setFormat(format);
  };

  const handleBitrateChange = (bitrate: string) => {
    setExportSettings({ ...exportSettings, bitrate });
    setBitrate(bitrate);
  };

  const handleFramerateChange = (framerate: string) => {
    setExportSettings({ ...exportSettings, framerate });
    setFramerate(framerate);
  };

  return (
    <div className="sidebar-section export-section">
      <h3>Export Settings</h3>
      <label>
        Resolution
        <select
          value={resolution}
          onChange={(e) => handleResolutionChange(e.target.value)}>
          <option value="3840x2160">3840x2160 (4K UHD)</option>
          <option value="2560x1440">2560x1440 (2K QHD)</option>
          <option value="1920x1080">1920x1080 (Full HD)</option>
          <option value="1280x720">1280x720 (HD)</option>
          <option value="854x480">854x480 (SD)</option>
        </select>
      </label>
      <label>
        Format
        <select
          value={format}
          onChange={(e) => handleFormatChange(e.target.value)}>
          <option value="mp4">MP4 (H.264)</option>
          <option value="webm">WebM (VP8)</option>
          <option value="mov">MOV</option>
        </select>
      </label>
      <label>
        Bitrate
        <select
          value={bitrate}
          onChange={(e) => handleBitrateChange(e.target.value)}>
          <option value="1000k">1000k (SD 480p)</option>
          <option value="1500k">1500k (SD 480p High)</option>
          <option value="2500k">2500k (HD 720p)</option>
          <option value="3500k">3500k (HD 720p High)</option>
          <option value="4500k">4500k (FullHD 1080p)</option>
          <option value="6000k">6000k (FullHD 1080p High)</option>
          <option value="10000k">10000k (2K 1440p)</option>
          <option value="16000k">16000k (2K 1440p High)</option>
          <option value="35000k">35000k (4K 2160p)</option>
          <option value="45000k">45000k (4K 2160p High)</option>
        </select>
      </label>
      <label>
        Framerate
        <select
          value={framerate}
          onChange={(e) => handleFramerateChange(e.target.value)}>
          <option value="24">24 fps (Film)</option>
          <option value="30">30 fps (Standard)</option>
          <option value="60">60 fps (High)</option>
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
