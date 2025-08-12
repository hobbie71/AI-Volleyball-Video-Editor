import EditableValueControl from "./EditableValueControl";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const RotationControl = ({ value, onChange }: Props) => {
  return (
    <EditableValueControl
      label="Rotation (degrees)"
      value={value}
      onChange={onChange}
      min={-180}
      max={180}
      step={1}
      unit="°"
      className="rotation-value-span"
      inputClassName="rotation-value-input"
    />
  );
};

export default RotationControl;
