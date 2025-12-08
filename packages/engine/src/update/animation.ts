export const calcTextAnimationDuration = (
  speed: number,
  charPosition: number,
): number => {
  const minDisplayTimePerChar = 200;
  const maxDisplayTimePerChar = 100;

  if (speed >= 100) return 0;

  if (speed <= 0) return minDisplayTimePerChar * charPosition;

  return maxDisplayTimePerChar * ((100 - speed) / 100) * charPosition;
};
