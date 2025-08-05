export const formatTimeHoursToMiliseconds = (timeSeconds: number): string => {
  const time = Math.trunc(timeSeconds);
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  const milliseconds = Math.floor((timeSeconds - time) * 100);

  return (
    `${hours.toString().padStart(2, "0")}:` +
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}.` +
    `${milliseconds.toString().padStart(2, "0")}`
  );
};

export const formatTimeMinutesToSecond = (timeSeconds: number): string => {
  const time = Math.trunc(timeSeconds);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return (
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`
  );
};
