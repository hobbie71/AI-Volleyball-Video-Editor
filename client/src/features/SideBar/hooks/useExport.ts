import { useCallback, useState } from "react";
import { useExportSettings } from "../context/useExportSettings";

// Lib imports
import { exportVideo } from "../libs/exportVideo";

// Type imports
import { ExportSettings } from "../../../../../shared/types/video.types";

// Context imports
import { useTimeline } from "../../Timeline/context/Timeline/useTimeline";

export const useExport = () => {
  const { resolutions, formats, bitrates, framerates } = useExportSettings();
  const { timelineVideos } = useTimeline();

  const [resolution, setResolution] = useState(resolutions[0].value);
  const [format, setFormat] = useState(formats[0].value);
  const [bitrate, setBitrate] = useState(bitrates[0].value);
  const [framerate, setFramerate] = useState(framerates[0].value);

  const getExportSettings = useCallback(() => {
    const exportSettings: ExportSettings = {
      resolution,
      format,
      bitrate,
      framerate,
    };
    return exportSettings;
  }, [bitrate, format, framerate, resolution]);

  const exportTimeline = useCallback(async () => {
    const res = await exportVideo(timelineVideos, getExportSettings());
    if (!res) throw new Error("Export failed");

    // Download the exported video
    const link = document.createElement("a");
    link.href = res;
    link.download = `exported_video.${getExportSettings().format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [getExportSettings, timelineVideos]);

  const setExportSetting = useCallback((setting: Partial<ExportSettings>) => {
    if (setting.resolution) setResolution(setting.resolution);
    if (setting.format) setFormat(setting.format);
    if (setting.bitrate) setBitrate(setting.bitrate);
    if (setting.framerate) setFramerate(setting.framerate);
  }, []);

  return { getExportSettings, exportTimeline, setExportSetting };
};
