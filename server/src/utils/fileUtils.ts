import { TIMEOUT } from "dns";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid'

export const cleanUpTemp = () => {
  const tempDir = path.resolve(__dirname, "../../temp");
  if (fs.existsSync(tempDir)) {
    fs.readdirSync(tempDir).forEach(file => {
      fs.unlinkSync(path.join(tempDir, file));
    });
  }
};

export const moveFileToExportFolder = (inputPath: string) => {
  const exportDir = ensureExportDirectory()

  const outputPath = path.join(exportDir, `${uuidv4()}.mp4`);
  fs.renameSync(inputPath, outputPath);
  return outputPath;
};

export const createProjectFolderDirectory = () => {
  const tempDir = path.resolve(__dirname, "../../temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const projectFolderDir = path.resolve(tempDir, `${uuidv4()}`)
  fs.mkdirSync(projectFolderDir, { recursive: true })

  return projectFolderDir
}

export const ensureExportDirectory = () => {
  const exportDir = path.resolve(__dirname, "../../exports");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  return exportDir
}