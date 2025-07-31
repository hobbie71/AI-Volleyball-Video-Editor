import { createContext, useCallback, useState } from "react";
import { Video } from "../../../../types/video.types";

type VideoLibraryContextType = {
  videos: Video[];
  addVideo: (video: Video) => void;
  removeVideo: (id: string) => void;
};

const VideoLibraryContext = createContext<undefined | VideoLibraryContextType>(
  undefined
);

export const VideoLibraryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [videos, setVideos] = useState<Video[]>([]);

  const addVideo = useCallback((video: Video) => {
    setVideos((prev) => [...prev, video]);
  }, []);

  const removeVideo = useCallback(
    (id: string) => {
      const index = videos.findIndex((video) => video.id === id);
      setVideos((prev) => prev.splice(index, 1));
    },
    [videos]
  );

  return (
    <VideoLibraryContext.Provider value={{ videos, addVideo, removeVideo }}>
      {children}
    </VideoLibraryContext.Provider>
  );
};

export { VideoLibraryContext };
