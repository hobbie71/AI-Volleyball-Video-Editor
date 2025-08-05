import { useMemo } from "react";

// Style import
import "./TimeTrack.css";

// Util imports
import { formatTimeMinutesToSecond } from "../../../../shared/util/formatTime";

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

  const getLeftPercent = (time: number) =>
    ((time - startTime) / zoomDuration) * 100;

  return (
    <div className="timetrack-container">
      {timeIntervals.map((interval, i) => (
        <div
          key={`label-${i}`}
          className="timetrack-interval"
          style={{ left: `${getLeftPercent(interval)}%` }}>
          {formatTimeMinutesToSecond(interval)}
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
              className="timetrack-dot"
              style={{ left: `${getLeftPercent(dashTime)}%` }}
            />
          );
        }
        return dots;
      })()}
      {timeIntervals.length > 1 &&
        timeIntervals.slice(0, -1).map((interval, i) => {
          const next = timeIntervals[i + 1];
          const numDots = 4;
          const dots = [];
          for (let j = 1; j < numDots; j++) {
            const frac = j / numDots;
            const dashTime = interval + (next - interval) * frac;
            dots.push(
              <div
                key={`dot-${i}-${j}`}
                className="timetrack-dot"
                style={{ left: `${getLeftPercent(dashTime)}%` }}
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
              className="timetrack-dot"
              style={{ left: `${getLeftPercent(dashTime)}%` }}
            />
          );
        }
        return dots;
      })()}
    </div>
  );
};

export default TimeTrack;
