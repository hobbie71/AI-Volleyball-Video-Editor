import { useState } from "react";

interface Props {
  children: string;
  onClick: () => void;
  variant?: "move" | "edit" | "cut" | "delete" | "default";
  hotkey?: string;
}

const Button = ({ children, onClick, variant = "default", hotkey }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      style={{ display: "inline-block", position: "relative" }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}>
      <button
        type="button"
        onClick={onClick}
        className={`btn btn-${variant}`}
        tabIndex={0}>
        {children}
      </button>
      {hotkey && showTooltip && (
        <div
          style={{
            position: "absolute",
            top: "-2em",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#222",
            color: "#fff",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 12,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 10,
          }}>
          Hotkey: {hotkey}
        </div>
      )}
    </div>
  );
};

export default Button;
