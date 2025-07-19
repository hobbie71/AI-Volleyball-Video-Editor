import { useEffect, useRef, RefObject } from "react";

interface Props {
  children: React.ReactNode;
  ref: RefObject<HTMLDivElement | null>;
  timelineDuration: number;
  zoomDuration: number;
  setZoomDuration: (newDuration: number) => void;
  scrollLeft: number;
  setScrollLeft: (pixels: number) => void;
  getClickedTime: (clientX: number) => number;
}

const ZoomControls = ({
  children,
  ref,
  timelineDuration,
  zoomDuration,
  setZoomDuration,
  scrollLeft,
  setScrollLeft,
  getClickedTime,
}: Props) => {
  const zoomDurationRef = useRef(zoomDuration); // Create a ref for zoomDuration

  // Keep the ref updated with the latest zoomDuration
  useEffect(() => {
    zoomDurationRef.current = zoomDuration;
  }, [zoomDuration]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        // Get bounding rect and mouse position
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const timeAtMouse = getClickedTime(e.clientX);

        // Calculate new zoom
        const delta = e.deltaY < 0 ? -1 : 1;
        const deltaRatio = delta * (timelineDuration / 100);

        const newZoom = Math.max(
          5,
          Math.min(zoomDurationRef.current + deltaRatio, timelineDuration)
        );

        setZoomDuration(newZoom);

        // Calculate new scrollLeft so the time under the mouse stays under the mouse
        const newPixelsPerSecond = rect.width / newZoom;
        const newScrollLeft = Math.max(
          timeAtMouse * newPixelsPerSecond - mouseX,
          0
        );

        setScrollLeft(newScrollLeft);
        container.scrollLeft = newScrollLeft;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => container?.removeEventListener("wheel", handleWheel);
  }, [
    ref,
    timelineDuration,
    setZoomDuration,
    setScrollLeft,
    scrollLeft,
    getClickedTime,
  ]);

  return (
    <div ref={ref} className="editing-bar-container-zoomable">
      {children}
    </div>
  );
};

export default ZoomControls;
