import { useCallback } from "react";

// Lib Imports
import { getVideoMetaData } from "../lib/getVideoMetaData";
import { uploadVideoToBackend } from "../lib/uploadVideoToBackend";

// Hook Imports
import { useVideoTimeline } from "../../../features/EditingBar/VideoTimeline/hooks/useVideoTimeline";

// Type Imports
import { Video } from "../../../types/video.types";

// Context Imports
import { useVideoLibrary } from "../context/VideoLibrary/useVideoLibrary";
import { useVideoUpload } from "../context/VideoUpload/useVideoLibrary";

export const useVideoUploader = () => {
  const { videos, addVideo } = useVideoLibrary();
  const { initTimelineWithVideo, timelineVideos } = useVideoTimeline();
  const { isLoading, setIsLoading } = useVideoUpload();

  const uploadVideo = useCallback(
    async (files: File | File[]) => {
      setIsLoading(true);
      const fileArray = Array.isArray(files) ? files : [files];
      const newVideos: Video[] = [];

      for (const file of fileArray) {
        const newVideo = await getVideoMetaData(file);
        newVideos.push(newVideo);

        await uploadVideoToBackend(newVideo.file, newVideo.id);

        // Initalize timeline by adding a video block
        if (timelineVideos.length === 0) initTimelineWithVideo(newVideo);

        addVideo(newVideo);
      }
      setIsLoading(false);
    },
    [initTimelineWithVideo, addVideo, timelineVideos.length, setIsLoading]
  );

  return { videos, uploadVideo, isLoading };
};
