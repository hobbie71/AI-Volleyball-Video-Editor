import { useState, useRef, Dispatch, SetStateAction } from "react";
import { createContext } from "react";
import { TimelineVideo } from "../../../../../../shared/types/video.types";

type TimelineContextType = {
  timelineContainerRef: React.RefObject<HTMLDivElement | null>;
  timelineDuration: number;
  setTimelineDuration: Dispatch<SetStateAction<number>>;
  timelineVideos: TimelineVideo[];
  setTimelineVideos: Dispatch<SetStateAction<TimelineVideo[]>>;
  timelineContainerWidth: number;
  setTimelineContainerWidth: Dispatch<SetStateAction<number>>;
};

const TimelineContext = createContext<undefined | TimelineContextType>(
  undefined
);

export const TimelineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  const [timelineDuration, setTimelineDuration] = useState(0);
  const [timelineVideos, setTimelineVideos] = useState<TimelineVideo[]>([]);
  const [timelineContainerWidth, setTimelineContainerWidth] =
    useState<number>(0);

  return (
    <TimelineContext.Provider
      value={{
        timelineContainerRef,
        timelineDuration,
        setTimelineDuration,
        timelineVideos,
        setTimelineVideos,
        timelineContainerWidth,
        setTimelineContainerWidth,
      }}>
      {children}
    </TimelineContext.Provider>
  );
};

export { TimelineContext };
