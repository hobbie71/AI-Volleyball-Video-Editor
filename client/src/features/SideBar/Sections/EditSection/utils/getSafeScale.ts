/**
 * Calculates the safe minimum scale for a video to fit within the canvas
 * after rotation, ensuring no transparent areas are visible.
 */
export const getSafeScale = (
  rotationDegrees: number,
  resWidth: number,
  resHeight: number
): number => {
  if (resWidth <= 0 || resHeight <= 0) return 1;

  // Convert degrees to radians for math functions
  const angleRadians = (rotationDegrees * Math.PI) / 180;

  const isWidthLonger = resWidth >= resHeight;
  const longerSide = isWidthLonger ? resWidth : resHeight;
  const shorterSide = isWidthLonger ? resHeight : resWidth;

  const absSin = Math.abs(Math.sin(angleRadians));
  const absCos = Math.abs(Math.cos(angleRadians));

  if (
    shorterSide <= 2 * absSin * absCos * longerSide ||
    Math.abs(absSin - absCos) < 1e-10
  ) {
    // Half-constrained case: crop corners touch longer side
    const halfShortSide = 0.5 * shorterSide;
    const maxInnerWidth = isWidthLonger
      ? halfShortSide / absSin
      : halfShortSide / absCos;
    const maxInnerHeight = isWidthLonger
      ? halfShortSide / absCos
      : halfShortSide / absSin;

    const scale = Math.max(
      resWidth / maxInnerWidth,
      resHeight / maxInnerHeight
    );
    return scale;
  } else {
    // Fully constrained case: crop touches all 4 sides
    const cosDoubleAngle = absCos * absCos - absSin * absSin;
    const maxInnerWidth =
      (resWidth * absCos - resHeight * absSin) / cosDoubleAngle;
    const maxInnerHeight =
      (resHeight * absCos - resWidth * absSin) / cosDoubleAngle;

    const scale = Math.max(
      resWidth / maxInnerWidth,
      resHeight / maxInnerHeight
    );
    return scale;
  }
};
