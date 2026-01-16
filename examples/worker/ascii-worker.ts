/**
 * Web Worker for off-thread ASCII processing
 * Demonstrates how to use ts-ascii-engine in a Web Worker
 */

import { AsciiGenerator, CharsetPreset, AsciiConfig, AsciiOutput } from '../../src/index';

// Create generator instance
let generator = new AsciiGenerator({
  charset: CharsetPreset.BLOCK,
  colored: true,
  width: 80
});

// Message types for type safety
interface WorkerMessage {
  type: 'convert' | 'updateConfig';
  imageData?: ImageData;
  config?: Partial<AsciiConfig>;
}

interface WorkerResponse {
  type: 'result' | 'error';
  result?: AsciiOutput;
  error?: string;
}

// Handle incoming messages
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, imageData, config } = e.data;

  try {
    switch (type) {
      case 'updateConfig':
        if (config) {
          generator.updateConfig(config);
          self.postMessage({
            type: 'result',
            result: null
          } as WorkerResponse);
        }
        break;

      case 'convert':
        if (imageData) {
          const result = generator.convertImage(imageData);
          // Transfer result back to main thread
          self.postMessage({
            type: 'result',
            result
          } as WorkerResponse);
        }
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as WorkerResponse);
  }
};

// Export empty object for module
export {};
