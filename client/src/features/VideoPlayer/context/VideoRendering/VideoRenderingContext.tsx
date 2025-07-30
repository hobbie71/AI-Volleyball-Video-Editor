import { createContext, useRef } from "react";

type VideoRenderingContextType = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  videoRefs: React.RefObject<Record<string, HTMLVideoElement>>;
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
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});

  return (
    <VideoRenderingContext.Provider value={{ canvasRef, videoRefs }}>
      {children}
    </VideoRenderingContext.Provider>
  );
};

export { VideoRenderingContext };
