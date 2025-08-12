import PositionControl from "./PositionControl";

interface Props {
  positionX: number;
  positionY: number;
  onPositionXChange: (value: number) => void;
  onPositionYChange: (value: number) => void;
}

const PositionSection = ({
  positionX,
  positionY,
  onPositionXChange,
  onPositionYChange,
}: Props) => {
  return (
    <div className="position-section">
      <label>Position</label>
      <PositionControl
        label="X"
        value={positionX}
        onChange={onPositionXChange}
      />
      <PositionControl
        label="Y"
        value={positionY}
        onChange={onPositionYChange}
      />
    </div>
  );
};

export default PositionSection;
