import SliderControl from "./SliderControl";
import ScaleControl from "./ScaleControl";

interface Props {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

const ScaleSliderWithEdit = ({ value, min, max, onChange }: Props) => {
  return (
    <div className="slider-with-edit-container">
      <ScaleControl value={value} min={min} max={max} onChange={onChange} />
      <SliderControl
        label=""
        value={value}
        min={min}
        max={max}
        step={0.01}
        onChange={onChange}
        formatValue={() => ""} // Hide the slider's display since we have the editable one above
      />
    </div>
  );
};

export default ScaleSliderWithEdit;
