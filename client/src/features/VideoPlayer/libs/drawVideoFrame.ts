import { MotionEffects } from "../../../types/video.types";

export const drawVideoFrame = (
  canvas: HTMLCanvasElement,
  videoElement: HTMLVideoElement,
  motionEffects?: MotionEffects | null
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!motionEffects) {
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return;
  }

  const { x, y, scale, rotation } = motionEffects;
  const angleRad = (rotation * Math.PI) / 180;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.save();
  ctx.translate(centerX + x, centerY + y);
  ctx.rotate(angleRad);
  ctx.scale(scale, scale);
  ctx.drawImage(videoElement, -centerX, -centerY, canvas.width, canvas.height);
  ctx.restore();
};
