import { useEffect } from "react";

// Style import
import "./EditSection.scss";

// Hook imports
import { useExport } from "../../hooks/useExport";
import { useVideoEditing } from "../../../Timeline/context/VideoEditing/useVideoEditing";
import { useMotionControls } from "./hooks/useMotionControls";

// Component imports
import PositionSection from "./components/PositionSection";
import ScaleSliderWithEdit from "./components/ScaleSliderWithEdit";
import RotationSliderWithEdit from "./components/RotationSliderWithEdit";

// Utility imports
import { getSafeScale } from "./utils/getSafeScale";

const EditSection = () => {
  // Hooks
  const { videoSelected } = useVideoEditing();
  const { getExportSettings } = useExport();

  const exportSettings = getExportSettings();
  const [resWidth, resHeight] = exportSettings.resolution
    .split("x")
    .map(Number);

  // Calculate minimum scale based on rotation
  const minScale = Math.max(1, getSafeScale(0, resWidth, resHeight));

  // Use motion controls hook
  const {
    positionX,
    positionY,
    scale,
    rotation,
    setPositionX,
    setPositionY,
    setScale,
    setRotation,
  } = useMotionControls(minScale);

  // Update minimum scale when rotation changes
  useEffect(() => {
    const newMinScale = Math.max(
      1,
      getSafeScale(rotation, resWidth, resHeight)
    );
    if (newMinScale > scale) {
      setScale(newMinScale);
    }
  }, [rotation, resWidth, resHeight, scale, setScale]);

  if (!videoSelected) {
    return (
      <div className="sidebar-section edit-section">
        Please Select Video Block
      </div>
    );
  }

  return (
    <div className="sidebar-section edit-section">
      <h3>Motion Controls</h3>

      <PositionSection
        positionX={positionX}
        positionY={positionY}
        onPositionXChange={setPositionX}
        onPositionYChange={setPositionY}
      />

      <ScaleSliderWithEdit
        value={scale}
        min={Math.max(1, getSafeScale(rotation, resWidth, resHeight))}
        max={10}
        onChange={setScale}
      />

      <RotationSliderWithEdit value={rotation} onChange={setRotation} />
    </div>
  );
};

export default EditSection;
