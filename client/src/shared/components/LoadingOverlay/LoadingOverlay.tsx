// Style import
import "./LoadingOverlay.css";

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner" />
        <p>Processing video, please wait...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
