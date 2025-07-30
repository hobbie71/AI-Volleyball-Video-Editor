import { useContext } from "react";
import { TimelineContext } from "./TimelineContext";

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context)
    throw new Error("useTimeline must be within <TimelineProvider>");
  return context;
};
