export type CurrentTimeContextType = {
  currentTime: number;
  currentTimeRef: React.RefObject<number>;
  updateCurrentTime: (newTime: number) => void;
  syncCurrentTime: () => void;
  getCurrentTimeFormatted: () => string;
  isVideoPlaying: boolean
  setIsVideoPlaying: (state: boolean) => void
};
  