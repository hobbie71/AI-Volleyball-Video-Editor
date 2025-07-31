// Main style import
import "./App.css";

// Page imports
import IntroPage from "../pages/IntroPage/IntroPage";
import EditingPage from "../pages/EditingPage/EditingPage";

// Component imports
import LoadingOverlay from "../shared/components/LoadingOverlay/LoadingOverlay";

// Hook imports
import { useVideoUploader } from "../shared/VideoUpload/hooks/useVideoUploader";

const App = () => {
  // Hooks
  const { videos, isLoading } = useVideoUploader();

  return (
    <>
      {/* Intro page */}
      {videos.length === 0 && (
        <div className="intro-page-container">
          <IntroPage />
        </div>
      )}

      {/* Editing page */}
      {videos.length > 0 && (
        <div className="editing-page-container">
          <EditingPage />
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && <LoadingOverlay />}
    </>
  );
};

export default App;
