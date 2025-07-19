import { useMemo } from "react";

interface Props {
  containerWidth: number;
  zoomDuration: number;
  scrollLeft: number;
}

const NICE_INTERVALS = [
  1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600,
]; // seconds

const TimeTrack = ({ containerWidth, zoomDuration, scrollLeft }: Props) => {
  // Calculate visible time range
  const secondsPerPixel = zoomDuration / containerWidth;
  const startTime = scrollLeft * secondsPerPixel;
  const endTime = startTime + zoomDuration;

  // Pick a nice interval for labels
  const minimumPixelBetweenLabels = 100;
  const minInterval = secondsPerPixel * minimumPixelBetweenLabels;
  const interval =
    NICE_INTERVALS.find((i) => i >= minInterval) ||
    NICE_INTERVALS[NICE_INTERVALS.length - 1];

  // Generate visible intervals
  const timeIntervals = useMemo(() => {
    const intervals = [];
    // Start at the first interval >= startTime
    const first = Math.ceil(startTime / interval) * interval;
    for (let t = first; t <= endTime; t += interval) {
      intervals.push(t);
    }
    return intervals;
  }, [startTime, endTime, interval]);

  const formatTime = (timeSeconds: number): string => {
    timeSeconds = Math.trunc(timeSeconds);
    const minutes = Math.floor(timeSeconds / 60);
    const seconds = timeSeconds % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const getLeftPercent = (time: number) =>
    ((time - startTime) / zoomDuration) * 100;

  return (
    <div
      style={{
        position: "relative",
        height: 24,
        width: "100%",
        userSelect: "none",
        fontSize: 12,
        color: "#444",
        margin: "8px 0px",
      }}>
      {timeIntervals.map((interval, i) => (
        <div
          key={`label-${i}`}
          style={{
            position: "absolute",
            left: `${getLeftPercent(interval)}%`,
            transform: "translateX(-50%)",
            minWidth: 1,
            textAlign: "center",
            zIndex: 2,
          }}>
          {formatTime(interval)}
        </div>
      ))}

      {(() => {
        if (timeIntervals.length < 2) return null;
        const first = timeIntervals[0];
        const second = timeIntervals[1];
        const intervalSize = second - first;
        const numDots = 4;
        const dots = [];
        for (let j = numDots - 1; j > 0; j--) {
          const frac = j / numDots;
          const dashTime = first - intervalSize * frac;
          if (dashTime < startTime) continue;
          dots.push(
            <div
              key={`dot-pre-${j}`}
              style={{
                position: "absolute",
                left: `${getLeftPercent(dashTime)}%`,
                top: 6,
                width: 2,
                height: 2,
                background: "#bbb",
                transform: "translateX(-50%)",
                borderRadius: "50%",
                zIndex: 1,
              }}
            />
          );
        }
        return dots;
      })()}
      {timeIntervals.length > 1 &&
        timeIntervals.slice(0, -1).map((interval, i) => {
          const next = timeIntervals[i + 1];
          const numDots = 4; // Number of dashes between each interval
          const dots = [];
          for (let j = 1; j < numDots; j++) {
            const frac = j / numDots;
            const dashTime = interval + (next - interval) * frac;
            dots.push(
              <div
                key={`dot-${i}-${j}`}
                style={{
                  position: "absolute",
                  left: `${getLeftPercent(dashTime)}%`,
                  top: 6,
                  width: 2,
                  height: 2,
                  background: "#bbb",
                  transform: "translateX(-50%)",
                  borderRadius: "50%",
                  zIndex: 1,
                }}
              />
            );
          }
          return dots;
        })}
      {(() => {
        if (timeIntervals.length < 2) return null;
        const last = timeIntervals[timeIntervals.length - 1];
        const prev = timeIntervals[timeIntervals.length - 2];
        const intervalSize = last - prev;
        const numDots = 4;
        const dots = [];
        for (let j = 1; j < numDots; j++) {
          const frac = j / numDots;
          const dashTime = last + intervalSize * frac;
          if (dashTime > endTime) break;
          dots.push(
            <div
              key={`dot-post-${j}`}
              style={{
                position: "absolute",
                left: `${getLeftPercent(dashTime)}%`,
                top: 6,
                width: 2,
                height: 2,
                background: "#bbb",
                transform: "translateX(-50%)",
                borderRadius: "50%",
                zIndex: 1,
              }}
            />
          );
        }
        return dots;
      })()}
    </div>
  );
};

export default TimeTrack;
