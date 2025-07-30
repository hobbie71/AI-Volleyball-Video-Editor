import { useCallback } from "react";

// Lib Imports
import { getVideoMetaData } from "../lib/getVideoMetaData";
import { uploadVideoToBackend } from "../lib/uploadVideoToBackend";

// Hook Imports
import { useVideoTimeline } from "../../../features/EditingBar/VideoTimeline/hooks/useVideoTimline";

// Type Imports
import { Video } from "../../../types/video.types";

// Context Imports
import { useVideoLibrary } from "../context/useVideoLibrary";

export const useVideoUploader = () => {
  const { videos, addVideo } = useVideoLibrary();
  const { initTimelineWithVideo, timelineVideos } = useVideoTimeline();

  const uploadVideo = useCallback(
    async (files: File | File[]) => {
      const fileArray = Array.isArray(files) ? files : [files];
      const newVideos: Video[] = [];

      for (const file of fileArray) {
        const newVideo = await getVideoMetaData(file);
        newVideos.push(newVideo);

        await uploadVideoToBackend(newVideo.file, newVideo.id);

        // Initalize timeline by adding a video block
        if (timelineVideos.length === 0) initTimelineWithVideo(newVideo);

        addVideo(file);
      }
    },
    [initTimelineWithVideo, addVideo, timelineVideos.length]
  );

  return { videos, uploadVideo };
};
