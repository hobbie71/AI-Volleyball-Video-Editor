import React, { useRef, useState } from "react";
import { VideoContext } from "./VideoContext";
import {
  VideoContextType,
  Video,
  Upload,
  ExportSettings,
  defaultExportSettings,
} from "./types";
import { v4 as uuidv4 } from "uuid";

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});
  const [allTimelineVideos, setAllTimelineVideos] = useState<Video[]>([]);
  const [allVideoUploads, setAllVideoUploads] = useState<Upload[]>([]);
  const [timelineDuration, setTimelineDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exportSettings, setExportSettings] = useState<ExportSettings>(
    defaultExportSettings
  );

  const getVideoData = (file: File): Promise<Upload> => {
    return new Promise((resolve, reject) => {
      const tempVideo = document.createElement("video");
      const fileURL = URL.createObjectURL(file);

      tempVideo.src = fileURL;

      tempVideo.onloadedmetadata = () => {
        const duration = tempVideo.duration;

        tempVideo.currentTime = 0;

        resolve({
          id: uuidv4(),
          file: file,
          fileName: file.name,
          url: fileURL,
          duration: duration,
          startTime: 0,
          endTime: duration,
        });
      };

      tempVideo.onerror = () => {
        reject(new Error("Failed to load video metadata"));
      };
    });
  };

  const uploadVideoFileToBackend = async (file: File, id: string) => {
    const formData = new FormData();
    formData.append("video", file, id);

    const res = await fetch("http://localhost:4000/api/import", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.ok) console.error("Backend Video Upload Failed");
  };

  const uploadVideo = async (files: File | File[]) => {
    const fileArray = Array.isArray(files) ? files : [files];
    const newUploads: Upload[] = [];

    for (const file of fileArray) {
      const newUpload = await getVideoData(file);
      newUploads.push(newUpload);
      setAllVideoUploads((prev) => [...prev, newUpload]);

      await uploadVideoFileToBackend(newUpload.file, newUpload.id);

      // Initalize timeline by adding a video block
      if (allTimelineVideos.length === 0) {
        const newVideo: Video = {
          ...newUpload,
          id: uuidv4(),
          uploadId: newUpload.id,
          timelineStartTime: 0,
          timelineEndTime: newUpload.duration,
          motionEffects: null,
        };
        setAllTimelineVideos([newVideo]);
        setTimelineDuration(newVideo.duration);
      }
    }
  };

  const addVideoFromUpload = (upload: Upload) => {
    const timelineStartTime =
      allTimelineVideos[allTimelineVideos.length - 1].timelineEndTime;
    const timelineEndTime = timelineStartTime + upload.duration;

    const newVideo: Video = {
      ...upload,
      id: uuidv4(),
      uploadId: upload.id,
      timelineStartTime,
      timelineEndTime,
      motionEffects: null,
    };

    setAllTimelineVideos((prev) => [...prev, newVideo]);
    setTimelineDuration(timelineDuration + newVideo.duration);
  };

  const exportVideo = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (isLoading) return;

      setIsLoading(true);

      (async () => {
        try {
          const res = await fetch("http://localhost:4000/api/export", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              videos: allTimelineVideos,
              exportSettings: exportSettings,
            }),
          });

          if (!res.ok) throw new Error("Export failed");

          const data = await res.json();
          const url = `http://localhost:4000${data.url}`;
          resolve(url);
        } catch (err) {
          console.error(err);
          reject(err);
        }
      })();

      setIsLoading(false);
    });
  };

  const value: VideoContextType = {
    canvasRef,
    videoRefs,
    allTimelineVideos,
    setAllTimelineVideos,
    uploadVideo,
    timelineDuration,
    setTimelineDuration,
    allVideoUploads,
    addVideoFromUpload,
    exportVideo,
    exportSettings,
    setExportSettings,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};
