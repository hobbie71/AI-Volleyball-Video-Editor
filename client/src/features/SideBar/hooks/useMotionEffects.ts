import { useCallback } from "react";
import { MotionEffects } from "../../../types/video.types";

// This hook will handle motion effects (position, scale, rotation) for video editing
// It should be implemented based on your SideBar motion controls UI
export const useMotionEffects = () => {
  const updateMotionEffects = useCallback((effects: MotionEffects) => {
    // TODO: Implement motion effects update logic
    console.log("Updating motion effects:", effects);
  }, []);

  return {
    updateMotionEffects,
  };
};
