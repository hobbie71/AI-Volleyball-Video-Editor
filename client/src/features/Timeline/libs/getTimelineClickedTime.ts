export const getTimelineClickedTime = (
  timelineContainer: HTMLDivElement,
  clientX: number,
  zoomDuration: number,
  scrollLeft: number
): number => {
  if (!timelineContainer)
    throw new Error("No containerRef.current. Can't getClickedTime");

  const rect = timelineContainer.getBoundingClientRect();

  const clickX = clientX - rect.left + scrollLeft;
  const clickRatio = clickX / rect.width;
  const timeClicked = clickRatio * zoomDuration;

  return timeClicked;
};
