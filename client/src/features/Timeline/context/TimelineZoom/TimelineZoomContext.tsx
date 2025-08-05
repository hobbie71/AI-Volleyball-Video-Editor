import { useState } from "react";
import { createContext } from "react";

type TimelineZoomContextType = {
  scrollLeft: number;
  setScrollLeft: React.Dispatch<React.SetStateAction<number>>;
  zoomDuration: number;
  setZoomDuration: React.Dispatch<React.SetStateAction<number>>;
};

const TimelineZoomContext = createContext<undefined | TimelineZoomContextType>(
  undefined
);

export const TimelineZoomProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [zoomDuration, setZoomDuration] = useState<number>(0);

  return (
    <TimelineZoomContext.Provider
      value={{
        scrollLeft,
        setScrollLeft,
        zoomDuration,
        setZoomDuration,
      }}>
      {children}
    </TimelineZoomContext.Provider>
  );
};

export { TimelineZoomContext };
