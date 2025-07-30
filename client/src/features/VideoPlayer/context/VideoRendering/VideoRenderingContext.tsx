import { createContext, useRef } from "react";
import { VideoElementObject } from "../../../../types/video.types";

type VideoRenderingContextType = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  videoRefs: React.RefObject<VideoElementObject>;
};

const VideoRenderingContext = createContext<
  undefined | VideoRenderingContextType
>(undefined);

export const VideoRenderingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRefs = useRef<VideoElementObject>({});

  return (
    <VideoRenderingContext.Provider value={{ canvasRef, videoRefs }}>
      {children}
    </VideoRenderingContext.Provider>
  );
};

export { VideoRenderingContext };
