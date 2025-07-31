import { createContext, useState } from "react";

type VideoUploadContextType = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const VideoUploadContext = createContext<undefined | VideoUploadContextType>(
  undefined
);

export const VideoUploadProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <VideoUploadContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </VideoUploadContext.Provider>
  );
};

export { VideoUploadContext };
