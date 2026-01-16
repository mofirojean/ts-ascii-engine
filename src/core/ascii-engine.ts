/**
 * Core ASCII Generator Engine
 * High-performance, zero-dependency ASCII art conversion
 * @module core/ascii-engine
 */

import type {
  AsciiConfig,
  AsciiOutput,
  CharColor,
  ImageSource,
  TextToAsciiOptions,
  AsciiMetadata
} from '../types/interfaces';
import { CHARSET_MAP, CharsetPreset } from '../types/interfaces';
import {
  extractPixelData,
  calculateLuminance,
  luminanceToChar,
  calculateDimensions,
  renderTextToCanvas,
  samplePixelColor,
  rgbToCSS
} from '../utils/canvas-helpers';

/**
 * High-performance ASCII art generator
 * Converts images, video frames, and text into ASCII representation
 *
 * @example
 * ```typescript
 * const generator = new AsciiGenerator({
 *   charset: CharsetPreset.BLOCK,
 *   colored: true,
 *   aspectRatio: 0.55
 * });
 *
 * const result = generator.convertImage(imageElement);
 * document.body.innerHTML = result.html;
 * ```
 */
export class AsciiGenerator {
  private readonly config: Required<AsciiConfig>;
  private readonly charset: string;

  /**
   * Creates a new ASCII generator instance
   *
   * @param config - Configuration options for ASCII conversion
   */
  constructor(config: AsciiConfig = {}) {
    // Apply defaults
    this.config = {
      charset: config.charset ?? CharsetPreset.STANDARD,
      inverted: config.inverted ?? false,
      colored: config.colored ?? false,
      aspectRatio: config.aspectRatio ?? 0.55,
      width: config.width ?? 0,
      height: config.height ?? 0,
      optimized: config.optimized ?? true
    };

    // Resolve charset
    this.charset = this.resolveCharset(this.config.charset);

    // Validate configuration
    this.validateConfig();
  }

  /**
   * Converts an image source to ASCII art
   *
   * @param source - Image, video, canvas, or ImageData to convert
   * @returns Complete ASCII output with text, HTML, and metadata
   *
   * @example
   * ```typescript
   * const img = document.querySelector('img');
   * const ascii = generator.convertImage(img);
   * console.log(ascii.text);
   * ```
   */
  public convertImage(source: ImageSource): AsciiOutput {
    const startTime = performance.now();

    // Extract pixel data from source
    const pixelData = extractPixelData(source);

    // Calculate target dimensions with aspect ratio correction
    const dimensions = calculateDimensions(
      pixelData.width,
      pixelData.height,
      this.config.width || undefined,
      this.config.height || undefined,
      this.config.aspectRatio
    );

    // Resize pixel data to target dimensions for processing
    const resizedPixelData = extractPixelData(
      source,
      dimensions.width,
      dimensions.height
    );

    // Generate ASCII representation
    const result = this.processPixelData(resizedPixelData, dimensions);

    const endTime = performance.now();

    // Build metadata
    const metadata: AsciiMetadata = {
      width: dimensions.width,
      height: dimensions.height,
      characterCount: dimensions.width * dimensions.height,
      processingTime: endTime - startTime,
      charset: this.charset,
      hasColor: this.config.colored
    };

    return {
      text: result.text,
      html: result.html,
      characters: result.characters,
      colors: result.colors,
      metadata
    };
  }

  /**
   * Converts text into ASCII art by rendering it to canvas first
   * Allows creating ASCII banners from any system font
   *
   * @param text - Text to convert
   * @param options - Font and rendering options
   * @returns ASCII output of the rendered text
   *
   * @example
   * ```typescript
   * const ascii = generator.convertText('HELLO', {
   *   font: 'Arial',
   *   fontSize: 72,
   *   fontWeight: 'bold'
   * });
   * console.log(ascii.text);
   * ```
   */
  public convertText(text: string, options: TextToAsciiOptions = {}): AsciiOutput {
    const {
      font = 'Arial',
      fontSize = 48,
      fontWeight = 'normal',
      fontStyle = 'normal',
      color = '#000000',
      backgroundColor = '#ffffff',
      padding = 10
    } = options;

    // Render text to canvas
    const imageData = renderTextToCanvas(
      text,
      font,
      fontSize,
      fontWeight,
      fontStyle,
      color,
      backgroundColor,
      padding
    );

    // Convert the rendered text image to ASCII
    return this.convertImage(imageData);
  }

  /**
   * Generates a color map separately from character data
   * Useful for advanced rendering scenarios
   *
   * @param source - Image source to extract colors from
   * @returns 2D array of color data
   */
  public generateColorMap(source: ImageSource): CharColor[][] {
    const pixelData = extractPixelData(source);

    const dimensions = calculateDimensions(
      pixelData.width,
      pixelData.height,
      this.config.width || undefined,
      this.config.height || undefined,
      this.config.aspectRatio
    );

    const resizedPixelData = extractPixelData(
      source,
      dimensions.width,
      dimensions.height
    );

    const colorMap: CharColor[][] = [];

    for (let y = 0; y < dimensions.height; y++) {
      const row: CharColor[] = [];
      for (let x = 0; x < dimensions.width; x++) {
        const color = samplePixelColor(
          resizedPixelData,
          x,
          y,
          dimensions.width,
          dimensions.height
        );
        row.push(color);
      }
      colorMap.push(row);
    }

    return colorMap;
  }

  /**
   * Updates the configuration dynamically
   * Useful for real-time parameter adjustments
   *
   * @param config - Partial configuration to update
   */
  public updateConfig(config: Partial<AsciiConfig>): void {
    if (config.charset !== undefined) {
      this.config.charset = config.charset;
      // Use Object.assign to bypass readonly constraint
      Object.assign(this, { charset: this.resolveCharset(config.charset) });
    }
    if (config.inverted !== undefined) this.config.inverted = config.inverted;
    if (config.colored !== undefined) this.config.colored = config.colored;
    if (config.aspectRatio !== undefined) this.config.aspectRatio = config.aspectRatio;
    if (config.width !== undefined) this.config.width = config.width;
    if (config.height !== undefined) this.config.height = config.height;
    if (config.optimized !== undefined) this.config.optimized = config.optimized;

    this.validateConfig();
  }

  /**
   * Gets the current configuration
   *
   * @returns Current configuration object (deep copy)
   */
  public getConfig(): Readonly<Required<AsciiConfig>> {
    return { ...this.config };
  }

  /**
   * Processes pixel data into ASCII representation
   * Core conversion algorithm with optional color support
   */
  private processPixelData(
    pixelData: ReturnType<typeof extractPixelData>,
    dimensions: { width: number; height: number }
  ): {
    text: string;
    html: string;
    characters: string[][];
    colors?: CharColor[][];
  } {
    const { width, height } = dimensions;
    const characters: string[][] = [];
    const colors: CharColor[][] | undefined = this.config.colored ? [] : undefined;
    const lines: string[] = [];
    const htmlLines: string[] = [];

    // Pre-allocate arrays for performance
    if (this.config.optimized) {
      characters.length = height;
      if (colors) colors.length = height;
    }

    for (let y = 0; y < height; y++) {
      const charRow: string[] = this.config.optimized ? new Array(width) : [];
      const colorRow: CharColor[] | undefined = colors
        ? (this.config.optimized ? new Array(width) : [])
        : undefined;
      let lineText = '';
      let htmlLine = '';

      for (let x = 0; x < width; x++) {
        // Sample pixel color for this grid position
        const color = samplePixelColor(pixelData, x, y, width, height);

        // Calculate luminance for character selection
        const luminance = calculateLuminance(color.r, color.g, color.b);

        // Map to character
        const char = luminanceToChar(luminance, this.charset, this.config.inverted);

        charRow[x] = char;
        if (colorRow) {
          colorRow[x] = color;
        }

        lineText += char;

        // Build HTML with inline color if enabled
        if (this.config.colored) {
          const cssColor = rgbToCSS(color.r, color.g, color.b, color.a);
          htmlLine += `<span style="color:${cssColor}">${this.escapeHtml(char)}</span>`;
        } else {
          htmlLine += this.escapeHtml(char);
        }
      }

      characters[y] = charRow;
      if (colorRow && colors) {
        colors[y] = colorRow;
      }
      lines.push(lineText);
      htmlLines.push(htmlLine);
    }

    const text = lines.join('\n');
    const html = this.buildHtmlOutput(htmlLines);

    return {
      text,
      html,
      characters,
      colors
    };
  }

  /**
   * Resolves charset from preset or custom string
   */
  private resolveCharset(charset: CharsetPreset | string): string {
    if (typeof charset === 'string' && Object.values(CharsetPreset).includes(charset as CharsetPreset)) {
      const preset = charset as CharsetPreset;
      if (preset === CharsetPreset.CUSTOM) {
        throw new Error('CUSTOM preset requires a custom charset string');
      }
      return CHARSET_MAP[preset];
    }

    // Treat as custom charset string - sanitize for security
    if (typeof charset === 'string' && charset.length > 0) {
      // Remove dangerous HTML/script characters to prevent XSS
      const sanitized = charset.replace(/[<>'"&`]/g, '');
      if (sanitized.length === 0) {
        throw new Error('Custom charset contains only invalid characters. Characters <, >, \', ", &, and ` are not allowed.');
      }
      return sanitized;
    }

    throw new Error('Invalid charset configuration');
  }

  /**
   * Validates configuration parameters
   */
  private validateConfig(): void {
    // Maximum dimensions to prevent DoS attacks
    const MAX_DIMENSION = 10000;
    const MAX_TOTAL_CHARS = 25000000; // 5000x5000

    if (this.charset.length === 0) {
      throw new Error('Charset cannot be empty');
    }

    if (this.config.aspectRatio <= 0) {
      throw new Error('Aspect ratio must be positive');
    }

    if (this.config.width < 0 || this.config.height < 0) {
      throw new Error('Width and height must be non-negative');
    }

    // Security: Prevent resource exhaustion
    if (this.config.width > MAX_DIMENSION) {
      throw new Error(`Width exceeds maximum allowed (${MAX_DIMENSION})`);
    }

    if (this.config.height > MAX_DIMENSION) {
      throw new Error(`Height exceeds maximum allowed (${MAX_DIMENSION})`);
    }

    // Check total character count if both dimensions specified
    if (this.config.width > 0 && this.config.height > 0) {
      const totalChars = this.config.width * this.config.height;
      if (totalChars > MAX_TOTAL_CHARS) {
        throw new Error(`Total character count (${totalChars}) exceeds maximum allowed (${MAX_TOTAL_CHARS})`);
      }
    }
  }

  /**
   * Builds final HTML output with proper formatting
   */
  private buildHtmlOutput(lines: string[]): string {
    const preStyle = this.config.colored
      ? 'style="font-family:monospace;line-height:1;white-space:pre;background:#000"'
      : 'style="font-family:monospace;line-height:1;white-space:pre"';

    return `<pre ${preStyle}>${lines.join('\n')}</pre>`;
  }

  /**
   * Escapes HTML special characters to prevent XSS
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
      '`': '&#96;'
    };
    return text.replace(/[&<>"'`]/g, (char) => map[char]);
  }
}
