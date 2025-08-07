import { useState, useEffect } from "react";

// Style import
import "./Timeline.css";

// Component imports
import VideoTrack from "./VideoTrack/VideoTrack";
import CurrentTimePointer from "./components/CurrentTimePointer/CurrentTimePointer";
import ZoomControls from "./components/ZoomControl/ZoomControls";
import TimeTrack from "./components/TimeTrack/TimeTrack";

// Context imports
import { useCurrentTime } from "../VideoPlayer/context/CurrentTime/useCurrentTime";
import { useTimeline } from "./context/Timeline/useTimeline";
import { useTimelineZoom } from "./context/TimelineZoom/useTimelineZoom";

// Hook imports
import { useDrawFrame } from "../VideoPlayer/hooks/useDrawFrame";
import { useVideoPlaybackControl } from "../VideoPlayer/hooks/useVideoPlaybackControl";
import { useTimelineControl } from "./hooks/useTimelineControl";
import { useClickedTime } from "./hooks/useClickedTime";
import { useVideoTimeline } from "./hooks/useVideoTimeline";

const Timeline = () => {
  // Hooks
  const { currentTime, updateCurrentTime } = useCurrentTime();
  const {
    timelineContainerRef,
    timelineDuration,
    timelineContainerWidth,
    setTimelineContainerWidth,
  } = useTimeline();
  const { drawFrameAtTime } = useDrawFrame();
  const { resetAllVideoElementsExceptCurrentVideo } = useVideoPlaybackControl();
  const { scrollLeft, setZoomDuration, zoomDuration } = useTimelineZoom();
  const { setTimelineScrollLeft } = useTimelineControl();
  const { getCurrentClickedTime } = useClickedTime();
  const { addVideoToTimeline } = useVideoTimeline();

  // useState
  const [hoverTime, setHoverTime] = useState<number>(0);
  const [showHoverPointer, setShowHoverPointer] = useState<boolean>(false);

  const handleCurrentTimeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const timelineContainer = timelineContainerRef.current;
    if (!timelineContainer) return;

    const newTime = getCurrentClickedTime(e.clientX);
    updateCurrentTime(newTime);
    resetAllVideoElementsExceptCurrentVideo();
    drawFrameAtTime(newTime);
  };

  const setHoverPointer = (e: React.MouseEvent<HTMLDivElement>) => {
    const timelineContainer = timelineContainerRef.current;
    if (!timelineContainer) return;

    setShowHoverPointer(true);

    const hoverTime = getCurrentClickedTime(e.clientX);
    setHoverTime(hoverTime);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const mediaType = e.dataTransfer.getData("mediaType");
    if (mediaType === "video") {
      const videoData = e.dataTransfer.getData("application/json");
      try {
        const video = JSON.parse(videoData);
        addVideoToTimeline(video);
      } catch (error) {
        console.error("Failed to parse video data:", error);
      }
    }
  };

  // effect: Update container width when size and width changes
  useEffect(() => {
    const timelineContainer = timelineContainerRef.current;
    if (!timelineContainer) return;

    const updateWidth = () =>
      setTimelineContainerWidth(timelineContainer.offsetWidth);

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(timelineContainer);

    return () => {
      resizeObserver.disconnect();
    };
  }, [timelineContainerRef, setTimelineContainerWidth]);

  return (
    <div
      className="timeline"
      ref={timelineContainerRef}
      onClick={handleCurrentTimeChange}
      onMouseMove={setHoverPointer}
      onMouseEnter={setHoverPointer}
      onMouseLeave={() => setShowHoverPointer(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}>
      <CurrentTimePointer
        currentTime={currentTime}
        containerWidth={timelineContainerWidth}
        zoomDuration={zoomDuration}
        scrollLeft={scrollLeft}
      />
      <TimeTrack
        containerWidth={timelineContainerWidth}
        zoomDuration={zoomDuration}
        scrollLeft={scrollLeft}
      />
      {showHoverPointer && (
        <CurrentTimePointer
          currentTime={hoverTime}
          containerWidth={timelineContainerWidth}
          zoomDuration={zoomDuration}
          scrollLeft={scrollLeft}
          isHovering={true}
        />
      )}
      <ZoomControls
        timelineDuration={timelineDuration}
        zoomDuration={zoomDuration}
        setZoomDuration={setZoomDuration}
        setTimelineScrollLeft={setTimelineScrollLeft}
        scrollLeft={scrollLeft}>
        <VideoTrack
          zoomDuration={zoomDuration}
          setShowHoverPointer={setShowHoverPointer}
        />
      </ZoomControls>
    </div>
  );
};

export default Timeline;
