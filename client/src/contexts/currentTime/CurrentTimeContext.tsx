import { createContext, useContext } from "react";
import { CurrentTimeContextType } from "./types";

export const CurrentTimeContext = createContext<CurrentTimeContextType | null>(
  null
);

export const useCurrentTime = () => {
  const context = useContext(CurrentTimeContext);
  if (!context)
    throw new Error("useCurrentTime must be used within a CurrentTimeProvider");
  return context;
};
