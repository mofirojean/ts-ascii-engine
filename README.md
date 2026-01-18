# ts-ascii-engine

A high-performance, zero-dependency TypeScript library for converting images, video streams, and text into ASCII art. Framework agnostic and optimized for both browser and Node.js environments.

## Documentation

- **[Interactive API Documentation](docs/index.html)** - Complete API reference with live demos
- **[Live Examples](examples/)** - Working examples you can try right now
- **[Full API Reference](API_DOCUMENTATION.md)** - Detailed markdown documentation
- **[Quick Start Guide](QUICK_START.md)** - Get started in 5 minutes
- **[Testing Guide](TESTING_GUIDE.md)** - How to run and test examples

## Features

- **Zero Dependencies** - Pure TypeScript implementation
- **Framework Agnostic** - Works with vanilla JS, React, Vue, Angular, and any other framework
- **High Performance** - Optimized with typed arrays and minimal garbage collection
- **Tree-Shakable** - Import only what you need
- **Fully Typed** - Complete TypeScript definitions
- **Versatile Input** - Supports images, video streams, canvas, and text
- **Customizable** - Multiple charsets, aspect ratio correction, color support
- **Web Worker Ready** - Easy integration with Web Workers for off-thread processing

## Installation

```bash
npm install ts-ascii-engine
```

## Quick Start

```typescript
import { AsciiGenerator, CharsetPreset } from "ts-ascii-engine";

// Create generator instance
const generator = new AsciiGenerator({
  charset: CharsetPreset.BLOCK,
  width: 80,
  colored: false,
});

// Convert an image
const img = document.querySelector("img");
const result = generator.convertImage(img);

// Display as text
console.log(result.text);

// Or display as HTML
document.body.innerHTML = result.html;
```

## API Reference

### AsciiGenerator

The main class for converting images and text to ASCII art.

#### Constructor

```typescript
const generator = new AsciiGenerator(config?: AsciiConfig);
```

**Configuration Options:**

| Option        | Type                      | Default                  | Description                      |
| ------------- | ------------------------- | ------------------------ | -------------------------------- |
| `charset`     | `CharsetPreset \| string` | `CharsetPreset.STANDARD` | Character set for rendering      |
| `inverted`    | `boolean`                 | `false`                  | Invert brightness mapping        |
| `colored`     | `boolean`                 | `false`                  | Include color information        |
| `aspectRatio` | `number`                  | `0.55`                   | Font aspect ratio correction     |
| `width`       | `number`                  | `0` (auto)               | Target width in characters       |
| `height`      | `number`                  | `0` (auto)               | Target height in characters      |
| `optimized`   | `boolean`                 | `true`                   | Enable performance optimizations |

#### Methods

##### `convertImage(source: ImageSource): AsciiOutput`

Converts an image source to ASCII art.

**Parameters:**

- `source` - `HTMLImageElement`, `HTMLVideoElement`, `HTMLCanvasElement`, or `ImageData`

**Returns:** `AsciiOutput` object containing:

- `text: string` - Raw ASCII text with newlines
- `html: string` - HTML formatted output
- `characters: string[][]` - 2D array of characters
- `colors?: CharColor[][]` - 2D array of colors (if `colored: true`)
- `metadata: AsciiMetadata` - Processing information

##### `convertText(text: string, options?: TextToAsciiOptions): AsciiOutput`

Converts text to ASCII art by rendering it with a specified font first.

**Parameters:**

- `text` - String to convert
- `options` - Font and rendering options

**Options:**

| Option            | Type               | Default     | Description         |
| ----------------- | ------------------ | ----------- | ------------------- |
| `font`            | `string`           | `'Arial'`   | Font family         |
| `fontSize`        | `number`           | `48`        | Font size in pixels |
| `fontWeight`      | `string \| number` | `'normal'`  | Font weight         |
| `fontStyle`       | `string`           | `'normal'`  | Font style          |
| `color`           | `string`           | `'#000000'` | Text color          |
| `backgroundColor` | `string`           | `'#ffffff'` | Background color    |
| `padding`         | `number`           | `10`        | Padding in pixels   |

##### `generateColorMap(source: ImageSource): CharColor[][]`

Generates a 2D array of color data separately from ASCII characters.

##### `updateConfig(config: Partial<AsciiConfig>): void`

Updates configuration dynamically.

##### `getConfig(): Readonly<Required<AsciiConfig>>`

Returns the current configuration.

### Charset Presets

Built-in character sets optimized for different use cases:

```typescript
enum CharsetPreset {
  BLOCK = "BLOCK", // ██▓▒░
  STANDARD = "STANDARD", // @%#*+=-:.
  MINIMAL = "MINIMAL", // @+.
  EXTENDED = "EXTENDED", // Full 70+ character set
  CUSTOM = "CUSTOM", // Use custom string
}
```

**Custom Charset Example:**

```typescript
const generator = new AsciiGenerator({
  charset: "█▓▒░ ", // Custom characters, dark to light
});
```

## Usage Examples

### Basic Image Conversion

```typescript
import { AsciiGenerator, CharsetPreset } from "ts-ascii-engine";

const generator = new AsciiGenerator({
  charset: CharsetPreset.STANDARD,
  width: 100,
});

const img = new Image();
img.onload = () => {
  const result = generator.convertImage(img);
  document.getElementById("output").innerHTML = result.html;
};
img.src = "path/to/image.jpg";
```

### Video Stream (Real-time)

```typescript
const video = document.querySelector("video");
const generator = new AsciiGenerator({
  charset: CharsetPreset.BLOCK,
  colored: true,
  width: 80,
});

function renderFrame() {
  const ascii = generator.convertImage(video);
  document.getElementById("output").innerHTML = ascii.html;
  requestAnimationFrame(renderFrame);
}

video.addEventListener("play", renderFrame);
```

### Text to ASCII Banner

```typescript
const generator = new AsciiGenerator({
  charset: CharsetPreset.STANDARD,
});

const result = generator.convertText("HELLO WORLD", {
  font: "Arial",
  fontSize: 72,
  fontWeight: "bold",
});

console.log(result.text);
```

### Webcam Stream

```typescript
const video = document.createElement("video");
const generator = new AsciiGenerator({ width: 80, colored: true });

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
  video.play();

  function render() {
    const ascii = generator.convertImage(video);
    document.body.innerHTML = ascii.html;
    requestAnimationFrame(render);
  }
  render();
});
```

### Dynamic Configuration

```typescript
const generator = new AsciiGenerator();

// Update settings on the fly
generator.updateConfig({ width: 120, colored: true });

// Toggle inversion
generator.updateConfig({ inverted: true });
```

## Framework Integration

### React

```tsx
import { AsciiGenerator, CharsetPreset } from "ts-ascii-engine";
import { useEffect, useRef, useState } from "react";

function AsciiImage({ src }: { src: string }) {
  const [html, setHtml] = useState("");
  const generatorRef = useRef(
    new AsciiGenerator({
      charset: CharsetPreset.BLOCK,
      width: 100,
    }),
  );

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const result = generatorRef.current.convertImage(img);
      setHtml(result.html);
    };
    img.src = src;
  }, [src]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

### Vue 3 (Composition API)

```vue
<template>
  <div v-html="asciiHtml"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { AsciiGenerator, CharsetPreset } from "ts-ascii-engine";

const props = defineProps<{ src: string }>();
const asciiHtml = ref("");

const generator = new AsciiGenerator({
  charset: CharsetPreset.STANDARD,
  width: 80,
});

const convert = (src: string) => {
  const img = new Image();
  img.onload = () => {
    const result = generator.convertImage(img);
    asciiHtml.value = result.html;
  };
  img.src = src;
};

onMounted(() => convert(props.src));
watch(() => props.src, convert);
</script>
```

### Angular

```typescript
// ascii.service.ts
import { Injectable } from "@angular/core";
import {
  AsciiGenerator,
  CharsetPreset,
  AsciiConfig,
  AsciiOutput,
} from "ts-ascii-engine";

@Injectable({
  providedIn: "root",
})
export class AsciiService {
  private generator: AsciiGenerator;

  constructor() {
    this.generator = new AsciiGenerator({
      charset: CharsetPreset.STANDARD,
      width: 80,
    });
  }

  convertImage(source: HTMLImageElement | HTMLVideoElement): AsciiOutput {
    return this.generator.convertImage(source);
  }

  convertText(text: string, options = {}): AsciiOutput {
    return this.generator.convertText(text, options);
  }

  updateConfig(config: Partial<AsciiConfig>): void {
    this.generator.updateConfig(config);
  }
}
```

```typescript
// ascii.component.ts
import { Component, Input, OnInit } from "@angular/core";
import { AsciiService } from "./ascii.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-ascii-image",
  template: '<div [innerHTML]="asciiHtml"></div>',
})
export class AsciiImageComponent implements OnInit {
  @Input() src!: string;
  asciiHtml: SafeHtml = "";

  constructor(
    private asciiService: AsciiService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    const img = new Image();
    img.onload = () => {
      const result = this.asciiService.convertImage(img);
      this.asciiHtml = this.sanitizer.bypassSecurityTrustHtml(result.html);
    };
    img.src = this.src;
  }
}
```

## Web Worker Integration

Offload ASCII processing to a background thread for better performance:

### Worker Script (worker.ts)

```typescript
import { AsciiGenerator, CharsetPreset } from "ts-ascii-engine";

const generator = new AsciiGenerator({
  charset: CharsetPreset.BLOCK,
  colored: true,
});

self.onmessage = (e: MessageEvent) => {
  const { imageData, config } = e.data;

  if (config) {
    generator.updateConfig(config);
  }

  const result = generator.convertImage(imageData);
  self.postMessage(result);
};
```

### Main Thread

```typescript
const worker = new Worker("worker.js");
const video = document.querySelector("video");

function sendFrame() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  worker.postMessage({ imageData });

  requestAnimationFrame(sendFrame);
}

worker.onmessage = (e) => {
  document.getElementById("output").innerHTML = e.data.html;
};

sendFrame();
```

## Advanced Usage

### Custom Color Rendering

```typescript
const generator = new AsciiGenerator({ colored: false });
const result = generator.convertImage(img);
const colors = generator.generateColorMap(img);

// Custom rendering logic
let html = "<pre>";
for (let y = 0; y < result.characters.length; y++) {
  for (let x = 0; x < result.characters[y].length; x++) {
    const char = result.characters[y][x];
    const color = colors[y][x];
    html += `<span style="color:rgb(${color.r},${color.g},${color.b})">${char}</span>`;
  }
  html += "\n";
}
html += "</pre>";
```

### Aspect Ratio Tuning

Different fonts have different aspect ratios. Adjust for your specific font:

```typescript
// For most monospace fonts (Courier, Consolas)
const generator = new AsciiGenerator({ aspectRatio: 0.55 });

// For wider fonts
const generator = new AsciiGenerator({ aspectRatio: 0.6 });

// For narrower fonts
const generator = new AsciiGenerator({ aspectRatio: 0.5 });
```

### Performance Monitoring

```typescript
const result = generator.convertImage(img);
console.log(`Processed in ${result.metadata.processingTime.toFixed(2)}ms`);
console.log(`Generated ${result.metadata.characterCount} characters`);
console.log(`Dimensions: ${result.metadata.width}x${result.metadata.height}`);
```

## Utility Functions

The library also exports utility functions for advanced use cases:

```typescript
import {
  extractPixelData,
  calculateLuminance,
  luminanceToChar,
  calculateDimensions,
  renderTextToCanvas,
  samplePixelColor,
  rgbToCSS,
} from "ts-ascii-engine";
```

See TypeScript definitions for detailed documentation.

## Performance Tips

1. **Pre-size images** - Resize images before conversion for better performance
2. **Use Web Workers** - Offload processing for real-time video streams
3. **Optimize charset** - Shorter charsets process faster
4. **Disable colors** - Color processing adds overhead
5. **Limit dimensions** - Smaller output (width/height) = faster processing
6. **Reuse instances** - Create one generator and update config as needed

## Browser Compatibility

- Modern browsers with Canvas API support
- ES2020+ JavaScript environment
- Node.js 14+ (with canvas polyfill like `node-canvas`)

## Node.js Usage

For Node.js environments, you'll need a canvas implementation:

```bash
npm install canvas
```

```typescript
import { AsciiGenerator } from "ts-ascii-engine";
import { createCanvas, loadImage } from "canvas";

const generator = new AsciiGenerator();

loadImage("path/to/image.jpg").then((img) => {
  const result = generator.convertImage(img as any);
  console.log(result.text);
});
```

## TypeScript Support

Full TypeScript definitions are included. Import types as needed:

```typescript
import type {
  AsciiConfig,
  AsciiOutput,
  AsciiMetadata,
  CharColor,
  TextToAsciiOptions,
  ImageSource,
} from "ts-ascii-engine";
```

## License

MIT

## Development & Testing

### Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### Running Tests

This project includes automated test suites for build verification and security constraints.

```bash
# Run build verification tests
npm test

# Run security limit tests
npm run test:security
```

For manual testing of visual examples, see the [Testing Guide](TESTING_GUIDE.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

Built with performance and developer experience in mind.
