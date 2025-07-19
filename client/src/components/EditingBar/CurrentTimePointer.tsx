interface Props {
  containerWidth: number;
  currentTime: number;
  zoomDuration: number;
  scrollLeft: number;
  isHovering?: boolean;
}

const CurrentTimePointer = ({
  containerWidth,
  currentTime,
  zoomDuration,
  scrollLeft,
  isHovering,
}: Props) => {
  const pixelPosition =
    (currentTime / zoomDuration) * containerWidth - scrollLeft;

  return (
    <div
      className="current-pointer-container"
      style={{
        left: `${pixelPosition}px`,
        zIndex: 10,
      }}>
      {!isHovering && (
        <div
          className="top-arrow"
          style={{
            borderTop: `10px solid rgba(0, 0, 0, ${isHovering ? ".3" : "0.8"})`,
          }}
        />
      )}
      <div
        className="bar"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${isHovering ? ".3" : "0.8"})`,
          height: `${isHovering ? "100%" : "calc(100% - 10px)"}`,
        }}
      />
    </div>
  );
};

export default CurrentTimePointer;
