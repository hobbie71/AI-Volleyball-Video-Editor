import { createContext, useState } from "react";
import { Video } from "../../../../types/video.types";

type VideoEditingContextType = {
  videoSelected: Video | null;
  setVideoSelected: (video: Video) => void;
};

const VideoEditingContext = createContext<undefined | VideoEditingContextType>(
  undefined
);

export const VideoEditingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [videoSelected, setVideoSelected] = useState<Video | null>(null);

  return (
    <VideoEditingContext.Provider value={{ videoSelected, setVideoSelected }}>
      {children}
    </VideoEditingContext.Provider>
  );
};

export { VideoEditingContext };
