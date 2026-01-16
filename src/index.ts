/**
 * ts-ascii-engine
 * A high-performance, zero-dependency TypeScript library for converting
 * images, video streams, and text into ASCII art. Framework agnostic.
 *
 * @module ts-ascii-engine
 * @author Your Name
 * @license MIT
 */

// Core engine
export { AsciiGenerator } from './core/ascii-engine';

// Type definitions and interfaces
export type {
  AsciiConfig,
  AsciiOutput,
  AsciiMetadata,
  ImageSource,
  CharColor,
  TextToAsciiOptions,
  PixelData
} from './types/interfaces';

export { CharsetPreset, CHARSET_MAP } from './types/interfaces';

// Utility functions (for advanced use cases)
export {
  extractPixelData,
  calculateLuminance,
  luminanceToChar,
  calculateDimensions,
  renderTextToCanvas,
  samplePixelColor,
  rgbToCSS
} from './utils/canvas-helpers';

/**
 * @example Basic Usage
 * ```typescript
 * import { AsciiGenerator, CharsetPreset } from 'ts-ascii-engine';
 *
 * const generator = new AsciiGenerator({
 *   charset: CharsetPreset.BLOCK,
 *   width: 80
 * });
 *
 * const img = document.querySelector('img');
 * const result = generator.convertImage(img);
 * console.log(result.text);
 * ```
 *
 * @example Video Stream
 * ```typescript
 * const video = document.querySelector('video');
 * const generator = new AsciiGenerator({ colored: true });
 *
 * function renderFrame() {
 *   const ascii = generator.convertImage(video);
 *   outputElement.innerHTML = ascii.html;
 *   requestAnimationFrame(renderFrame);
 * }
 * renderFrame();
 * ```
 *
 * @example Text to ASCII
 * ```typescript
 * const result = generator.convertText('HELLO', {
 *   font: 'Arial',
 *   fontSize: 72,
 *   fontWeight: 'bold'
 * });
 * console.log(result.text);
 * ```
 *
 * @example Web Worker Integration
 * ```typescript
 * // worker.ts
 * import { AsciiGenerator } from 'ts-ascii-engine';
 *
 * const generator = new AsciiGenerator();
 *
 * self.onmessage = (e: MessageEvent) => {
 *   const { imageData } = e.data;
 *   const result = generator.convertImage(imageData);
 *   self.postMessage(result);
 * };
 * ```
 *
 * @example Framework Integration - React
 * ```typescript
 * import { AsciiGenerator, CharsetPreset } from 'ts-ascii-engine';
 * import { useEffect, useRef } from 'react';
 *
 * function AsciiImage({ src }: { src: string }) {
 *   const outputRef = useRef<HTMLDivElement>(null);
 *
 *   useEffect(() => {
 *     const generator = new AsciiGenerator({
 *       charset: CharsetPreset.STANDARD,
 *       width: 100
 *     });
 *
 *     const img = new Image();
 *     img.onload = () => {
 *       const result = generator.convertImage(img);
 *       if (outputRef.current) {
 *         outputRef.current.innerHTML = result.html;
 *       }
 *     };
 *     img.src = src;
 *   }, [src]);
 *
 *   return <div ref={outputRef} />;
 * }
 * ```
 *
 * @example Framework Integration - Vue
 * ```typescript
 * // AsciiImage.vue
 * import { AsciiGenerator, CharsetPreset } from 'ts-ascii-engine';
 * import { ref, onMounted } from 'vue';
 *
 * export default {
 *   props: ['src'],
 *   setup(props) {
 *     const output = ref('');
 *
 *     onMounted(() => {
 *       const generator = new AsciiGenerator({
 *         charset: CharsetPreset.BLOCK
 *       });
 *
 *       const img = new Image();
 *       img.onload = () => {
 *         const result = generator.convertImage(img);
 *         output.value = result.html;
 *       };
 *       img.src = props.src;
 *     });
 *
 *     return { output };
 *   }
 * };
 * ```
 *
 * @example Framework Integration - Angular
 * ```typescript
 * // ascii.service.ts
 * import { Injectable } from '@angular/core';
 * import { AsciiGenerator, CharsetPreset, AsciiConfig } from 'ts-ascii-engine';
 *
 * @Injectable({
 *   providedIn: 'root'
 * })
 * export class AsciiService {
 *   private generator: AsciiGenerator;
 *
 *   constructor() {
 *     this.generator = new AsciiGenerator({
 *       charset: CharsetPreset.STANDARD,
 *       width: 80
 *     });
 *   }
 *
 *   convertImage(source: HTMLImageElement) {
 *     return this.generator.convertImage(source);
 *   }
 *
 *   updateConfig(config: Partial<AsciiConfig>) {
 *     this.generator.updateConfig(config);
 *   }
 * }
 * ```
 */
