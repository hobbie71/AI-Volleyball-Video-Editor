import { VideoElementObject } from "../../../types/video.types";

export const getVideoElement = (
  videoId: string,
  videoRefs: VideoElementObject
) => {
  return videoRefs[videoId];
};
