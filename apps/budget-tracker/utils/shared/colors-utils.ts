/**
 * Converts hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converts RGB to HSL
 */
function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Converts HSL to RGB
 */
function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Converts RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Reduces the saturation and lightness of a hex color to create a darker, desaturated version
 * Uses adaptive factors based on the original color's characteristics to produce similar results
 * @param hex - Hex color string (e.g., "#e5343e" or "e5343e")
 * @param saturationFactor - Factor to multiply saturation by (0-1). If not provided, uses adaptive factor
 * @param lightnessFactor - Factor to multiply lightness by (0-1). Default 0.33
 * @returns Hex color string with reduced saturation and lightness
 * @example
 * reduceSaturation("#e5343e") // Returns a darker, desaturated version
 * reduceSaturation("#e5343e", 0.3) // Reduces saturation to 30% of original, lightness to 33%
 * reduceSaturation("#808080") // Returns something similar to "#2c2c2c"
 * reduceSaturation("#eb9d1f") // Returns something similar to "#463112"
 * reduceSaturation("#d44489") // Returns something similar to "#451735"
 */
export function reduceSaturation(
  hex: string,
  saturationFactor?: number,
  lightnessFactor: number = 0.33
): string {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Calculate adaptive saturation factor if not provided
  // Higher saturation colors get reduced more (around 0.7), lower saturation less (around 0.8)
  let calculatedSaturationFactor: number;
  if (saturationFactor !== undefined) {
    calculatedSaturationFactor = saturationFactor;
  } else if (hsl.s === 0) {
    calculatedSaturationFactor = 0;
  } else {
    // Adaptive formula: higher saturation -> lower factor (more reduction)
    // Range: 0.7 for very high saturation (>=80%), up to 0.8 for lower saturation
    const normalizedSat = Math.min(hsl.s / 100, 1);
    calculatedSaturationFactor = 0.8 - normalizedSat * 0.1;
  }

  // Calculate adaptive lightness factor
  // Slightly adjust based on original lightness to maintain visual consistency
  let calculatedLightnessFactor = lightnessFactor;
  if (hsl.s === 0) {
    // For grays, use a slightly higher factor to account for the lack of saturation
    calculatedLightnessFactor = 0.34;
  }

  // Reduce saturation (for grays with 0 saturation, keep it at 0)
  const newSaturation =
    hsl.s === 0
      ? 0
      : Math.max(0, Math.min(100, hsl.s * calculatedSaturationFactor));

  // Always reduce lightness
  const newLightness = Math.max(
    0,
    Math.min(100, hsl.l * calculatedLightnessFactor)
  );

  const newRgb = hslToRgb(hsl.h, newSaturation, newLightness);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}
