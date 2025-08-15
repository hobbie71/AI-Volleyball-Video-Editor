import { Request, Response, NextFunction } from "express";
import { trimVideos, mergeVideos } from "../services/ffmpegService";
import {
  moveFileToExportFolder,
  cleanUpTemp,
  createProjectFolderDirectory,
} from "../utils/fileUtils";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants";

export const exportVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Create project folder
    const projectFolderDir = createProjectFolderDirectory();

    const allVideos = req.body.videos; // Should be array of Video metadata
    const exportSettings = req.body.exportSettings; // Should be an object of export settings

    const trimmedPaths = await trimVideos(
      projectFolderDir,
      allVideos,
      exportSettings
    );

    // Merge Videos if multiple videos
    let outputPath: string;
    if (trimmedPaths.length > 1) {
      console.log("🔗 Starting video merging - 75%");
      outputPath = await mergeVideos(projectFolderDir, trimmedPaths);
      console.log("🔗 Video merging completed - 95%");
    } else {
      console.log("📤 Moving single video to export folder - 90%");
      outputPath = moveFileToExportFolder(trimmedPaths[0]);
      console.log("📤 Video moved to export folder - 95%");
    }

    // cleanUpTemp();

    const fileName = outputPath.split("/").pop();
    const url = `/exports/${fileName}`;
    console.log("✅ Export completed successfully - 100%");
    
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      url,
      message: "Video exported successfully"
    });
  } catch (error) {
    console.error("❌ Export error:", error);
    next(error); // Pass error to error handler middleware
  }
};
