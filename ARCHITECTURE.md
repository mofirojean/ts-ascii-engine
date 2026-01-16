# Architecture Overview

## Design Philosophy

ts-ascii-engine is built with the following principles:

1. **Zero Dependencies** - Pure TypeScript with no external dependencies
2. **High Performance** - Optimized algorithms, typed arrays, minimal GC pressure
3. **Tree-Shakable** - Modular exports allow bundlers to eliminate unused code
4. **Framework Agnostic** - Works with any framework or vanilla JavaScript
5. **Type Safety** - Strict TypeScript typing throughout

## Project Structure

```
ts-ascii-engine/
├── src/
│   ├── core/
│   │   └── ascii-engine.ts       # Main AsciiGenerator class
│   ├── types/
│   │   └── interfaces.ts         # Type definitions and enums
│   ├── utils/
│   │   └── canvas-helpers.ts     # Canvas utilities
│   └── index.ts                  # Public API exports
├── examples/
│   ├── basic.html                # Basic image conversion
│   ├── video.html                # Real-time video stream
│   ├── text-banner.html          # Text to ASCII
│   └── worker/
│       ├── ascii-worker.ts       # Web Worker implementation
│       └── worker-demo.html      # Worker usage demo
├── dist/
│   ├── index.js                  # CommonJS build
│   ├── index.esm.js              # ES Module build
│   └── index.d.ts                # TypeScript declarations
└── README.md
```

## Core Components

### 1. AsciiGenerator (src/core/ascii-engine.ts)

The main class that handles ASCII conversion.

**Key Features:**
- Configurable charset selection
- Aspect ratio correction
- Color support
- Dynamic configuration updates
- Text rendering to ASCII

**Performance Optimizations:**
- Pre-allocated arrays when `optimized: true`
- Typed arrays (Uint8ClampedArray) for pixel data
- Efficient luminance calculation using Rec. 601
- Minimal object allocations in hot paths

### 2. Type Definitions (src/types/interfaces.ts)

**Key Types:**
- `AsciiConfig` - Configuration options
- `AsciiOutput` - Complete output structure
- `CharsetPreset` - Predefined character sets
- `ImageSource` - Supported input types
- `TextToAsciiOptions` - Text rendering options

**Charset Design:**
- All charsets ordered from darkest to lightest
- Optimized for various use cases (detail vs speed)
- Support for custom user-defined charsets

### 3. Canvas Helpers (src/utils/canvas-helpers.ts)

Utility functions for pixel data manipulation:

**Functions:**
- `extractPixelData()` - Extract pixel data from various sources
- `calculateLuminance()` - Rec. 601 weighted luminance
- `luminanceToChar()` - Map brightness to character
- `calculateDimensions()` - Aspect ratio correction
- `renderTextToCanvas()` - Text to ImageData
- `samplePixelColor()` - Average pixel sampling
- `rgbToCSS()` - Color conversion

## Algorithm Details

### Luminance Calculation

Uses ITU-R BT.601 standard for perceptually accurate brightness:

```
Y = 0.299 * R + 0.587 * G + 0.114 * B
```

This weights green more heavily because human vision is most sensitive to green light.

### Aspect Ratio Correction

Monospace characters are typically ~2x taller than wide. The default aspect ratio of 0.55 compensates for this:

```
correctedHeight = (sourceHeight / sourceWidth) * targetWidth * aspectRatio
```

### Character Mapping

Linear interpolation maps luminance (0-255) to charset index:

```
normalizedLuminance = luminance / 255
index = floor(normalizedLuminance * (charsetLength - 1))
character = charset[index]
```

### Color Sampling

For each character position, pixels are averaged within the grid cell for smooth color representation.

## Performance Characteristics

### Time Complexity
- Image conversion: O(w × h) where w,h are output dimensions
- Character lookup: O(1) with direct indexing
- Color sampling: O(pixels per cell) - typically constant

### Space Complexity
- Pixel data: O(source width × height × 4) - RGBA
- Output characters: O(output width × height)
- Color data (if enabled): O(output width × height × 4)

### Optimization Strategies

1. **Pre-allocation** - Arrays sized upfront when `optimized: true`
2. **Transferable Objects** - ImageData buffers can be transferred to workers
3. **Canvas Context Hints** - `willReadFrequently: true` for repeated reads
4. **Minimal Allocations** - Reuse objects in hot loops
5. **Direct Buffer Access** - Uint8ClampedArray for raw pixel data

## Browser Compatibility

### Minimum Requirements
- Canvas API support
- ES2020 JavaScript features
- TypedArray support
- Performance.now() for timing

### Tested Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Node.js 14+ (with canvas polyfill)

## Extension Points

### Custom Charsets

Users can provide custom charsets as strings:

```typescript
const generator = new AsciiGenerator({
  charset: '█▓▒░ '  // Must be ordered dark to light
});
```

### Custom Rendering

Access raw character and color arrays for custom rendering:

```typescript
const result = generator.convertImage(img);
// result.characters: string[][]
// result.colors: CharColor[][]

// Custom rendering logic here
```

### Web Worker Integration

Transfer ImageData to workers for off-thread processing:

```typescript
worker.postMessage({ imageData }, [imageData.data.buffer]);
```

## Future Enhancement Possibilities

1. **Advanced Dithering** - Error diffusion algorithms
2. **Edge Detection** - Preserve edges with special characters
3. **Animated GIF Support** - Frame-by-frame conversion
4. **SVG Output** - Scalable vector output
5. **WebGL Acceleration** - GPU-based processing
6. **Node.js Optimizations** - Native bindings for server-side

## Testing Strategy

While tests aren't included in this initial release, recommended testing approach:

1. **Unit Tests** - Test individual utility functions
2. **Integration Tests** - Test full conversion pipeline
3. **Performance Tests** - Benchmark various configurations
4. **Visual Regression** - Compare output across versions
5. **Browser Tests** - Cross-browser compatibility

## Build Process

1. **TypeScript Compilation** - Two builds (CJS + ESM)
2. **Declaration Generation** - TypeScript .d.ts files
3. **Tree-Shaking Ready** - `sideEffects: false` in package.json

```bash
npm run build:cjs    # CommonJS (dist/)
npm run build:esm    # ES Modules (dist-esm/)
npm run build        # Both + copy ESM to dist/
```

## Bundle Size

Approximate sizes (minified):
- Core engine: ~8KB
- Type definitions: ~4KB
- Canvas helpers: ~4KB
- **Total**: ~16KB (before gzip)
- **Gzipped**: ~6KB (estimated)

## License

MIT License - See LICENSE file for details
