import EditableValueControl from "./EditableValueControl";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  dragThreshold?: number;
}

const PositionControl = ({
  label,
  value,
  onChange,
  dragThreshold = 3,
}: Props) => {
  return (
    <EditableValueControl
      label={label}
      value={value}
      onChange={onChange}
      enableDrag={true}
      dragThreshold={dragThreshold}
      className="position-span"
      inputClassName="position-input"
    />
  );
};

export default PositionControl;
