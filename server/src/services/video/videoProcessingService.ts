import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { TimelineVideo, ExportSettings } from "@shared/types/video.types";
import { buildFFmpegCommand } from "../../utils/ffmpeg/commandBuilder";
import { ensureExportDirectory } from "../../utils/fileUtils";
import { v4 as uuidv4 } from "uuid";

const execAsync = promisify(exec);

export const trimVideos = async (
  projectFolderDir: string,
  videos: TimelineVideo[],
  exportSettings: ExportSettings
): Promise<string[]> => {
  const trimmedPaths: string[] = [];

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const inputPath = path.resolve(
      __dirname,
      "../../../videos",
      `${video.videoId}.mp4`
    );

    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    const outputPath = path.resolve(projectFolderDir, `snippet_${i}.mp4`);
    const ffmpegCmd = buildFFmpegCommand(video, inputPath, outputPath, exportSettings);

    console.log(`⚙️ Running ffmpeg for video ${i + 1}...`);
    await execAsync(ffmpegCmd);
    console.log(`✅ Video ${i + 1} processed successfully`);

    trimmedPaths.push(outputPath);
  }

  return trimmedPaths;
};

export const mergeVideos = async (
  projectFolderDir: string,
  trimmedPaths: string[]
): Promise<string> => {
  console.log(`🔗 Starting merge process for ${trimmedPaths.length} videos - 75%`);

  // Ensure exports directories exist
  const exportDir = ensureExportDirectory();
  console.log(`📁 Export directory ready - 80%`);

  // Create concat list file
  const concatListPath = path.join(projectFolderDir, "concat.txt");
  const concatFileContent = trimmedPaths
    .map((p) => `file '${p.replace(/\\/g, "/")}'`)
    .join("\n");

  fs.writeFileSync(concatListPath, concatFileContent);
  console.log(`📝 Concat file created - 85%`);

  // Merge Video
  const finalOutput = path.join(exportDir, `${uuidv4()}.mp4`);
  console.log(`⚙️ Running ffmpeg merge - 90%`);

  await execAsync(
    `ffmpeg -f concat -safe 0 -i "${concatListPath}" -c copy "${finalOutput}"`
  );

  console.log(`✅ Videos merged successfully - 95%`);
  return finalOutput;
};
