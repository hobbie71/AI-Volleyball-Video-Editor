import { useContext } from "react";
import { CurrentTimeContext } from "./CurrentTimeContext";

export const useCurrentTime = () => {
  const context = useContext(CurrentTimeContext);

  if (!context)
    throw new Error(
      "useCurrentTime must be used within a <CurrentTimeProvider>"
    );
  return context;
};
