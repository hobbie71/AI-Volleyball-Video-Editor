import { MotionEffects } from "../../../types/video.types";

export const drawVideoFrame = (
  canvas: HTMLCanvasElement,
  videoElement: HTMLVideoElement,
  motionEffects?: MotionEffects | null
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (motionEffects) {
    const { x, y, scale, rotation } = motionEffects;
    const angleRad = (rotation * Math.PI) / 180;
    const vidWidth = videoElement.videoWidth;
    const vidHeight = videoElement.videoHeight;
    const centerX = vidWidth / 2;
    const centerY = vidHeight / 2;

    ctx.save();
    ctx.translate(centerX + x, centerY + y);
    ctx.rotate(angleRad);
    ctx.scale(scale, scale);
    ctx.drawImage(
      videoElement,
      -vidWidth / 2,
      -vidHeight / 2,
      vidWidth,
      vidHeight
    );
    ctx.restore();
  } else {
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  }
};
