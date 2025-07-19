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
      // Trim Video
      const trimmedPaths: string[] = [];
      const totalVideos = videos.length;
      console.log(`📹 Processing ${totalVideos} video(s) for trimming`);

      for (let i = 0; i < videos.length; i++) {
        const videoProgress = Math.round(((i + 1) / totalVideos) * 100);
        const overallProgress = Math.round(10 + videoProgress * 0.6); // 10-70% range
        console.log(
          `🎬 Processing video ${i + 1}/${totalVideos} - Video: ${videoProgress}% | Overall: ${overallProgress}%`
        );

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

        // Check if input file exists
        if (!fs.existsSync(inputPath)) {
          console.error(`❌ Input file not found: ${inputPath}`);
          throw new Error(`Input file not found: ${inputPath}`);
        }

        const { resolution, bitrate, framerate } = exportSettings;

        // Motion Effects
        const scale = motionEffects?.scale || 1;
        const rotation = ((motionEffects?.rotation || 0) * Math.PI) / 180; // radians
        const xPercent = motionEffects?.x || 0; // -100 to +100 (0 = center)
        const yPercent = motionEffects?.y || 0; // -100 to +100 (0 = center)

        // Build filter string
        // 1. Rotate (centered, fill black)
        // 2. Crop for zoom effect (scale > 1 = zoom in, scale < 1 = zoom out)
        // 3. Scale to output resolution
        // 4. Pad to create canvas and position at x,y

        // Parse resolution (e.g., "1280x720" -> width=1280, height=720)
        const [resWidth, resHeight] = resolution.split("x").map(Number);

        // Convert percentage positioning to pixel offsets from center
        // 0% = center, +100% = full width/height to right/down, -100% = full width/height to left/up
        const xOffset = Math.round((xPercent / 100) * (resWidth / 2));
        const yOffset = Math.round((yPercent / 100) * (resHeight / 2));

        // Calculate final positions (center + offset)
        const centerX = Math.round(resWidth / 2);
        const centerY = Math.round(resHeight / 2);
        const finalX = centerX + xOffset;
        const finalY = centerY + yOffset;

        // Simplified approach: use scale filter with zoom effect + positioning
        // For scale > 1: zoom in by scaling up then cropping center
        // For scale < 1: zoom out by scaling down then padding
        let vf = "";

        if (scale >= 1) {
          // Zoom in: scale up, then crop to output size, then position
          vf = [
            `rotate=${rotation}:c=black@0:ow=rotw(iw):oh=roth(ih)`,
            `scale=iw*${scale}:ih*${scale}`,
            `crop=${resWidth}:${resHeight}:(iw-${resWidth})/2:(ih-${resHeight})/2`,
            `pad=${resWidth}:${resHeight}:${finalX}:${finalY}:black`,
          ].join(",");
        } else {
          // Zoom out: First create a large canvas, then scale down and position
          // Calculate a canvas size that's large enough after scaling
          const canvasWidth = Math.max(resWidth, Math.ceil(resWidth / scale));
          const canvasHeight = Math.max(
            resHeight,
            Math.ceil(resHeight / scale)
          );

          vf = [
            `rotate=${rotation}:c=black@0:ow=rotw(iw):oh=roth(ih)`,
            `scale=iw*${scale}:ih*${scale}`,
            `pad=${canvasWidth}:${canvasHeight}:(${canvasWidth}-iw)/2:(${canvasHeight}-ih)/2:black`,
            `crop=${resWidth}:${resHeight}:${finalX}:${finalY}`,
          ].join(",");
        }

        console.log(
          `🎨 Applied effects - Scale: ${scale}x, Rotation: ${motionEffects?.rotation || 0}°, Position: (${xPercent}%, ${yPercent}%) -> (${finalX}, ${finalY})px`
        );

        console.log(`⚙️ Running ffmpeg for video ${i + 1}...`);
        await execAsync(
          `ffmpeg -ss ${start} -i "${inputPath}" -t ${duration} -vf "${vf}" -b:v ${bitrate} -r ${framerate} -c:v libx264 -c:a aac "${outputPath}"`
        );
        console.log(`✅ Video ${i + 1} processed successfully`);

        trimmedPaths.push(outputPath);
      }

      // Store video data for project persistence
      const videoDataPath = path.join(projectFolderDir, "videoData.json");
      fs.writeFileSync(videoDataPath, JSON.stringify(videos, null, 2));

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
