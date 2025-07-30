import { createContext, useState, useRef, useCallback, RefObject } from "react";

type CurrentTimeContextType = {
  currentTime: number;
  currentTimeRef: RefObject<number>;
  isVideoPlaying: boolean;
  updateCurrentTime: (newTime: number) => void;
  syncCurrentTime: () => void;
  setIsVideoPlaying: (state: boolean) => void;
};

const CurrentTimeContext = createContext<CurrentTimeContextType | undefined>(
  undefined
);

export const CurrentTimeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currentTimeRef = useRef(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const syncCurrentTime = useCallback(() => {
    setCurrentTime(currentTimeRef.current);
  }, []);

  const updateCurrentTime = useCallback((newTime: number) => {
    currentTimeRef.current = newTime;
    setCurrentTime(newTime);
  }, []);

  return (
    <CurrentTimeContext.Provider
      value={{
        currentTime,
        currentTimeRef,
        updateCurrentTime,
        syncCurrentTime,
        isVideoPlaying,
        setIsVideoPlaying,
      }}>
      {children}
    </CurrentTimeContext.Provider>
  );
};

export { CurrentTimeContext };
