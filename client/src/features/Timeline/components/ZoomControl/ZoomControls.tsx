import { useEffect, useRef } from "react";

// Lib imports
import { getTimelineClickedTime } from "../../libs/getTimelineClickedTime";

// Context imports
import { useTimelineZoom } from "../../context/TimelineZoom/useTimelineZoom";

interface Props {
  children: React.ReactNode;
  timelineDuration: number;
  zoomDuration: number;
  setZoomDuration: (newDuration: number) => void;
  scrollLeft: number;
  setTimelineScrollLeft: (pixels: number) => void;
}

const ZoomControls = ({
  children,
  timelineDuration,
  zoomDuration,
  setZoomDuration,
  scrollLeft,
  setTimelineScrollLeft,
}: Props) => {
  // Hooks
  const { setScrollLeft } = useTimelineZoom();

  // Refs
  const zoomControlRef = useRef<HTMLDivElement>(null);
  const zoomDurationRef = useRef(zoomDuration); // Create a ref for zoomDuration

  // Keep the ref updated with the latest zoomDuration
  useEffect(() => {
    zoomDurationRef.current = zoomDuration;
  }, [zoomDuration]);

  useEffect(() => {
    const container = zoomControlRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        // Get bounding rect and mouse position
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const timeAtMouse = getTimelineClickedTime(
          container,
          e.clientX,
          zoomDuration,
          scrollLeft
        );

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

        setTimelineScrollLeft(newScrollLeft);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => container?.removeEventListener("wheel", handleWheel);
  }, [
    timelineDuration,
    setZoomDuration,
    zoomDuration,
    setTimelineScrollLeft,
    scrollLeft,
  ]);

  // effect: update scroll left when scrolling
  useEffect(() => {
    const zoomControl = zoomControlRef.current;
    if (!zoomControl) return;

    const handleScroll = () => setScrollLeft(zoomControl.scrollLeft);
    zoomControl.addEventListener("scroll", handleScroll);
    return () => zoomControl.removeEventListener("scroll", handleScroll);
  }, [zoomControlRef, setScrollLeft]);

  return (
    <div
      ref={zoomControlRef}
      className="zoom-controls"
      style={{
        width: "100%",
        position: "relative",
        overflowX: "auto",
      }}>
      {children}
    </div>
  );
};

export default ZoomControls;
