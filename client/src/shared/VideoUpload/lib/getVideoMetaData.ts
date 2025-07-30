import { Video } from "../../../types/video.types";
import { v4 as uuidv4 } from "uuid";

export const getVideoMetaData = (file: File): Promise<Video> => {
  return new Promise((resolve, reject) => {
    const tempVideoElement = document.createElement("video");
    const fileURL = URL.createObjectURL(file);

    tempVideoElement.src = fileURL;

    tempVideoElement.onloadedmetadata = () => {
      const duration = tempVideoElement.duration;
      resolve({
        id: uuidv4(),
        file: file,
        fileName: file.name,
        url: fileURL,
        duration: duration,
        startTime: 0,
        endTime: duration,
      });
    };

    tempVideoElement.onerror = () => {
      reject(new Error("Failed to load video metadata"));
    };
  });
};
