export function formatTime(timeSeconds: number): string {
  const t = Math.trunc(timeSeconds);
  const hours = Math.floor(t / 3600);
  const minutes = Math.floor((t % 3600) / 60);
  const seconds = t % 60;
  const milliseconds = Math.floor((timeSeconds - t) * 100);

  return (
    `${hours.toString().padStart(2, "0")}:` +
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}.` +
    `${milliseconds.toString().padStart(2, "0")}`
  );
}
