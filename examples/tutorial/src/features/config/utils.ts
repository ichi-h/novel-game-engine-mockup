/**
 * Convert text speed (0.0-1.0) to text animation speed in milliseconds
 * Higher textSpeed = faster animation = lower ms value
 */
export const convertTextSpeed = (textSpeed: number): number => {
  return 200 - textSpeed * 190;
};
