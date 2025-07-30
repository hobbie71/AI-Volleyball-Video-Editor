export const pauseAllVideos = () => {
  const videoElements = videoRefs.current;

  Object.values(videoElements).forEach((video) => {
    video.pause();
  });
};

export const resetAllVideos = () => {
  allTimelineVideos.forEach((video) => {
    const videoElement = videoRefs.current[video.id];
    videoElement.pause();
    videoElement.currentTime = video.startTime;
  });
};

export const setTimelineTime = (newTime: number, showPreview = false) => {
  drawFrameAtTime(newTime);
  if (!showPreview) updateCurrentTime(newTime);
};

export const resetAllVideosExceptVideoPlaying = () => {
    const currentVideo = getCurrentVideoPlaying();

    allTimelineVideos.forEach((video) => {
      if (video === currentVideo) return;

      const videoElement = videoRefs.current[video.id];
      videoElement.pause();
      videoElement.currentTime = video.startTime;
    }
}