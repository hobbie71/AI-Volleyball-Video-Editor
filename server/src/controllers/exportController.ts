import { Request, Response } from "express";
import { trimVideos, mergeVideos } from "../services/ffmpegService";
import {
  moveFileToExportFolder,
  cleanUpTemp,
  createProjectFolderDirectory,
} from "../utils/fileUtils";

export const exportVideo = async (req: Request, res: Response) => {
  try {
    console.log("🚀 Export started - 0%");

    // Create project folder
    const projectFolderDir = createProjectFolderDirectory();
    console.log("📁 Project folder created - 5%");

    const allVideos = req.body.videos; // Should be array of Video metadata
    const exportSettings = req.body.exportSettings; // Should be an object of export settings

    console.log("🎬 Starting video trimming - 10%");
    const trimmedPaths = await trimVideos(
      projectFolderDir,
      allVideos,
      exportSettings
    );
    console.log("✂️ Video trimming completed - 70%");

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
    res.json({ url });
  } catch (error) {
    console.error("❌ Export error:", error);
  }
};
