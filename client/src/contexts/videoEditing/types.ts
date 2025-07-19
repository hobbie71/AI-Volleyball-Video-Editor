import { Video } from "../video/types"

export type MotionEffects = {
  x: number
  y: number
  scale: number
  rotation: number
}

export type VideoEditingContextType = {
  setTimelineTime: (newTime: number, showPreview?: boolean) => void;
  getCurrentVideoPlaying: (time?: number) => Video | null;
  drawFrameAtTime: (newTime: number) => void;
  updateVideoTimesWhenTrim: (video: Video, amountTrimmed: number) => void
  updateVideoTimesWhenMove: (updatedVideos: Video[]) => Video[]
  addSplit: (time?: number) => void;
  deleteCurrentVideoSelected: () => void;
  setCurrentVideoSelected: (video: Video | null) => void
  currentVideoSelected: Video | null;
  drawFrameAtCurrentTime: () => void
  pauseAllVideos: () => void
  resetAllVideosExceptVideoPlaying: () => void
  jumpToNextBlock: () => void
  jumpToPreviousBlock: () => void
  trimLeftSide: () => void
  trimRightSide: () => void
  updateCurrentVideoMotionEffects: (motionEffects: MotionEffects) => void
};