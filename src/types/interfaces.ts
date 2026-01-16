/**
 * Core type definitions and interfaces for ts-ascii-engine
 * @module types/interfaces
 */

/**
 * Supported input types for ASCII conversion
 */
export type ImageSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageData;

/**
 * Predefined character sets for ASCII rendering
 */
export enum CharsetPreset {
  /** High-density block characters: ██▓▒░  */
  BLOCK = 'BLOCK',
  /** Standard ASCII density ramp: @%#*+=-:. */
  STANDARD = 'STANDARD',
  /** Minimal 3-character set: @+. */
  MINIMAL = 'MINIMAL',
  /** Extended detail set with more gradations */
  EXTENDED = 'EXTENDED',
  /** Custom user-provided charset */
  CUSTOM = 'CUSTOM'
}

/**
 * Character set mappings (ordered from darkest to lightest)
 */
export const CHARSET_MAP: Record<Exclude<CharsetPreset, CharsetPreset.CUSTOM>, string> = {
  [CharsetPreset.BLOCK]: '██▓▒░ ',
  [CharsetPreset.STANDARD]: '@%#*+=-:. ',
  [CharsetPreset.MINIMAL]: '@+. ',
  [CharsetPreset.EXTENDED]: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. '
};

/**
 * Configuration options for the ASCII generator
 */
export interface AsciiConfig {
  /**
   * Character set to use for rendering
   * Can be a preset name or custom string (ordered dark to light)
   */
  charset?: CharsetPreset | string;

  /**
   * Invert brightness mapping (light becomes dark and vice versa)
   * @default false
   */
  inverted?: boolean;

  /**
   * Include color information in output
   * @default false
   */
  colored?: boolean;

  /**
   * Aspect ratio correction factor for font rendering
   * Typical monospace fonts have a height:width ratio of ~2:1
   * @default 0.55
   */
  aspectRatio?: number;

  /**
   * Target width in characters (height calculated automatically)
   * If not specified, uses source dimensions
   */
  width?: number;

  /**
   * Target height in characters (width calculated automatically)
   * Overridden by width if both specified
   */
  height?: number;

  /**
   * Enable performance optimizations (typed arrays, minimal allocations)
   * @default true
   */
  optimized?: boolean;
}

/**
 * Metadata about the conversion process
 */
export interface AsciiMetadata {
  /** Width of the output in characters */
  width: number;

  /** Height of the output in characters */
  height: number;

  /** Total number of characters generated */
  characterCount: number;

  /** Processing time in milliseconds */
  processingTime: number;

  /** Character set used */
  charset: string;

  /** Whether color data is included */
  hasColor: boolean;
}

/**
 * Color information for a single character
 */
export interface CharColor {
  /** Red channel (0-255) */
  r: number;

  /** Green channel (0-255) */
  g: number;

  /** Blue channel (0-255) */
  b: number;

  /** Alpha channel (0-255) */
  a: number;
}

/**
 * Complete ASCII conversion output
 */
export interface AsciiOutput {
  /**
   * Raw ASCII text (newline-separated rows)
   */
  text: string;

  /**
   * HTML string with optional color styling
   * Uses <pre> with inline styles or CSS classes
   */
  html: string;

  /**
   * 2D array of characters for programmatic access
   */
  characters: string[][];

  /**
   * 2D array of color data (if colored: true)
   * Undefined if colors not requested
   */
  colors?: CharColor[][];

  /**
   * Metadata about the conversion
   */
  metadata: AsciiMetadata;
}

/**
 * Options for text-to-ASCII conversion
 */
export interface TextToAsciiOptions {
  /**
   * Font family to render text with
   * @default 'Arial'
   */
  font?: string;

  /**
   * Font size in pixels
   * @default 48
   */
  fontSize?: number;

  /**
   * Font weight
   * @default 'normal'
   */
  fontWeight?: string | number;

  /**
   * Font style
   * @default 'normal'
   */
  fontStyle?: string;

  /**
   * Text color for rendering (before conversion)
   * @default '#000000'
   */
  color?: string;

  /**
   * Background color for rendering
   * @default '#ffffff'
   */
  backgroundColor?: string;

  /**
   * Padding around text in pixels
   * @default 10
   */
  padding?: number;
}

/**
 * Internal utility type for pixel data processing
 */
export interface PixelData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}
