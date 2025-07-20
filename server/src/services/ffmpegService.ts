import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import { ensureExportDirectory } from "../utils/fileUtils";
import { Video, ExportSettings, MotionEffects } from "../types/types";

const execAsync = promisify(exec);

export const trimVideos = async (
  projectFolderDir: string,
  videos: Video[],
  exportSettings: ExportSettings
): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const trimmedPaths: string[] = [];
      const totalVideos = videos.length;

      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const motionEffects = video.motionEffects;
        const inputPath = path.resolve(
          __dirname,
          "../../videos",
          `${video.uploadId}.mp4`
        );
        const outputPath = path.resolve(projectFolderDir, `snippet_${i}.mp4`);
        const start = video.startTime;
        const duration = video.endTime - video.startTime;

        if (!fs.existsSync(inputPath)) {
          console.error(`❌ Input file not found: ${inputPath}`);
          throw new Error(`Input file not found: ${inputPath}`);
        }

        const { resolution, bitrate, framerate } = exportSettings;

        let vf: string = "";
        if (motionEffects) {
          const [resWidth, resHeight] = resolution.split("x").map(Number);

          // Scale Calculations
          const scaledResWidth = resWidth * motionEffects.scale;
          const scaledResHeight = resHeight * motionEffects.scale;

          // Offsets Calculations
          const xOffset =
            (resWidth * motionEffects.scale - resWidth) / 2 + motionEffects.x;
          const yOffset =
            (resHeight * motionEffects.scale - resHeight) / 2 + motionEffects.y;

          // Rotation Calculations
          const rotationRadians = motionEffects.rotation * (Math.PI / 180);

          vf = `
              rotate=${rotationRadians},
              scale=${scaledResWidth}:${scaledResHeight},
              crop=${resWidth}:${resHeight}:${xOffset}:${yOffset}
            `.replace(/\s+/g, ""); // Removes all spaces in string
        }

        console.log(`⚙️ Running ffmpeg for video ${i + 1}...`);
        await execAsync(
          `ffmpeg -ss ${start} -i "${inputPath}" -t ${duration} -vf "${vf}" -b:v ${bitrate} -r ${framerate} -c:v libx264 -c:a aac "${outputPath}"`
        );
        console.log(`✅ Video ${i + 1} processed successfully`);

        trimmedPaths.push(outputPath);
      }

      resolve(trimmedPaths);
    } catch (error) {
      reject(error);
    }
  });
};

export const mergeVideos = async (
  projectFolderDir: string,
  trimmedPaths: string[]
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(
        `🔗 Starting merge process for ${trimmedPaths.length} videos - 75%`
      );

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
      resolve(finalOutput);
    } catch (error) {
      reject(error);
    }
  });
};
