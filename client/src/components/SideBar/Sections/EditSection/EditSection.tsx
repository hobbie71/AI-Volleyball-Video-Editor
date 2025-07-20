import { useState, useRef, useEffect } from "react";
import { useVideoEditing } from "../../../../contexts/videoEditing/VideoEditingContext";
import { useVideo } from "../../../../contexts/video/VideoContext";
import "./EditSection.css";

const DRAG_THRESHOLD = 3; // pixels

const EditSection = () => {
  const { currentVideoSelected, updateCurrentVideoMotionEffects } =
    useVideoEditing();

  const { exportSettings } = useVideo();
  const [resWidth, resHeight] = exportSettings.resolution
    .split("x")
    .map(Number);

  // Position states
  const [positionX, setPositionX] = useState<number>(
    currentVideoSelected?.motionEffects?.x || 0
  );
  const [positionY, setPositionY] = useState<number>(
    currentVideoSelected?.motionEffects?.y || 0
  );
  const [isChangingX, setIsChangeX] = useState<boolean>(false);
  const [isChangingY, setIsChangeY] = useState<boolean>(false);
  const [tempPositionX, setTempPositionX] = useState<string>("");
  const [tempPositionY, setTempPositionY] = useState<string>("");

  // Drag states for X
  const dragStartX = useRef<number | null>(null);
  const dragStartMouseX_X = useRef<number | null>(null);
  const dragStartedX = useRef<boolean>(false);

  // Drag states for Y
  const dragStartY = useRef<number | null>(null);
  const dragStartMouseX_Y = useRef<number | null>(null);
  const dragStartedY = useRef<boolean>(false);

  // Scale States
  const [minScale, setMinScale] = useState<number>(1);
  const [scale, setScale] = useState(
    currentVideoSelected?.motionEffects?.scale || 1
  );
  const [rotation, setRotation] = useState(
    currentVideoSelected?.motionEffects?.rotation || 0
  );

  // TODO: Make sure this actually works
  const getSafeScale = (
    rotationDegrees: number,
    resWidth: number,
    resHeight: number
  ): number => {
    if (resWidth <= 0 || resHeight <= 0) return 1;

    // Convert degrees to radians for math functions
    const angleRadians = (rotationDegrees * Math.PI) / 180;

    const isWidthLonger = resWidth >= resHeight;
    const longerSide = isWidthLonger ? resWidth : resHeight;
    const shorterSide = isWidthLonger ? resHeight : resWidth;

    const absSin = Math.abs(Math.sin(angleRadians));
    const absCos = Math.abs(Math.cos(angleRadians));

    if (
      shorterSide <= 2 * absSin * absCos * longerSide ||
      Math.abs(absSin - absCos) < 1e-10
    ) {
      // Half-constrained case: crop corners touch longer side
      const halfShortSide = 0.5 * shorterSide;
      const maxInnerWidth = isWidthLonger
        ? halfShortSide / absSin
        : halfShortSide / absCos;
      const maxInnerHeight = isWidthLonger
        ? halfShortSide / absCos
        : halfShortSide / absSin;

      const scale = Math.max(
        resWidth / maxInnerWidth,
        resHeight / maxInnerHeight
      );
      return scale;
    } else {
      // Fully constrained case: crop touches all 4 sides
      const cosDoubleAngle = absCos * absCos - absSin * absSin;
      const maxInnerWidth =
        (resWidth * absCos - resHeight * absSin) / cosDoubleAngle;
      const maxInnerHeight =
        (resHeight * absCos - resWidth * absSin) / cosDoubleAngle;

      const scale = Math.max(
        resWidth / maxInnerWidth,
        resHeight / maxInnerHeight
      );
      return scale;
    }
  };

  // --- Drag logic for X ---
  const onXMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
    dragStartX.current = positionX;
    dragStartMouseX_X.current = e.clientX;
    dragStartedX.current = false;
    window.addEventListener("mousemove", onXMouseMove);
    window.addEventListener("mouseup", onXMouseUp);
  };

  const onXMouseMove = (e: MouseEvent) => {
    if (dragStartX.current === null || dragStartMouseX_X.current === null)
      return;
    const diff = e.clientX - dragStartMouseX_X.current;
    if (!dragStartedX.current && Math.abs(diff) > DRAG_THRESHOLD) {
      dragStartedX.current = true;
    }
    if (dragStartedX.current) {
      setPositionX(dragStartX.current + diff);
    }
  };

  const onXMouseUp = () => {
    dragStartX.current = null;
    dragStartMouseX_X.current = null;
    dragStartedX.current = false;
    window.removeEventListener("mousemove", onXMouseMove);
    window.removeEventListener("mouseup", onXMouseUp);
  };

  const onXDoubleClick = () => {
    setTempPositionX(positionX.toString());
    setIsChangeX(true);
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(".position-input");
      input?.select();
    }, 0);
  };

  // --- Drag logic for Y ---
  const onYMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
    dragStartY.current = positionY;
    dragStartMouseX_Y.current = e.clientX;
    dragStartedY.current = false;
    window.addEventListener("mousemove", onYMouseMove);
    window.addEventListener("mouseup", onYMouseUp);
  };

  const onYMouseMove = (e: MouseEvent) => {
    if (dragStartY.current === null || dragStartMouseX_Y.current === null)
      return;
    const diff = e.clientX - dragStartMouseX_Y.current;
    if (!dragStartedY.current && Math.abs(diff) > DRAG_THRESHOLD) {
      dragStartedY.current = true;
    }
    if (dragStartedY.current) {
      setPositionY(dragStartY.current + diff);
    }
  };

  const onYMouseUp = () => {
    dragStartY.current = null;
    dragStartMouseX_Y.current = null;
    dragStartedY.current = false;
    window.removeEventListener("mousemove", onYMouseMove);
    window.removeEventListener("mouseup", onYMouseUp);
  };

  const onYDoubleClick = () => {
    setTempPositionY(positionY.toString());
    setIsChangeY(true);
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(".position-input");
      input?.select();
    }, 0);
  };

  // Reset temp values when not editing
  useEffect(() => {
    if (!isChangingX) setTempPositionX("");
  }, [isChangingX]);
  useEffect(() => {
    if (!isChangingY) setTempPositionY("");
  }, [isChangingY]);

  useEffect(() => {
    updateCurrentVideoMotionEffects({
      x: positionX,
      y: positionY,
      scale: scale,
      rotation: rotation,
    });
  }, [positionX, positionY, scale, rotation, updateCurrentVideoMotionEffects]);

  // Update minScale
  useEffect(() => {
    const newMinScale = Math.max(
      1,
      getSafeScale(rotation, resWidth, resHeight)
    );
    setMinScale(newMinScale);

    setScale((prevScale) =>
      newMinScale > prevScale ? newMinScale : prevScale
    );
  }, [rotation, resWidth, resHeight]);

  if (!currentVideoSelected) {
    return (
      <div className="sidebar-section edit-section">
        Please Select Video Block
      </div>
    );
  }

  return (
    <div className="sidebar-section edit-section">
      <h3>Motion Controls</h3>
      <div className="position-section">
        <label>Position</label>
        <div>
          X:
          {!isChangingX && (
            <span
              className="position-span"
              onDoubleClick={onXDoubleClick}
              onMouseDown={onXMouseDown}
              title="Drag to change X position or double-click to edit">
              {positionX}
            </span>
          )}
          {isChangingX && (
            <input
              type="number"
              className="position-input"
              autoFocus
              value={tempPositionX}
              onChange={(e) => setTempPositionX(e.target.value)}
              onBlur={() => {
                const val = tempPositionX.trim();
                setPositionX(
                  val === "" || isNaN(Number(val)) ? 0 : Number(val)
                );
                setIsChangeX(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = tempPositionX.trim();
                  setPositionX(
                    val === "" || isNaN(Number(val)) ? 0 : Number(val)
                  );
                  setIsChangeX(false);
                }
              }}
            />
          )}
        </div>
        <div>
          Y:
          {!isChangingY && (
            <span
              className="position-span"
              onDoubleClick={onYDoubleClick}
              onMouseDown={onYMouseDown}
              title="Drag to change Y position or double-click to edit">
              {positionY}
            </span>
          )}
          {isChangingY && (
            <input
              type="number"
              className="position-input"
              autoFocus
              value={tempPositionY}
              onChange={(e) => setTempPositionY(e.target.value)}
              onBlur={() => {
                const val = tempPositionY.trim();
                setPositionY(
                  val === "" || isNaN(Number(val)) ? 0 : Number(val)
                );
                setIsChangeY(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = tempPositionY.trim();
                  setPositionY(
                    val === "" || isNaN(Number(val)) ? 0 : Number(val)
                  );
                  setIsChangeY(false);
                }
              }}
            />
          )}
        </div>
      </div>
      <label>
        Scale (Zoom)
        <input
          type="range"
          value={minScale}
          min={getSafeScale(rotation, resWidth, resHeight)}
          max={10}
          step={0.01}
          onChange={(e) => setScale(Number(e.target.value))}
        />
        <span>{scale.toFixed(2)}x</span>
      </label>
      <label>
        Rotation (degrees)
        <input
          type="range"
          value={rotation}
          min={-180}
          max={180}
          step={1}
          onChange={(e) => setRotation(Number(e.target.value))}
        />
        <span>{rotation}°</span>
      </label>
    </div>
  );
};

export default EditSection;
