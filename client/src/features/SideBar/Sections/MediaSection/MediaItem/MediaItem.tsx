import { useState, useEffect } from "react";

// Style import
import "./MediaItem.css";

// Type imports
import { Video } from "../../../../../types/video.types";

// Hook imports
import { useVideoTimeline } from "../../../../Timeline/hooks/useVideoTimeline";

interface Props {
  video: Video;
}

const MediaItem = ({ video }: Props) => {
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const { addVideoToTimeline } = useVideoTimeline();

  // useEffect: Generate thumbnail
  useEffect(() => {
    const videoElement = document.createElement("video");
    videoElement.src = video.url;
    videoElement.preload = "auto";
    videoElement.crossOrigin = "anonymous";

    videoElement.onloadedmetadata = () => {
      videoElement.currentTime = 0;
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
  }, [video]);

  // useEffect: Add timeline highlight when dragging
  useEffect(() => {
    if (isDragging) {
      const timeline = document.querySelector(".timeline");
      timeline?.classList.add("media-drop-target");
    } else {
      const timeline = document.querySelector(".timeline");
      timeline?.classList.remove("media-drop-target");
    }

    return () => {
      const timeline = document.querySelector(".timeline");
      timeline?.classList.remove("media-drop-target");
    };
  }, [isDragging]);

  const handleDoubleClick = () => {
    addVideoToTimeline(video);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/json", JSON.stringify(video));
    e.dataTransfer.setData("mediaType", "video");
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      className={`media-item ${isDragging ? "is-dragging" : ""}`}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDoubleClick={handleDoubleClick}>
      <img
        src={thumbnail}
        alt="media-item-thumbnail"
        className="media-item-thumbnail"
      />
      <p className="media-item-name">{video.fileName}</p>
    </div>
  );
};

export default MediaItem;
