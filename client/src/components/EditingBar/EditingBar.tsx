import { useState, useEffect, useRef } from "react";
import "./EditingBar.css";
import VideoTrack from "./VideoTrack";
import TimeTrack from "./TimeTrack";
import CurrentTimePointer from "../../features/Timeline/components/CurrentTimePointer/CurrentTimePointer";
import ZoomControls from "./ZoomControls";

import { useCurrentTime } from "../../contexts/currentTime/CurrentTimeContext";
import { useVideo } from "../../contexts/video/VideoContext";
import { useVideoEditing } from "../../contexts/videoEditing/VideoEditingContext";

const EditingBar = () => {
  const { timelineDuration, allTimelineVideos, addVideoFromUpload } =
    useVideo();
  const { currentTime, updateCurrentTime } = useCurrentTime();
  const { drawFrameAtTime, resetAllVideosExceptVideoPlaying } =
    useVideoEditing();

  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomDuration, setZoomDuration] = useState<number>(
    timelineDuration < 300 ? timelineDuration : 300
  );
  const [hoverTime, setHoverTime] = useState<number>(0);
  const [showHoverPointer, setShowHoverPointer] = useState<boolean>(false);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const handleCurrentTimeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const newTime = getClickedTime(e.clientX);
    updateCurrentTime(newTime);
    resetAllVideosExceptVideoPlaying();
    drawFrameAtTime(newTime);
  };

  const setHoverPointer = (e: React.MouseEvent<HTMLDivElement>) => {
    const hoverTime = getClickedTime(e.clientX);
    setHoverTime(hoverTime);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");

    if (!data) return;

    const upload = JSON.parse(data);
    addVideoFromUpload(upload);
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Utility Functions

  const getClickedTime = (clientX: number): number => {
    const container = containerRef.current;
    if (!container)
      throw new Error("No containerRef.current. Can't getClickedTime");

    const rect = container.getBoundingClientRect();

    const clickX = clientX - rect.left + scrollLeft;
    const clickRatio = clickX / rect.width;
    const timeClicked = clickRatio * zoomDuration;

    return timeClicked;
  };

  // Update Zoom when file updated
  useEffect(() => {
    setZoomDuration(timelineDuration);
  }, [allTimelineVideos, timelineDuration]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => setContainerWidth(container.offsetWidth);

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`editing-bar-container ${isDragOver ? "editing-bar-dragover" : ""}`}
      onClick={handleCurrentTimeChange}
      onMouseMove={setHoverPointer}
      onMouseEnter={() => setShowHoverPointer(true)}
      onMouseLeave={() => setShowHoverPointer(false)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragEnter}>
      <TimeTrack
        containerWidth={containerWidth}
        zoomDuration={zoomDuration}
        scrollLeft={scrollLeft}
      />
      <CurrentTimePointer
        containerWidth={containerWidth}
        currentTime={currentTime}
        zoomDuration={zoomDuration}
        scrollLeft={scrollLeft}
      />
      {showHoverPointer && (
        <CurrentTimePointer
          containerWidth={containerWidth}
          currentTime={hoverTime}
          zoomDuration={zoomDuration}
          scrollLeft={scrollLeft}
          isHovering={true}
        />
      )}
      <ZoomControls
        ref={containerRef}
        timelineDuration={timelineDuration}
        zoomDuration={zoomDuration}
        setZoomDuration={setZoomDuration}
        scrollLeft={scrollLeft}
        setScrollLeft={setScrollLeft}
        getClickedTime={getClickedTime}>
        <VideoTrack
          zoomDuration={zoomDuration}
          setShowHoverPointer={setShowHoverPointer}
          getClickedTime={getClickedTime}
        />
      </ZoomControls>
    </div>
  );
};

export default EditingBar;
