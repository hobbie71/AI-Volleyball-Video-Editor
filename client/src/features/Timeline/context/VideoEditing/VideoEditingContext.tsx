import { createContext, useState } from "react";
import { TimelineVideo } from "../../../../types/video.types";

type VideoEditingContextType = {
  videoSelected: TimelineVideo | null;
  setVideoSelected: (video: TimelineVideo) => void;
};

const VideoEditingContext = createContext<undefined | VideoEditingContextType>(
  undefined
);

export const VideoEditingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [videoSelected, setVideoSelected] = useState<TimelineVideo | null>(
    null
  );

  return (
    <VideoEditingContext.Provider value={{ videoSelected, setVideoSelected }}>
      {children}
    </VideoEditingContext.Provider>
  );
};

export { VideoEditingContext };
