import { useState, useRef, useEffect } from "react";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
  enableDrag?: boolean;
  dragThreshold?: number;
  className?: string;
  inputClassName?: string;
}

const EditableValueControl = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  formatValue,
  enableDrag = false,
  dragThreshold = 3,
  className = "editable-value-span",
  inputClassName = "editable-value-input",
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState("");

  // Drag states (only used if enableDrag is true)
  const dragStart = useRef<number | null>(null);
  const dragStartMouseX = useRef<number | null>(null);
  const dragStarted = useRef<boolean>(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!enableDrag) return;

    dragStart.current = value;
    dragStartMouseX.current = e.clientX;
    dragStarted.current = false;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (
      !enableDrag ||
      dragStart.current === null ||
      dragStartMouseX.current === null
    )
      return;

    const diff = e.clientX - dragStartMouseX.current;
    if (!dragStarted.current && Math.abs(diff) > dragThreshold) {
      dragStarted.current = true;
    }
    if (dragStarted.current) {
      let newValue = dragStart.current + diff;

      // Apply constraints
      if (min !== undefined) newValue = Math.max(min, newValue);
      if (max !== undefined) newValue = Math.min(max, newValue);

      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    if (!enableDrag) return;

    dragStart.current = null;
    dragStartMouseX.current = null;
    dragStarted.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleDoubleClick = () => {
    // Only round to 2 decimals if value is a decimal
    const isDecimal = value % 1 !== 0;
    setTempValue(isDecimal ? Number(value).toFixed(2) : value.toString());
    setIsEditing(true);
    setTimeout(() => {
      // Use a more specific selector to avoid conflicts
      const selector = `.${inputClassName}[data-editing="true"]`;
      const input = document.querySelector<HTMLInputElement>(selector);
      input?.select();
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.value);
  };

  const handleInputSubmit = () => {
    const val = tempValue.trim();
    let newValue = val === "" || isNaN(Number(val)) ? 0 : Number(val);

    // Apply constraints
    if (min !== undefined) newValue = Math.max(min, newValue);
    if (max !== undefined) newValue = Math.min(max, newValue);

    onChange(newValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  // Reset temp value when not editing
  useEffect(() => {
    if (!isEditing) setTempValue("");
  }, [isEditing]);

  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;
  const dragText = enableDrag ? "Drag to change or d" : "D";
  const tooltip = `${dragText}ouble-click to edit ${label.toLowerCase()}`;

  return (
    <div>
      {label}:
      {!isEditing && (
        <span
          className={className}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          title={tooltip}
          style={{ cursor: enableDrag ? "ew-resize" : "pointer" }}>
          {displayValue}
        </span>
      )}
      {isEditing && (
        <input
          type="number"
          className={inputClassName}
          data-editing="true"
          autoFocus
          value={tempValue}
          min={min}
          max={max}
          step={step}
          onChange={handleInputChange}
          onBlur={handleInputSubmit}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};

export default EditableValueControl;
