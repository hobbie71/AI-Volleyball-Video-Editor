import { TimelineVideo, ExportSettings } from "../../../types/video.types";

export const exportVideo = async (
  videos: TimelineVideo[],
  exportSettings: ExportSettings
): Promise<string> => {
  const res = await fetch("http://localhost:4000/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videos, exportSettings }),
  });

  if (!res.ok) throw new Error("Export failed");

  const data = await res.json();
  return `http://localhost:4000${data.url}`;
};
