import SliderControl from "./SliderControl";
import RotationControl from "./RotationControl";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const RotationSliderWithEdit = ({ value, onChange }: Props) => {
  return (
    <div className="slider-with-edit-container">
      <RotationControl value={value} onChange={onChange} />
      <SliderControl
        label=""
        value={value}
        min={-180}
        max={180}
        step={0.1}
        onChange={onChange}
        formatValue={() => ""} // Hide the slider's display since we have the editable one above
      />
    </div>
  );
};

export default RotationSliderWithEdit;
