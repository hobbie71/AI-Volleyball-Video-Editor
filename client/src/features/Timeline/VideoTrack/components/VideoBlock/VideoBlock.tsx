import React, { useState, useEffect, useRef, useCallback } from "react";

// Style import
import "./VideoBlock.scss";

// Type imports
import { TimelineVideo } from "../../../../../types/video.types";

// Hook imports
import { useClickedTime } from "../../../hooks/useClickedTime";
import { useTrimVideo } from "../../hooks/useTrimVideo";
import { useDrawFrame } from "../../../../VideoPlayer/hooks/useDrawFrame";
import { useMoveVideo } from "../../hooks/useMoveVideo";

// Context imports
import { useVideoEditing } from "../../../context/VideoEditing/useVideoEditing";

// Util imports
import { clamp } from "../../utils/clamp";

// Component imports
import TrimBar from "../TrimBar/TrimBar";

interface Props {
  index: number;
  video: TimelineVideo;
  timelineDuration: number;
  setShowHoverPointer: (bool: boolean) => void;
  prevEndTime: number;
}

const MIN_WIDTH_PREIVEW_IMAGE = 110;

const VideoBlock = ({
  index,
  video,
  timelineDuration,
  setShowHoverPointer,
}: Props) => {
  // Hooks
  const { getCurrentClickedTime } = useClickedTime();
  const { trimLeftSide, trimRightSide } = useTrimVideo();
  const { drawFrameAtTime } = useDrawFrame();
  const { moveVideoToIndex } = useMoveVideo();
  const { setVideoSelected, videoSelected } = useVideoEditing();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const lastDrawTimeRef = useRef<number>(0);

  // useStates
  const [trimSideDragging, setTrimSideDragging] = useState<-1 | null | 1>(null);
  const [isMovingTrimBar, setIsMovingTrimBar] = useState<boolean>(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState<boolean>(false);
  const [showTrimBars, setShowTrimBars] = useState<boolean>(false);
  const [visualStartTime, setVisualStartTime] = useState<number>(
    video.timelineStartTime
  );
  const [visualEndTime, setVisualEndTime] = useState<number>(
    video.timelineEndTime
  );
  const [blockWidth, setBlockWidth] = useState<number>(0);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const showTrimBarWhenClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMovingTrimBar) return;

    const container = containerRef.current;
    if (!container) return;

    const distanceToShowTrimBars = 25;

    const rect = container.getBoundingClientRect();
    const distanceFromLeft = e.clientX - rect.left;
    const distanceFromRight = rect.right - e.clientX;

    if (
      distanceFromLeft < distanceToShowTrimBars ||
      distanceFromRight < distanceToShowTrimBars
    ) {
      setShowTrimBars(true);
      setShowHoverPointer(false);
    } else {
      setShowTrimBars(false);
      setShowHoverPointer(true);
    }
  };

  const resetHoverStates = () => {
    setShowTrimBars(false);
    setShowHoverPointer(true);
  };

  const getAmountTrimmed = useCallback((): number => {
    if (trimSideDragging === 1) {
      return video.timelineEndTime - visualEndTime;
    } else {
      return visualStartTime - video.timelineStartTime;
    }
  }, [
    trimSideDragging,
    video.timelineEndTime,
    visualEndTime,
    visualStartTime,
    video.timelineStartTime,
  ]);

  // Mouse move handler for trim bar
  const handleTrimBarMouseMove = useCallback(
    (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      let newTime = getCurrentClickedTime(e.clientX);

      if (trimSideDragging === 1) {
        // dragging right side trim bar
        const maxTime =
          video.timelineStartTime - video.startTime + video.duration;
        const minTime = video.timelineStartTime;
        newTime = clamp(newTime, minTime, maxTime);
        setVisualEndTime(newTime);
      } else {
        // dragging left side trim bar
        const maxTime = video.timelineEndTime;
        const minTime = video.timelineStartTime - video.startTime;
        newTime = clamp(newTime, minTime, maxTime);
        setVisualStartTime(newTime);
      }

      // Throttle drawFrameAtTime to every 300ms
      const now = performance.now();
      if (now - lastDrawTimeRef.current > 300) {
        drawFrameAtTime(newTime);
        lastDrawTimeRef.current = now;
      }
    },
    [
      getCurrentClickedTime,
      trimSideDragging,
      video.timelineStartTime,
      video.startTime,
      video.duration,
      video.timelineEndTime,
      drawFrameAtTime,
    ]
  );

  // Mouse up handler for trim bar
  const handleTrimBarMouseUp = useCallback(() => {
    if (trimSideDragging === -1) trimLeftSide(visualStartTime);
    else trimRightSide(visualEndTime);
    setIsMovingTrimBar(false);
    setTrimSideDragging(null);
  }, [
    trimSideDragging,
    trimLeftSide,
    trimRightSide,
    visualStartTime,
    visualEndTime,
  ]);

  // Effect: Set UI state when starting trim
  useEffect(() => {
    if (isMovingTrimBar) {
      setShowTrimBars(true);
      setShowHoverPointer(false);
    }
  }, [isMovingTrimBar, setShowHoverPointer]);

  // Effect: Attach/detach mouse listeners when moving trim bar
  useEffect(() => {
    if (!isMovingTrimBar) return;

    window.addEventListener("mousemove", handleTrimBarMouseMove);
    window.addEventListener("mouseup", handleTrimBarMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleTrimBarMouseMove);
      window.removeEventListener("mouseup", handleTrimBarMouseUp);
    };
  }, [isMovingTrimBar, handleTrimBarMouseMove, handleTrimBarMouseUp]);

  const moveTrimBar = (
    e: React.MouseEvent<HTMLDivElement>,
    trimBarNumber: -1 | 1
  ) => {
    e.preventDefault();

    setIsMovingTrimBar(true);
    setTrimSideDragging(trimBarNumber);
  };

  // Effect: Manage cursor styles for interactions
  useEffect(() => {
    if (isMovingTrimBar) {
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    } else if (isDraggingVideo) {
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isMovingTrimBar, isDraggingVideo]);

  // Drag handlers
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      setIsDraggingVideo(true);
      e.dataTransfer.setData("videoIndex", index.toString());
    },
    [index]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      setIsDraggingVideo(false);
      const fromIndex = parseInt(e.dataTransfer.getData("videoIndex"));
      if (fromIndex === index) return;
      moveVideoToIndex(fromIndex, index);
    },
    [index, moveVideoToIndex]
  );

  const handleDragEnd = useCallback(() => {
    setIsDraggingVideo(false);
  }, []);

  // Generate thumbnail when video.startTime or video.url changes
  useEffect(() => {
    const videoElement = document.createElement("video");
    videoElement.src = video.url;
    videoElement.preload = "auto";
    videoElement.crossOrigin = "anonymous";

    videoElement.onloadedmetadata = () => {
      videoElement.currentTime = video.startTime;
    };

    videoElement.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 160;
      canvas.height = 90;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL("image/png"));
      }
    };
  }, [video.url, video.startTime]);

  // Effect: displays block thumbnail when video block is large enough
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setBlockWidth(containerRef.current.offsetWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [visualStartTime, visualEndTime]);

  // Global click handler for selection
  const handleGlobalClick = useCallback(
    (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      // Return if click is outside the video block or on a trim bar of another video
      const isClickInsideVideoBlock = container.contains(e.target as Node);
      const trimBar = (e.target as HTMLElement).closest(".trim-bar");
      const isTrimBarOfThisVideo =
        trimBar && trimBar.getAttribute("data-video-ID") === video.id;

      if (!isClickInsideVideoBlock || (trimBar && !isTrimBarOfThisVideo))
        return;

      setVideoSelected(video);
    },
    [video, setVideoSelected]
  );

  useEffect(() => {
    if (!videoSelected) return;

    if (videoSelected.id === video.id) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [videoSelected, video.id]);

  // Effect: switches setIsSelected if user clicks on video block
  useEffect(() => {
    document.addEventListener("mousedown", handleGlobalClick);
    return () => {
      document.removeEventListener("mousedown", handleGlobalClick);
    };
  }, [handleGlobalClick]);

  // useEffect: update visual time when trim
  useEffect(() => {
    setVisualEndTime(video.timelineEndTime);
  }, [video.timelineEndTime]);

  // useEffect: update visual time when trim
  useEffect(() => {
    setVisualStartTime(video.timelineStartTime);
  }, [video.timelineStartTime, video.startTime]);

  return (
    <div
      className={`video-block-container ${isSelected ? "is-selected" : ""} ${isDraggingVideo ? "is-dragging" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDrop={handleDragDrop}
      style={{
        left: `${(visualStartTime / timelineDuration) * 100}%`,
        width: `${((visualEndTime - visualStartTime) / timelineDuration) * 100}%`,
      }}>
      <div
        ref={containerRef}
        className="video-block"
        onMouseMove={showTrimBarWhenClose}
        onMouseLeave={resetHoverStates}>
        {blockWidth > MIN_WIDTH_PREIVEW_IMAGE && (
          <div className="block-thumbnail-container">
            {thumbnail && (
              <img
                src={thumbnail}
                className="block-thumbnail"
                alt="video-thumbnail"
                width={160}
              />
            )}
            <span className="block-filename">{video.fileName}</span>
          </div>
        )}
        {showTrimBars && (
          <>
            <TrimBar
              trimSide={-1} // -1 = left
              videoID={video.id}
              moveTrimBar={moveTrimBar}
              trimSideDragging={trimSideDragging}
              getAmountTrimmed={getAmountTrimmed}
            />
            <TrimBar
              trimSide={1} // 1 = right
              videoID={video.id}
              moveTrimBar={moveTrimBar}
              trimSideDragging={trimSideDragging}
              getAmountTrimmed={getAmountTrimmed}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default VideoBlock;
