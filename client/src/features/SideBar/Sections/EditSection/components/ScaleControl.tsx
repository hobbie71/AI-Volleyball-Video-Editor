import EditableValueControl from "./EditableValueControl";

interface Props {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

const ScaleControl = ({ value, min, max, onChange }: Props) => {
  return (
    <EditableValueControl
      label="Scale (Zoom)"
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={0.01}
      formatValue={(val) => `${val.toFixed(2)}x`}
      className="scale-value-span"
      inputClassName="scale-value-input"
    />
  );
};

export default ScaleControl;
