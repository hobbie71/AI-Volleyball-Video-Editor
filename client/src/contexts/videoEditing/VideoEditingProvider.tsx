import { useCallback, useState } from "react";
import { useVideo } from "../video/VideoContext";
import { useCurrentTime } from "../currentTime/CurrentTimeContext";
import { VideoEditingContext } from "./VideoEditingContext";
import { Video } from "../video/types";
import { v4 as uuidv4 } from "uuid";
import { MotionEffects } from "./types";

export const VideoEditingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentVideoSelected, setCurrentVideoSelected] =
    useState<Video | null>(null);

  const {
    canvasRef,
    allTimelineVideos,
    setAllTimelineVideos,
    setTimelineDuration,
    timelineDuration,
    videoRefs,
  } = useVideo();
  const { currentTimeRef, updateCurrentTime, setIsVideoPlaying } =
    useCurrentTime();

  const getCurrentVideoPlaying = useCallback(
    (time = currentTimeRef.current) => {
      const currentVideo = allTimelineVideos.find(
        (video) =>
          time >= video.timelineStartTime && time < video.timelineEndTime
      );

      return currentVideo ? currentVideo : null;
    },
    [allTimelineVideos, currentTimeRef]
  );

  const drawFrameAtCurrentTime = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const currentVideo = getCurrentVideoPlaying();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!currentVideo) return;

    const videoElement = videoRefs.current[currentVideo.id];

    if (currentVideo.motionEffects) {
      const { x, y, scale, rotation } = currentVideo.motionEffects;

      const angleRad = (rotation * Math.PI) / 180;

      const vidWidth = videoElement.videoWidth;
      const vidHeight = videoElement.videoHeight;

      const centerX = vidWidth / 2;
      const centerY = vidHeight / 2;

      ctx.clearRect(0, 0, vidWidth, vidHeight);
      ctx.save();

      // Move canvas origin to center
      ctx.translate(centerX + x, centerY + y);

      // Apply rotation
      ctx.rotate(angleRad);

      // Apply scale
      ctx.scale(scale, scale);

      // Draw video frame centered
      ctx.drawImage(
        videoElement,
        -vidWidth / 2,
        -vidHeight / 2,
        vidWidth,
        vidHeight
      );

      ctx.restore();
    } else {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    }
  }, [canvasRef, videoRefs, getCurrentVideoPlaying]);

  const drawFrameAtTime = useCallback(
    async (timelineTime: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const currentVideo = getCurrentVideoPlaying(timelineTime);
      if (!currentVideo) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      const timeInVideo =
        timelineTime - currentVideo.timelineStartTime + currentVideo.startTime;

      const videoElement = videoRefs.current[currentVideo.id];

      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          videoElement.removeEventListener("seeked", onSeeked);
          resolve();
        };
        videoElement.addEventListener("seeked", onSeeked, { once: true });
        videoElement.currentTime = timeInVideo;
      });

      drawFrameAtCurrentTime();
    },
    [canvasRef, videoRefs, getCurrentVideoPlaying, drawFrameAtCurrentTime]
  );

  const setTimelineTime = useCallback(
    (newTime: number, showPreview = false) => {
      drawFrameAtTime(newTime);
      if (!showPreview) updateCurrentTime(newTime);
    },
    [drawFrameAtTime, updateCurrentTime]
  );

  const updateVideoTimesWhenTrim = useCallback(
    (video: Video, amountTrimmed: number) => {
      const videoIndex = allTimelineVideos.findIndex((vid) => vid === video);
      if (!Number.isInteger(videoIndex)) return;

      video.timelineEndTime -= amountTrimmed;

      for (let i = videoIndex + 1; i < allTimelineVideos.length; i++) {
        const currentVideo = allTimelineVideos[i];

        currentVideo.timelineStartTime -= amountTrimmed;
        currentVideo.timelineEndTime -= amountTrimmed;
      }

      setTimelineDuration(timelineDuration - amountTrimmed);
    },
    [allTimelineVideos, setTimelineDuration, timelineDuration]
  );

  const updateVideoTimesWhenMove = (updatedVideos: Video[]) => {
    updatedVideos.forEach((video, index) => {
      if (index === 0) {
        video.timelineStartTime = 0;
        video.timelineEndTime = video.endTime - video.startTime;
      } else {
        const prevVideo = updatedVideos[index - 1];
        video.timelineStartTime = prevVideo.timelineEndTime;
        video.timelineEndTime =
          video.timelineStartTime + video.endTime - video.startTime;
      }
    });

    return updatedVideos;
  };

  const addSplit = useCallback(
    (time = currentTimeRef.current) => {
      const currentVideo = getCurrentVideoPlaying();
      if (!currentVideo) throw new Error("No currentVideo. Can't addSplit");

      if (currentVideo.timelineStartTime >= time - 1) return;
      if (currentVideo.timelineEndTime <= time + 1) return;

      const videoIndex = allTimelineVideos.findIndex(
        (video) => video === currentVideo
      );

      const splitTime =
        currentVideo.startTime + (time - currentVideo.timelineStartTime);

      const videoLeft = { ...currentVideo };
      videoLeft.id = uuidv4();
      videoLeft.endTime = splitTime;
      videoLeft.timelineEndTime = time;

      const videoRight = { ...currentVideo };
      videoRight.id = uuidv4();
      videoRight.startTime = splitTime;
      videoRight.timelineStartTime = time;

      const updatedAllVideos = [...allTimelineVideos];
      updatedAllVideos.splice(videoIndex, 1, videoLeft, videoRight);
      setAllTimelineVideos(updatedAllVideos);
      setCurrentVideoSelected(null);
    },
    [
      allTimelineVideos,
      currentTimeRef,
      getCurrentVideoPlaying,
      setAllTimelineVideos,
    ]
  );

  const deleteCurrentVideoSelected = useCallback(() => {
    if (currentVideoSelected === null) return;
    if (allTimelineVideos.length === 1) return;

    let updatedAllVideos = [...allTimelineVideos];
    const videoIndex = updatedAllVideos.findIndex(
      (video) => video.id === currentVideoSelected.id
    );

    if (videoIndex === -1) return;

    updatedAllVideos.splice(videoIndex, 1);
    updatedAllVideos = updateVideoTimesWhenMove(updatedAllVideos);

    setAllTimelineVideos(updatedAllVideos);

    const newTimelineDuration =
      updatedAllVideos[updatedAllVideos.length - 1].timelineEndTime;

    updateCurrentTime(currentVideoSelected.timelineStartTime);
    setTimelineDuration(newTimelineDuration);
    setCurrentVideoSelected(null);
  }, [
    allTimelineVideos,
    currentVideoSelected,
    setAllTimelineVideos,
    setTimelineDuration,
    updateCurrentTime,
  ]);

  const pauseAllVideos = useCallback(() => {
    const videoElements = videoRefs.current;

    Object.values(videoElements).forEach((video) => {
      video.pause();
    });
  }, [videoRefs]);

  const resetAllVideosExceptVideoPlaying = useCallback(() => {
    const currentVideo = getCurrentVideoPlaying();

    allTimelineVideos.forEach((video) => {
      if (video === currentVideo) return;

      const videoElement = videoRefs.current[video.id];
      videoElement.pause();
      videoElement.currentTime = video.startTime;
    });
  }, [allTimelineVideos, getCurrentVideoPlaying, videoRefs]);

  const resetAllVideos = useCallback(() => {
    allTimelineVideos.forEach((video) => {
      const videoElement = videoRefs.current[video.id];
      videoElement.pause();
      videoElement.currentTime = video.startTime;
    });
  }, [allTimelineVideos, videoRefs]);

  const jumpToNextBlock = useCallback(() => {
    const currentVideo = getCurrentVideoPlaying();
    if (!currentVideo)
      throw new Error("No currentVideo. Can't jumpToNextBlock");

    setIsVideoPlaying(false);

    const index = allTimelineVideos.findIndex(
      (video) => video === currentVideo
    );

    if (index === -1) return;

    resetAllVideos();

    if (index === allTimelineVideos.length - 1) {
      setTimelineTime(timelineDuration - 0.01);
      resetAllVideos();
    } else {
      const nextVideo = allTimelineVideos[index + 1];
      setTimelineTime(nextVideo.timelineStartTime + 0.01);
    }
  }, [
    allTimelineVideos,
    getCurrentVideoPlaying,
    resetAllVideos,
    setIsVideoPlaying,
    setTimelineTime,
    timelineDuration,
  ]);

  const jumpToPreviousBlock = useCallback(() => {
    const currentVideo = getCurrentVideoPlaying();
    if (!currentVideo)
      throw new Error("No currentVideo. Can't jumpToNextBlock");

    setIsVideoPlaying(false);

    const index = allTimelineVideos.findIndex(
      (video) => video === currentVideo
    );

    if (index === -1) return;

    resetAllVideos();

    if (index === 0) {
      setTimelineTime(0);
    } else if (
      currentTimeRef.current ===
      currentVideo.timelineStartTime + 0.01
    ) {
      const prevVideo = allTimelineVideos[index - 1];
      setTimelineTime(prevVideo.timelineStartTime + 0.01);
    } else {
      setTimelineTime(currentVideo.timelineStartTime + 0.01);
    }
  }, [
    allTimelineVideos,
    currentTimeRef,
    getCurrentVideoPlaying,
    resetAllVideos,
    setIsVideoPlaying,
    setTimelineTime,
  ]);

  const trimLeftSide = useCallback(() => {
    const currentVideo = getCurrentVideoPlaying();
    if (!currentVideo) return;

    setIsVideoPlaying(false);

    const amountTrimmed =
      currentTimeRef.current - currentVideo.timelineStartTime;
    currentVideo.startTime += amountTrimmed;

    updateVideoTimesWhenTrim(currentVideo, amountTrimmed);
    setTimelineTime(currentVideo.timelineStartTime + 0.01);
  }, [
    currentTimeRef,
    getCurrentVideoPlaying,
    setIsVideoPlaying,
    setTimelineTime,
    updateVideoTimesWhenTrim,
  ]);

  const trimRightSide = useCallback(() => {
    const currentVideo = getCurrentVideoPlaying();
    if (!currentVideo) return;

    setIsVideoPlaying(false);

    const amountTrimmed = currentVideo.timelineEndTime - currentTimeRef.current;
    currentVideo.endTime -= amountTrimmed;

    updateVideoTimesWhenTrim(currentVideo, amountTrimmed);
    resetAllVideos();
  }, [
    currentTimeRef,
    getCurrentVideoPlaying,
    resetAllVideos,
    setIsVideoPlaying,
    updateVideoTimesWhenTrim,
  ]);

  const updateCurrentVideoMotionEffects = useCallback(
    (motionEffects: MotionEffects) => {
      setCurrentVideoSelected((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          motionEffects: motionEffects,
        };
      });

      setAllTimelineVideos((prev) =>
        prev.map((video) => {
          if (video.id === currentVideoSelected?.id) {
            return {
              ...video,
              motionEffects: { ...video.motionEffects, ...motionEffects },
            };
          } else {
            return video;
          }
        })
      );
    },
    [setCurrentVideoSelected, setAllTimelineVideos, currentVideoSelected?.id]
  );

  return (
    <VideoEditingContext.Provider
      value={{
        setTimelineTime,
        getCurrentVideoPlaying,
        drawFrameAtTime,
        updateVideoTimesWhenTrim,
        updateVideoTimesWhenMove,
        addSplit,
        deleteCurrentVideoSelected,
        setCurrentVideoSelected,
        currentVideoSelected,
        drawFrameAtCurrentTime,
        pauseAllVideos,
        resetAllVideosExceptVideoPlaying,
        jumpToNextBlock,
        jumpToPreviousBlock,
        trimLeftSide,
        trimRightSide,
        updateCurrentVideoMotionEffects,
      }}>
      {children}
    </VideoEditingContext.Provider>
  );
};
