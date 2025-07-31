import { useState } from "react";
import { createContext } from "react";
import { TimelineVideo } from "../../../../types/video.types";

type TimelineContextType = {
  timelineDuration: number;
  setTimelineDuration: React.Dispatch<React.SetStateAction<number>>;
  timelineVideos: TimelineVideo[];
  setTimelineVideos: React.Dispatch<React.SetStateAction<TimelineVideo[]>>;
};

const TimelineContext = createContext<undefined | TimelineContextType>(
  undefined
);

export const TimelineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [timelineDuration, setTimelineDuration] = useState(0);
  const [timelineVideos, setTimelineVideos] = useState<TimelineVideo[]>([]);

  return (
    <TimelineContext.Provider
      value={{
        timelineDuration,
        setTimelineDuration,
        timelineVideos,
        setTimelineVideos,
      }}>
      {children}
    </TimelineContext.Provider>
  );
};

export { TimelineContext };
