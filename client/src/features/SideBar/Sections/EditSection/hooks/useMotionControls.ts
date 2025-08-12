import { useState, useEffect, useCallback } from "react";

// Type imports
import { MotionEffects } from "../../../../../types/video.types";

// Hook imports
import { useMotionEffects } from "../../../hooks/useMotionEffects";
import { useDrawFrame } from "../../../../VideoPlayer/hooks/useDrawFrame";

// Context imports
import { useVideoEditing } from "../../../../Timeline/context/VideoEditing/useVideoEditing";

export const useMotionControls = (minScale: number) => {
  const { setSelectedVideoMotionEffects } = useMotionEffects();
  const { videoSelected } = useVideoEditing();
  const { drawFrameAtCurrentTime } = useDrawFrame();

  // Initialize with default values (0 for position, 1 for scale, 0 for rotation)
  const [positionX, setPositionXState] = useState<number>(0);
  const [positionY, setPositionYState] = useState<number>(0);
  const [scale, setScaleState] = useState<number>(1);
  const [rotation, setRotationState] = useState<number>(0);
  const [hasMotionEffects, setHasMotionEffects] = useState<boolean>(false);

  // Update local state when videoSelected changes
  useEffect(() => {
    if (videoSelected?.motionEffects) {
      setPositionXState(videoSelected.motionEffects.x);
      setPositionYState(videoSelected.motionEffects.y);
      setScaleState(videoSelected.motionEffects.scale);
      setRotationState(videoSelected.motionEffects.rotation);
      setHasMotionEffects(true);
    } else {
      // Reset to defaults when switching to a video without motion effects
      setPositionXState(0);
      setPositionYState(0);
      setScaleState(Math.max(1, minScale));
      setRotationState(0);
      setHasMotionEffects(false);
    }
  }, [videoSelected, minScale]);

  // Update minScale when rotation changes
  useEffect(() => {
    setScaleState((prevScale) => (minScale > prevScale ? minScale : prevScale));
  }, [minScale]);

  // Update canvas when motion effects change
  useEffect(() => {
    if (hasMotionEffects) {
      drawFrameAtCurrentTime();
    }
  }, [
    positionX,
    positionY,
    scale,
    rotation,
    hasMotionEffects,
    drawFrameAtCurrentTime,
  ]);

  const updateMotionEffects = useCallback(
    (newEffects: Partial<MotionEffects>) => {
      if (!videoSelected) return;

      const currentEffects = videoSelected.motionEffects || {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
      };

      const updatedEffects = { ...currentEffects, ...newEffects };

      setSelectedVideoMotionEffects(updatedEffects);
      setHasMotionEffects(true);
    },
    [videoSelected, setSelectedVideoMotionEffects]
  );

  const setPositionX = useCallback(
    (value: number) => {
      setPositionXState(value);
      updateMotionEffects({ x: value });
    },
    [updateMotionEffects]
  );

  const setPositionY = useCallback(
    (value: number) => {
      setPositionYState(value);
      updateMotionEffects({ y: value });
    },
    [updateMotionEffects]
  );

  const setScale = useCallback(
    (value: number) => {
      setScaleState(value);
      updateMotionEffects({ scale: value });
    },
    [updateMotionEffects]
  );

  const setRotation = useCallback(
    (value: number) => {
      setRotationState(value);
      updateMotionEffects({ rotation: value });
    },
    [updateMotionEffects]
  );

  return {
    positionX,
    positionY,
    scale,
    rotation,
    setPositionX,
    setPositionY,
    setScale,
    setRotation,
    hasMotionEffects,
  };
};
