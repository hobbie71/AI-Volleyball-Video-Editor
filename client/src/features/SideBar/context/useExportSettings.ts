import { useContext } from "react";
import { ExportSettingsContext } from "./ExportSettingsContext";

export const useExportSettings = () => {
  const context = useContext(ExportSettingsContext);

  if (!context)
    throw new Error(
      "useExportSettings must be within <ExportSettingsProvider>"
    );
  return context;
};
