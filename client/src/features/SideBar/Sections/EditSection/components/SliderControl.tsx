interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

const SliderControl = ({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  onChange,
  formatValue,
}: Props) => {
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <label>
      {label}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span>{displayValue}</span>
    </label>
  );
};

export default SliderControl;
