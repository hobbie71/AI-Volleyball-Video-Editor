import React, { useRef, useState, useCallback } from "react";
import { CurrentTimeContext } from "./CurrentTimeContext";

export const CurrentTimeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentTimeRef = useRef<number>(0);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  const syncCurrentTime = useCallback(() => {
    setCurrentTime(currentTimeRef.current);
  }, []);

  const updateCurrentTime = useCallback((newTime: number) => {
    currentTimeRef.current = newTime;
    setCurrentTime(newTime);
  }, []);

  const getCurrentTimeFormatted = () => {
    const time = Math.trunc(currentTime);
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    const milliseconds = Math.floor((currentTime - time) * 100);
    return (
      `${hours < 10 ? `0${hours}` : hours}:` +
      `${minutes < 10 ? `0${minutes}` : minutes}:` +
      `${seconds < 10 ? "0" + seconds : seconds}.` +
      `${milliseconds.toString().padStart(2, "0")}`
    );
  };

  return (
    <CurrentTimeContext.Provider
      value={{
        currentTimeRef,
        currentTime,
        syncCurrentTime,
        updateCurrentTime,
        getCurrentTimeFormatted,
        isVideoPlaying,
        setIsVideoPlaying,
      }}>
      {children}
    </CurrentTimeContext.Provider>
  );
};
