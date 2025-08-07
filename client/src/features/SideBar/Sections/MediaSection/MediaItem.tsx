import { useState, useEffect } from "react";

// Type imports
import { Video } from "../../../../types/video.types";

interface Props {
  video: Video;
}

const MediaItem = ({ video }: Props) => {
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);

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

  return (
    <div
      draggable
      className="media-item"
      onDragStart={(e) =>
        e.dataTransfer.setData("application/json", JSON.stringify(video))
      }
      style={{
        backgroundColor: "white",
        padding: "5px",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "160px",
      }}>
      <img
        src={thumbnail}
        alt="media-item-thumbnail"
        style={{
          maxWidth: "100%",
          userSelect: "none",
          borderRadius: "5px",
          pointerEvents: "none",
        }}
      />
      <p
        className="media-item-name"
        style={{
          margin: "0px",
          color: "black",
          maxWidth: "100%",
          overflow: "hidden",
        }}>
        {video.fileName}
      </p>
    </div>
  );
};

export default MediaItem;
