import React, { createContext } from "react";
import { exportSettingsOptions } from "../../../config/exportSettings";

const ExportSettingsContext = createContext(exportSettingsOptions);

export const ExportSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ExportSettingsContext.Provider value={exportSettingsOptions}>
      {children}
    </ExportSettingsContext.Provider>
  );
};

export { ExportSettingsContext };
