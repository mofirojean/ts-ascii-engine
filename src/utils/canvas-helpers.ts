/**
 * Canvas manipulation utilities for extracting and processing pixel data
 * @module utils/canvas-helpers
 */

import type { ImageSource, PixelData } from '../types/interfaces';

// Security limits to prevent DoS attacks
const MAX_DIMENSION = 10000;
const MAX_PIXELS = 25000000; // 5000x5000

/**
 * Extracts pixel data from various image sources
 * Handles HTMLImageElement, HTMLVideoElement, HTMLCanvasElement, and ImageData
 *
 * @param source - The image source to extract data from
 * @param targetWidth - Optional target width for resizing
 * @param targetHeight - Optional target height for resizing
 * @returns PixelData object containing Uint8ClampedArray and dimensions
 * @throws Error if source type is unsupported or canvas context unavailable
 */
export function extractPixelData(
  source: ImageSource,
  targetWidth?: number,
  targetHeight?: number
): PixelData {
  // Direct ImageData pass-through (already processed)
  if (source instanceof ImageData) {
    return {
      data: source.data,
      width: source.width,
      height: source.height
    };
  }

  // Create off-screen canvas for pixel extraction
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {
    willReadFrequently: true, // Performance hint for frequent getImageData calls
    alpha: true
  });

  if (!ctx) {
    throw new Error('Unable to obtain 2D canvas context');
  }

  // Determine source dimensions
  let sourceWidth: number;
  let sourceHeight: number;

  if (source instanceof HTMLCanvasElement) {
    sourceWidth = source.width;
    sourceHeight = source.height;
  } else {
    // HTMLImageElement or HTMLVideoElement
    sourceWidth = source.width || (source as HTMLVideoElement).videoWidth || 0;
    sourceHeight = source.height || (source as HTMLVideoElement).videoHeight || 0;
  }

  if (sourceWidth === 0 || sourceHeight === 0) {
    throw new Error('Source has invalid dimensions (0x0)');
  }

  // Apply target dimensions or use source dimensions
  const finalWidth = targetWidth ?? sourceWidth;
  const finalHeight = targetHeight ?? sourceHeight;

  // Security: Validate dimensions to prevent DoS
  if (finalWidth > MAX_DIMENSION || finalHeight > MAX_DIMENSION) {
    throw new Error(`Dimension exceeds maximum allowed (${MAX_DIMENSION})`);
  }

  if (finalWidth * finalHeight > MAX_PIXELS) {
    throw new Error(`Total pixel count exceeds maximum allowed (${MAX_PIXELS})`);
  }

  canvas.width = finalWidth;
  canvas.height = finalHeight;

  // Draw and extract pixel data with CORS error handling
  try {
    ctx.drawImage(source as CanvasImageSource, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return {
      data: imageData.data,
      width: imageData.width,
      height: imageData.height
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'SecurityError') {
      throw new Error(
        'Cannot extract pixel data from cross-origin image. ' +
        'Ensure the image has proper CORS headers (crossOrigin="anonymous") or use a same-origin image.'
      );
    }
    throw err;
  }
}

/**
 * Calculates luminance using Rec. 601 luma coefficients
 * This is perceptually weighted for human vision
 *
 * Formula: Y = 0.299R + 0.587G + 0.114B
 *
 * @param r - Red channel (0-255)
 * @param g - Green channel (0-255)
 * @param b - Blue channel (0-255)
 * @returns Luminance value (0-255)
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Maps a luminance value to a character from the charset
 * Uses linear interpolation for smooth gradients
 *
 * @param luminance - Brightness value (0-255)
 * @param charset - Character array ordered from dark to light
 * @param inverted - Whether to invert the mapping
 * @returns Single character from charset
 */
export function luminanceToChar(
  luminance: number,
  charset: string,
  inverted: boolean = false
): string {
  const normalizedLuminance = luminance / 255;
  const adjustedLuminance = inverted ? 1 - normalizedLuminance : normalizedLuminance;

  // Map to charset index
  const index = Math.floor(adjustedLuminance * (charset.length - 1));
  const clampedIndex = Math.max(0, Math.min(charset.length - 1, index));

  return charset[clampedIndex];
}

/**
 * Calculates dimensions with aspect ratio correction
 * Compensates for the fact that monospace characters are taller than they are wide
 *
 * @param sourceWidth - Original width in pixels
 * @param sourceHeight - Original height in pixels
 * @param targetWidth - Desired width in characters (optional)
 * @param targetHeight - Desired height in characters (optional)
 * @param aspectRatio - Font aspect ratio correction (height/width)
 * @returns Object with calculated width and height in characters
 */
export function calculateDimensions(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth?: number,
  targetHeight?: number,
  aspectRatio: number = 0.55
): { width: number; height: number } {
  // If both specified, width takes precedence
  if (targetWidth) {
    const calculatedHeight = Math.floor((sourceHeight / sourceWidth) * targetWidth * aspectRatio);
    return { width: targetWidth, height: calculatedHeight };
  }

  if (targetHeight) {
    const calculatedWidth = Math.floor((sourceWidth / sourceHeight) * targetHeight / aspectRatio);
    return { width: calculatedWidth, height: targetHeight };
  }

  // No target specified, use reasonable defaults based on source
  // Aim for ~100 character width as default
  const defaultWidth = Math.min(100, sourceWidth);
  const calculatedHeight = Math.floor((sourceHeight / sourceWidth) * defaultWidth * aspectRatio);

  return { width: defaultWidth, height: calculatedHeight };
}

/**
 * Renders text to an off-screen canvas and returns ImageData
 * Used for converting text strings into ASCII art
 *
 * @param text - Text to render
 * @param font - Font family
 * @param fontSize - Font size in pixels
 * @param fontWeight - Font weight
 * @param fontStyle - Font style
 * @param color - Text color
 * @param backgroundColor - Background color
 * @param padding - Padding in pixels
 * @returns ImageData of rendered text
 */
export function renderTextToCanvas(
  text: string,
  font: string = 'Arial',
  fontSize: number = 48,
  fontWeight: string | number = 'normal',
  fontStyle: string = 'normal',
  color: string = '#000000',
  backgroundColor: string = '#ffffff',
  padding: number = 10
): ImageData {
  // Security: Validate inputs
  const MAX_TEXT_LENGTH = 10000;
  const MAX_FONT_SIZE = 1000;
  const ALLOWED_FONT_STYLES = ['normal', 'italic', 'oblique'];
  const ALLOWED_FONT_WEIGHTS = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`Text length exceeds maximum allowed (${MAX_TEXT_LENGTH})`);
  }

  if (fontSize > MAX_FONT_SIZE || fontSize < 1) {
    throw new Error(`Font size must be between 1 and ${MAX_FONT_SIZE}`);
  }

  if (!ALLOWED_FONT_STYLES.includes(fontStyle)) {
    throw new Error(`Invalid font style. Allowed values: ${ALLOWED_FONT_STYLES.join(', ')}`);
  }

  const weightStr = String(fontWeight);
  if (!ALLOWED_FONT_WEIGHTS.includes(weightStr)) {
    throw new Error(`Invalid font weight. Allowed values: ${ALLOWED_FONT_WEIGHTS.join(', ')}`);
  }

  // Sanitize font family to prevent injection
  const sanitizedFont = font.replace(/["'`<>]/g, '');

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Unable to obtain 2D canvas context for text rendering');
  }

  // Configure font (ensure proper order: style weight size family)
  const fontString = `${fontStyle} ${fontWeight} ${fontSize}px "${sanitizedFont}"`;
  ctx.font = fontString;

  // Measure text to determine canvas size
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize * 1.5; // Better height estimation

  // Set canvas dimensions with padding
  canvas.width = Math.ceil(textWidth + padding * 2);
  canvas.height = Math.ceil(textHeight + padding * 2);

  // Re-apply font after canvas resize (canvas context resets)
  ctx.font = fontString;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  ctx.fillStyle = color;
  ctx.fillText(text, padding, padding);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Samples pixel color at a specific grid position
 * Averages pixels within the grid cell for better quality
 *
 * @param pixelData - Source pixel data
 * @param gridX - X position in character grid
 * @param gridY - Y position in character grid
 * @param gridWidth - Total grid width
 * @param gridHeight - Total grid height
 * @returns RGBA color values
 */
export function samplePixelColor(
  pixelData: PixelData,
  gridX: number,
  gridY: number,
  gridWidth: number,
  gridHeight: number
): { r: number; g: number; b: number; a: number } {
  const cellWidth = pixelData.width / gridWidth;
  const cellHeight = pixelData.height / gridHeight;

  // Calculate pixel boundaries for this grid cell
  const startX = Math.floor(gridX * cellWidth);
  const startY = Math.floor(gridY * cellHeight);
  const endX = Math.floor((gridX + 1) * cellWidth);
  const endY = Math.floor((gridY + 1) * cellHeight);

  let r = 0, g = 0, b = 0, a = 0;
  let sampleCount = 0;

  // Average all pixels in this grid cell with bounds checking
  for (let y = startY; y < endY && y < pixelData.height; y++) {
    for (let x = startX; x < endX && x < pixelData.width; x++) {
      const index = (y * pixelData.width + x) * 4;
      // Security: Validate array bounds
      if (index + 3 < pixelData.data.length) {
        r += pixelData.data[index];
        g += pixelData.data[index + 1];
        b += pixelData.data[index + 2];
        a += pixelData.data[index + 3];
        sampleCount++;
      }
    }
  }

  // Prevent division by zero
  if (sampleCount === 0) {
    return { r: 0, g: 0, b: 0, a: 255 };
  }

  return {
    r: Math.floor(r / sampleCount),
    g: Math.floor(g / sampleCount),
    b: Math.floor(b / sampleCount),
    a: Math.floor(a / sampleCount)
  };
}

/**
 * Converts RGB color to CSS string
 *
 * @param r - Red (0-255)
 * @param g - Green (0-255)
 * @param b - Blue (0-255)
 * @param a - Alpha (0-255)
 * @returns CSS rgba() string
 */
export function rgbToCSS(r: number, g: number, b: number, a: number = 255): string {
  // Security: Clamp values to valid range to prevent CSS injection
  const clampedR = Math.max(0, Math.min(255, Math.floor(r)));
  const clampedG = Math.max(0, Math.min(255, Math.floor(g)));
  const clampedB = Math.max(0, Math.min(255, Math.floor(b)));
  const clampedA = Math.max(0, Math.min(255, Math.floor(a)));

  const alpha = (clampedA / 255).toFixed(2);
  return `rgba(${clampedR},${clampedG},${clampedB},${alpha})`;
}
