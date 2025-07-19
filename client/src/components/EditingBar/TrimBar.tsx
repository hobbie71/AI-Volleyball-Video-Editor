interface Props {
  trimSide: -1 | 1;
  moveTrimBar: (
    e: React.MouseEvent<HTMLDivElement>,
    trimBarNumber: -1 | 1
  ) => void;
  trimSideDragging: -1 | 1 | null;
  getAmountTrimmed: () => number;
  videoID: string;
}

const TrimBar = ({
  trimSide,
  moveTrimBar,
  trimSideDragging,
  getAmountTrimmed,
  videoID,
}: Props) => {
  return (
    <div
      className={"trim-bar " + (trimSide === -1 ? "left" : "right")}
      data-video-id={videoID}
      onMouseDown={(e) => moveTrimBar(e, trimSide)}
      style={{
        left: trimSide === -1 ? "0%" : "",
        right: trimSide === 1 ? "0%" : "",
      }}>
      <div className="white-bar" />
      {trimSideDragging === trimSide && (
        <div
          className="amount-trimmed-display"
          style={{
            position: "absolute",
            backgroundColor: "black",
            color: "white",
            padding: "5px 10px",
            top: "110%",
          }}>
          {-getAmountTrimmed().toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default TrimBar;
