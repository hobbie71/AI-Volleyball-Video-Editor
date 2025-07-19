import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { Video } from "../../contexts/video/types";
import TrimBar from "./TrimBar";

interface Props {
  index: number;
  video: Video;
  setAllTimelineVideos: Dispatch<SetStateAction<Video[]>>;
  timelineDuration: number;
  setShowHoverPointer: (bool: boolean) => void;
  getClickedTime: (clientX: number) => number;
  prevEndTime: number;
  updateVideoTimesWhenTrim: (video: Video, amountTrimmed: number) => void;
  updateVideoTimesWhenMove: (updatedVideos: Video[]) => Video[];
  setTimelineTime: (newTime: number, showPreview?: boolean) => void;
  zoomDuration: number;
  setCurrentVideoSelected: (video: Video | null) => void;
}

const VideoBlock = ({
  index,
  video,
  setAllTimelineVideos,
  timelineDuration,
  setShowHoverPointer,
  getClickedTime,
  updateVideoTimesWhenTrim,
  updateVideoTimesWhenMove,
  setTimelineTime,
  zoomDuration,
  setCurrentVideoSelected,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  const MinWidthForPreviewImage = 110;

  // useEffect: update visual time when trim
  useEffect(() => {
    setVisualEndTime(video.timelineEndTime);
  }, [video.timelineEndTime]);

  // useEffect: update visual time when trim
  useEffect(() => {
    setVisualStartTime(video.timelineStartTime);
  }, [video.timelineStartTime, video.startTime]);

  const showTrimBarWhenClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMovingTrimBar) return;

    const container = containerRef.current;
    if (!container)
      throw new Error("No containerRef. Can't showTrimBarWhenClose");

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

  // useEffect: handles moving of trim bars
  useEffect(() => {
    if (!isMovingTrimBar) return;

    let newTime: number;

    setShowTrimBars(true);
    setShowHoverPointer(false);

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container)
        throw new Error("No containerRef. Can't handleGlobalMouseMove");

      newTime = getClickedTime(e.clientX);

      if (trimSideDragging === 1) {
        // dragging right side trim bar

        const maxTime =
          video.timelineStartTime - video.startTime + video.duration;
        const minTime = video.timelineStartTime;
        newTime = Math.max(Math.min(maxTime, newTime), minTime);

        setVisualEndTime(newTime);
      } else {
        // dragging left side trim bar

        const maxTime = video.timelineEndTime;
        const minTime = video.timelineStartTime - video.startTime;
        newTime = Math.max(Math.min(maxTime, newTime), minTime);

        setVisualStartTime(newTime);
      }

      let now = performance.now();

      if (now > 200) {
        // 200ms throttle
        setTimelineTime(newTime, true);
        now = 0;
      }
    };

    const trimVideoOnMouseRelease = () => {
      if (trimSideDragging === 1) {
        // Right trim bar
        const amountTrimmed = getAmountTrimmed();
        video.endTime -= amountTrimmed;
        updateVideoTimesWhenTrim(video, amountTrimmed);
      } else if (trimSideDragging === -1) {
        // Left trim bar
        const amountTrimmed = getAmountTrimmed();
        video.startTime += amountTrimmed;
        updateVideoTimesWhenTrim(video, amountTrimmed);
      }

      setIsMovingTrimBar(false);
      setTrimSideDragging(null);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", trimVideoOnMouseRelease);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", trimVideoOnMouseRelease);
    };
  }, [
    trimSideDragging,
    video,
    getClickedTime,
    setShowHoverPointer,
    isMovingTrimBar,
    updateVideoTimesWhenTrim,
    setTimelineTime,
    getAmountTrimmed,
  ]);

  const moveTrimBar = (
    e: React.MouseEvent<HTMLDivElement>,
    trimBarNumber: -1 | 1
  ) => {
    e.preventDefault();

    setIsMovingTrimBar(true);
    setTrimSideDragging(trimBarNumber);
  };

  // Keeps cursor as arrows when moving trim bars
  useEffect(() => {
    if (isMovingTrimBar) {
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.body.style.cursor = "";
    };
  }, [isMovingTrimBar]);

  // Keeps cursor as grabbing when dragging video
  useEffect(() => {
    if (isDraggingVideo) {
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.body.style.cursor = "";
    };
  }, [isDraggingVideo]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDraggingVideo(true);

    e.dataTransfer.setData("videoIndex", index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDraggingVideo(false);

    const fromIndex = parseInt(e.dataTransfer.getData("videoIndex"));

    if (fromIndex === index) return;

    setAllTimelineVideos((prev) => {
      const updatedVideos = [...prev];
      const [moved] = updatedVideos.splice(fromIndex, 1);
      updatedVideos.splice(index, 0, moved);

      return updateVideoTimesWhenMove(updatedVideos);
    });
  };

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

  // useEffect: displays block thumbnail when video block is large enough
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setBlockWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [visualStartTime, visualEndTime, zoomDuration]);

  // useEffect: switches setIsSelected if user clicks on video block
  useEffect(() => {
    const checkGlobalClick = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      // Do nothing if button is clicked
      if (e.target instanceof HTMLButtonElement) return;

      // Deselect if click is outside the video block or on a trim bar of another video
      const isClickInsideVideoBlock = container.contains(e.target as Node);
      const trimBar = (e.target as HTMLElement).closest(".trim-bar");
      const isTrimBarOfThisVideo =
        trimBar && trimBar.getAttribute("data-video-ID") === video.id;

      if (!isClickInsideVideoBlock || (trimBar && !isTrimBarOfThisVideo)) {
        setIsSelected(false);
        return;
      }

      setIsSelected(true);
      setCurrentVideoSelected(video);
    };

    document.addEventListener("mousedown", checkGlobalClick);
    return () => {
      document.removeEventListener("mousedown", checkGlobalClick);
    };
  }, [setCurrentVideoSelected, video]);

  return (
    <div
      className="video-block-container"
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={() => setIsDraggingVideo(false)}
      onDrop={handleDragDrop}
      style={{
        left: `${(visualStartTime / timelineDuration) * 100}%`,
        width: `${((visualEndTime - visualStartTime) / timelineDuration) * 100}%`,
        opacity: isDraggingVideo ? 0.5 : 1,
        cursor: "pointer",
        border: isSelected ? "2px solid #1976d2" : "1px solid black",
        boxSizing: "border-box",
        boxShadow: isSelected ? "0 0 8px 2px #1976d288" : undefined,
        background: isSelected ? "#e3f2fd" : undefined,
        zIndex: isSelected ? 2 : 1,
        borderRadius: "10px",
        overflow: "hidden",
      }}>
      <div
        ref={containerRef}
        className="video-block"
        onMouseMove={showTrimBarWhenClose}
        onMouseLeave={resetHoverStates}
        style={{
          backgroundColor: "lightblue",
          borderRadius: "8px",
          overflow: "hidden",
        }}>
        {blockWidth > MinWidthForPreviewImage && (
          <div className="block-image-premiere">
            {thumbnail && (
              <img
                src={thumbnail}
                className="block-thumbnail-premiere"
                alt="video-thumbnail"
                width={160}
              />
            )}
            <span className="block-filename-premiere">{video.fileName}</span>
          </div>
        )}
        {video.motionEffects && (
          <div
            className="motion-effects-icon"
            title="Motion Effects Applied"
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              width: 16,
              height: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: ".5rem",
              color: "#fff",
            }}>
            <i>VFX</i>
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
