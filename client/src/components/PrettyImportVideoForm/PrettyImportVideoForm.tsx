import { useRef, useState, useEffect, useCallback } from "react";
import { useVideo } from "../../contexts/video/VideoContext";
import "./PrettyImportVideoFrom.css";

interface Props {
  setIsLoading: (isLoading: boolean) => void;
}

const PrettyImportVideoForm = ({ setIsLoading }: Props) => {
  const { uploadVideo } = useVideo();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length > 0) {
        setIsLoading(true);
        try {
          await uploadVideo(fileArray);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [uploadVideo, setIsLoading]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  // Drag and drop handlers for the form only
  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingFile(true);
    };

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingFile(false);
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingFile(false);
      if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
    };

    dropArea.addEventListener("dragover", onDragOver);
    dropArea.addEventListener("dragleave", onDragLeave);
    dropArea.addEventListener("drop", onDrop);

    return () => {
      dropArea.removeEventListener("dragover", onDragOver);
      dropArea.removeEventListener("dragleave", onDragLeave);
      dropArea.removeEventListener("drop", onDrop);
    };
  }, [handleFiles]);

  return (
    <div
      ref={dropRef}
      className={`pretty-import-form${isDraggingFile ? " dragging" : ""}`}>
      <p style={{ marginBottom: 16 }}>Drag & drop your video(s)</p>
      <p style={{ margin: "8px 0" }}>or</p>
      <button
        type="button"
        className="pretty-import-btn"
        onClick={() => inputRef.current?.click()}>
        Select Video File
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        multiple
        style={{ display: "none" }}
        onChange={onChange}
      />
    </div>
  );
};

export default PrettyImportVideoForm;
