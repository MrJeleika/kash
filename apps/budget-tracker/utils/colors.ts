import { reduceSaturation, colors } from '@MrJeleika/utils';

/**
 * Gets the color map from the central colors config
 */
function getTailwindColorMap(): Record<string, string> {
  return colors as Record<string, string>;
}

/**
 * Reduces saturation of a color, supporting both hex colors and Tailwind color names
 * @param color - Hex color string (e.g., "#e5343e") or Tailwind color name (e.g., "orange")
 * @param saturationFactor - Factor to multiply saturation by (0-1). Default 0.2
 * @param lightnessFactor - Optional factor to also reduce lightness (0-1). Default undefined (no change)
 * @returns Hex color string with reduced saturation
 * @example
 * reduceColorSaturation("#e5343e") // Returns something like "#431b1c"
 * reduceColorSaturation("orange") // Returns desaturated orange
 * reduceColorSaturation("orange", 0.3, 0.5) // Reduces saturation to 30% and lightness to 50%
 * reduceColorSaturation("#808080") // Returns something like "#2c2c2c"
 * reduceColorSaturation("#eb9d1f") // Returns something like "#463112"
 * reduceColorSaturation("#d44489") // Returns something like "#451735"
 */
export function reduceColorSaturation(
  color: string,
  saturationFactor: number = 0.6,
  lightnessFactor?: number
): string {
  // Check if it's a Tailwind color name
  const tailwindColors = getTailwindColorMap();
  const hexColor = tailwindColors[color] || color;
  return reduceSaturation(hexColor, saturationFactor, lightnessFactor);
}
