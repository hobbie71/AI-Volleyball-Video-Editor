import "./EditingButtons.css";
import Button from "./Button";
import { useVideoEditing } from "../../contexts/videoEditing/VideoEditingContext";
import { useCurrentTime } from "../../contexts/currentTime/CurrentTimeContext";
import { useCallback, useEffect } from "react";

interface Props {
  isVideoPlaying: boolean;
  setIsVideoPlaying: (bool: boolean) => void;
}

const EditingButtons = ({ isVideoPlaying, setIsVideoPlaying }: Props) => {
  const {
    addSplit,
    deleteCurrentVideoSelected,
    currentVideoSelected,
    jumpToNextBlock,
    jumpToPreviousBlock,
    trimLeftSide,
    trimRightSide,
  } = useVideoEditing();
  const { getCurrentTimeFormatted } = useCurrentTime();

  const setPlaybackState = useCallback(
    (state?: boolean) => {
      if (state === undefined) {
        setIsVideoPlaying(!isVideoPlaying);
      } else {
        setIsVideoPlaying(state);
      }
    },
    [isVideoPlaying, setIsVideoPlaying]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && e.key.toLowerCase() === "k") {
        e.preventDefault();
        addSplit();
      } else if (e.key === "k") {
        e.preventDefault();
        setPlaybackState();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        jumpToPreviousBlock();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        jumpToNextBlock();
      } else if (e.key.toLowerCase() === "q") {
        e.preventDefault();
        trimLeftSide();
      } else if (e.key.toLowerCase() === "w") {
        e.preventDefault();
        trimRightSide();
      } else if (e.key === "Backspace" && currentVideoSelected !== null) {
        e.preventDefault();
        deleteCurrentVideoSelected();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isVideoPlaying,
    setPlaybackState,
    jumpToPreviousBlock,
    jumpToNextBlock,
    trimLeftSide,
    trimRightSide,
    addSplit,
    deleteCurrentVideoSelected,
    currentVideoSelected,
  ]);

  return (
    <div className="editing-buttons-container">
      <div className="btn-group">
        <Button onClick={() => jumpToPreviousBlock()} variant="move" hotkey="↓">
          ←
        </Button>
        <Button onClick={() => setPlaybackState()} hotkey="K">
          {isVideoPlaying ? "Pause" : "Play"}
        </Button>
        <Button onClick={() => jumpToNextBlock()} variant="move" hotkey="↑">
          →
        </Button>
      </div>
      <div className="current-time">{getCurrentTimeFormatted()}</div>
      <div className="btn-group">
        <Button onClick={() => trimLeftSide()} variant="edit" hotkey="Q">
          Trim Left
        </Button>
        <Button onClick={() => addSplit()} variant="edit" hotkey="Ctrl+K">
          Add Split
        </Button>
        <Button onClick={() => trimRightSide()} variant="edit" hotkey="W">
          Trim Right
        </Button>
      </div>
      {currentVideoSelected !== null && (
        <Button
          onClick={deleteCurrentVideoSelected}
          variant="delete"
          hotkey="Backspace">
          Delete Video Block
        </Button>
      )}
    </div>
  );
};

export default EditingButtons;
