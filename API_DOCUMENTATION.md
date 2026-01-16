# API Documentation

Complete reference guide for integrating `ts-ascii-engine` into your projects.

---

## Table of Contents

1. [Installation](#installation)
2. [Core Classes](#core-classes)
3. [Type Definitions](#type-definitions)
4. [Configuration](#configuration)
5. [Methods Reference](#methods-reference)
6. [Utility Functions](#utility-functions)
7. [Integration Examples](#integration-examples)
8. [Advanced Usage](#advanced-usage)

---

## Installation

```bash
npm install ts-ascii-engine
```

### Import in Your Project

**ES Modules (Recommended):**

```typescript
import { AsciiGenerator, CharsetPreset } from "ts-ascii-engine";
```

**CommonJS:**

```javascript
const { AsciiGenerator, CharsetPreset } = require("ts-ascii-engine");
```

**TypeScript:**

```typescript
import {
  AsciiGenerator,
  CharsetPreset,
  type AsciiConfig,
  type AsciiOutput,
  type TextToAsciiOptions,
} from "ts-ascii-engine";
```

---

## Core Classes

### `AsciiGenerator`

The main class for converting images, video, and text into ASCII art.

#### Constructor

```typescript
constructor(config?: AsciiConfig)
```

**Parameters:**

- `config` (optional): Configuration object for the generator

**Example:**

```typescript
const generator = new AsciiGenerator({
  charset: CharsetPreset.BLOCK,
  width: 100,
  colored: true,
  aspectRatio: 0.55,
});
```

---

## Type Definitions

### `AsciiConfig`

Configuration options for the ASCII generator.

```typescript
interface AsciiConfig {
  /**
   * Character set to use for rendering
   * Can be a preset name or custom string (ordered dark to light)
   * @default CharsetPreset.STANDARD
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
   * @default 0 (auto)
   */
  width?: number;

  /**
   * Target height in characters (width calculated automatically)
   * Overridden by width if both specified
   * @default 0 (auto)
   */
  height?: number;

  /**
   * Enable performance optimizations (typed arrays, minimal allocations)
   * @default true
   */
  optimized?: boolean;
}
```

**Usage Example:**

```typescript
const config: AsciiConfig = {
  charset: CharsetPreset.STANDARD,
  inverted: false,
  colored: true,
  aspectRatio: 0.55,
  width: 120,
  optimized: true,
};

const generator = new AsciiGenerator(config);
```

---

### `AsciiOutput`

The result object returned by conversion methods.

```typescript
interface AsciiOutput {
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
```

**Accessing Output:**

```typescript
const result: AsciiOutput = generator.convertImage(image);

// Display as text
console.log(result.text);

// Display as HTML
document.body.innerHTML = result.html;

// Access individual characters
const topLeftChar = result.characters[0][0];

// Access color data (if colored mode enabled)
if (result.colors) {
  const topLeftColor = result.colors[0][0];
  console.log(`RGB: ${topLeftColor.r}, ${topLeftColor.g}, ${topLeftColor.b}`);
}

// View metadata
console.log(`Processing time: ${result.metadata.processingTime}ms`);
console.log(`Dimensions: ${result.metadata.width}x${result.metadata.height}`);
```

---

### `AsciiMetadata`

Metadata about the conversion process.

```typescript
interface AsciiMetadata {
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
```

---

### `CharColor`

Color information for a single character.

```typescript
interface CharColor {
  /** Red channel (0-255) */
  r: number;

  /** Green channel (0-255) */
  g: number;

  /** Blue channel (0-255) */
  b: number;

  /** Alpha channel (0-255) */
  a: number;
}
```

**Usage:**

```typescript
const result = generator.convertImage(img);
if (result.colors) {
  // Access color at row 5, column 10
  const color = result.colors[5][10];
  const cssColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
}
```

---

### `CharsetPreset`

Built-in character set presets.

```typescript
enum CharsetPreset {
  /** High-density block characters: ██▓▒░  */
  BLOCK = "BLOCK",

  /** Standard ASCII density ramp: @%#*+=-:. */
  STANDARD = "STANDARD",

  /** Minimal 3-character set: @+. */
  MINIMAL = "MINIMAL",

  /** Extended detail set with more gradations */
  EXTENDED = "EXTENDED",

  /** Custom user-provided charset */
  CUSTOM = "CUSTOM",
}
```

**Character Sets:**

- `BLOCK`: `'██▓▒░ '` - 6 characters, modern look
- `STANDARD`: `'@%#*+=-:. '` - 10 characters, classic ASCII
- `MINIMAL`: `'@+. '` - 4 characters, simple/fast
- `EXTENDED`: 70+ characters, maximum detail

**Usage:**

```typescript
// Using preset
const gen1 = new AsciiGenerator({ charset: CharsetPreset.BLOCK });

// Using custom charset (dark to light order)
const gen2 = new AsciiGenerator({ charset: "█▓▒░ " });
```

---

### `ImageSource`

Supported input types for image conversion.

```typescript
type ImageSource =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement
  | ImageData;
```

**Examples:**

```typescript
// Image element
const img = document.querySelector("img");
const result1 = generator.convertImage(img);

// Video element
const video = document.querySelector("video");
const result2 = generator.convertImage(video);

// Canvas element
const canvas = document.querySelector("canvas");
const result3 = generator.convertImage(canvas);

// ImageData from canvas
const ctx = canvas.getContext("2d");
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const result4 = generator.convertImage(imageData);
```

---

### `TextToAsciiOptions`

Options for text-to-ASCII conversion.

```typescript
interface TextToAsciiOptions {
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
```

**Example:**

```typescript
const options: TextToAsciiOptions = {
  font: "Impact",
  fontSize: 72,
  fontWeight: "bold",
  fontStyle: "normal",
  color: "#000000",
  backgroundColor: "#ffffff",
  padding: 20,
};

const result = generator.convertText("HELLO", options);
```

---

## Configuration

### Default Configuration

When no configuration is provided, the generator uses these defaults:

```typescript
{
  charset: CharsetPreset.STANDARD,  // '@%#*+=-:. '
  inverted: false,
  colored: false,
  aspectRatio: 0.55,
  width: 0,      // Auto-calculated
  height: 0,     // Auto-calculated
  optimized: true
}
```

### Aspect Ratio Guide

Different fonts require different aspect ratio corrections:

| Font Type            | Recommended Aspect Ratio |
| -------------------- | ------------------------ |
| Most monospace fonts | `0.55` (default)         |
| Courier New          | `0.50`                   |
| Consolas             | `0.55`                   |
| Monaco               | `0.60`                   |
| Custom testing       | Try range `0.45 - 0.65`  |

**Testing aspect ratio:**

```typescript
// Start with default
let generator = new AsciiGenerator({ aspectRatio: 0.55 });

// If output looks stretched vertically, decrease
generator.updateConfig({ aspectRatio: 0.5 });

// If output looks compressed vertically, increase
generator.updateConfig({ aspectRatio: 0.6 });
```

---

## Methods Reference

### `convertImage(source: ImageSource): AsciiOutput`

Converts an image source to ASCII art.

**Parameters:**

- `source`: Image, video, canvas, or ImageData to convert

**Returns:** `AsciiOutput` object

**Example:**

```typescript
const img = new Image();
img.onload = () => {
  const result = generator.convertImage(img);

  // Display as HTML
  document.getElementById("output").innerHTML = result.html;

  // Or use raw text
  console.log(result.text);

  // Or access character array
  result.characters.forEach((row) => {
    console.log(row.join(""));
  });
};
img.src = "path/to/image.jpg";
```

**Real-time video:**

```typescript
const video = document.querySelector("video");

function renderFrame() {
  const result = generator.convertImage(video);
  document.getElementById("output").innerHTML = result.html;
  requestAnimationFrame(renderFrame);
}

video.addEventListener("play", renderFrame);
```

---

### `convertText(text: string, options?: TextToAsciiOptions): AsciiOutput`

Converts text into ASCII art by rendering it with a font first.

**Parameters:**

- `text`: String to convert
- `options`: Font and rendering options (optional)

**Returns:** `AsciiOutput` object

**Example:**

```typescript
// Simple text banner
const result1 = generator.convertText("HELLO");

// Custom font
const result2 = generator.convertText("ASCII", {
  font: "Impact",
  fontSize: 80,
  fontWeight: "bold",
});

// Styled text
const result3 = generator.convertText("COOL", {
  font: "Arial",
  fontSize: 60,
  fontWeight: 900,
  fontStyle: "italic",
});

console.log(result1.text);
```

---

### `generateColorMap(source: ImageSource): CharColor[][]`

Generates a 2D array of color data separately from character data.

**Parameters:**

- `source`: Image source to extract colors from

**Returns:** 2D array of `CharColor` objects

**Use case:** Advanced rendering scenarios where you want separate control over characters and colors.

**Example:**

```typescript
const colorMap = generator.generateColorMap(image);

// Custom rendering
let html = "<pre>";
for (let y = 0; y < result.characters.length; y++) {
  for (let x = 0; x < result.characters[y].length; x++) {
    const char = result.characters[y][x];
    const color = colorMap[y][x];
    html += `<span style="color:rgb(${color.r},${color.g},${color.b})">${char}</span>`;
  }
  html += "\n";
}
html += "</pre>";
```

---

### `updateConfig(config: Partial<AsciiConfig>): void`

Updates the configuration dynamically without creating a new instance.

**Parameters:**

- `config`: Partial configuration to update

**Returns:** void

**Example:**

```typescript
const generator = new AsciiGenerator();

// Update single property
generator.updateConfig({ width: 120 });

// Update multiple properties
generator.updateConfig({
  charset: CharsetPreset.BLOCK,
  colored: true,
  width: 100,
});

// Toggle settings
generator.updateConfig({ inverted: !generator.getConfig().inverted });
```

**Performance note:** Updating config is lightweight and doesn't require re-processing existing images.

---

### `getConfig(): Readonly<Required<AsciiConfig>>`

Returns the current configuration.

**Returns:** Read-only copy of current configuration

**Example:**

```typescript
const config = generator.getConfig();

console.log(`Current width: ${config.width}`);
console.log(`Colored mode: ${config.colored}`);
console.log(`Charset: ${config.charset}`);

// Use config to make decisions
if (config.width < 50) {
  console.log("Low detail mode");
} else if (config.width > 150) {
  console.log("High detail mode");
}
```

---

## Utility Functions

The library exports several utility functions for advanced use cases.

### `extractPixelData(source, targetWidth?, targetHeight?): PixelData`

Extracts pixel data from various image sources.

```typescript
import { extractPixelData } from "ts-ascii-engine";

const img = document.querySelector("img");
const pixelData = extractPixelData(img, 640, 480);

console.log(pixelData.width); // 640
console.log(pixelData.height); // 480
console.log(pixelData.data); // Uint8ClampedArray [r,g,b,a,...]
```

---

### `calculateLuminance(r, g, b): number`

Calculates luminance using Rec. 601 luma coefficients.

```typescript
import { calculateLuminance } from "ts-ascii-engine";

const luminance = calculateLuminance(100, 150, 200);
// Returns: 140.75

// Weighted formula: Y = 0.299*R + 0.587*G + 0.114*B
```

---

### `luminanceToChar(luminance, charset, inverted?): string`

Maps a luminance value to a character from the charset.

```typescript
import { luminanceToChar } from "ts-ascii-engine";

const char = luminanceToChar(128, "@%#*+=-:. ", false);
// Returns: '+'

const invertedChar = luminanceToChar(128, "@%#*+=-:. ", true);
// Returns: different character (inverted mapping)
```

---

### `calculateDimensions(sourceWidth, sourceHeight, targetWidth?, targetHeight?, aspectRatio?)`

Calculates dimensions with aspect ratio correction.

```typescript
import { calculateDimensions } from "ts-ascii-engine";

// Calculate dimensions for 640x480 image at 80 char width
const dims = calculateDimensions(640, 480, 80);
console.log(dims); // { width: 80, height: 33 }

// Custom aspect ratio
const dims2 = calculateDimensions(640, 480, 80, undefined, 0.6);
console.log(dims2); // { width: 80, height: 36 }
```

---

### `rgbToCSS(r, g, b, a?): string`

Converts RGB color to CSS string.

```typescript
import { rgbToCSS } from "ts-ascii-engine";

const cssColor = rgbToCSS(255, 100, 50);
// Returns: 'rgba(255,100,50,1.00)'

const transparentColor = rgbToCSS(255, 100, 50, 128);
// Returns: 'rgba(255,100,50,0.50)'
```

---

## Integration Examples

### React Integration

```typescript
import { AsciiGenerator, CharsetPreset } from 'ts-ascii-engine';
import { useEffect, useRef, useState } from 'react';

function AsciiImage({ src }: { src: string }) {
  const [html, setHtml] = useState('');
  const generatorRef = useRef(new AsciiGenerator({
    charset: CharsetPreset.BLOCK,
    width: 100,
    colored: true
  }));

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

// Usage
<AsciiImage src="/path/to/image.jpg" />
```

**With controls:**

```typescript
function AsciiConverter() {
  const [html, setHtml] = useState('');
  const [width, setWidth] = useState(100);
  const [colored, setColored] = useState(false);
  const generatorRef = useRef(new AsciiGenerator());

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const result = generatorRef.current.convertImage(img);
        setHtml(result.html);
      };
      img.src = event.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    generatorRef.current.updateConfig({ width, colored });
  }, [width, colored]);

  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      <input
        type="range"
        min="20"
        max="200"
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
      />
      <label>
        <input
          type="checkbox"
          checked={colored}
          onChange={(e) => setColored(e.target.checked)}
        />
        Colored
      </label>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
```

---

### Vue 3 Integration

```vue
<template>
  <div>
    <input type="file" @change="handleUpload" accept="image/*" />
    <input type="range" min="20" max="200" v-model.number="width" />
    <div v-html="asciiHtml"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { AsciiGenerator, CharsetPreset } from "ts-ascii-engine";

const width = ref(100);
const asciiHtml = ref("");
const generator = new AsciiGenerator({
  charset: CharsetPreset.BLOCK,
  width: 100,
});

// ... rest of implementation
</script>
```

---

### Angular Integration

```typescript
import { Component, Input, OnChanges } from "@angular/core";
import { AsciiGenerator, CharsetPreset } from "ts-ascii-engine";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-ascii-display",
  template: '<div [innerHTML]="asciiHtml"></div>',
  standalone: true,
})
export class AsciiDisplayComponent implements OnChanges {
  @Input() src: string = "";
  @Input() width: number = 100;

  asciiHtml: SafeHtml = "";
  private generator = new AsciiGenerator();

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    this.generator.updateConfig({ width: this.width });
    if (this.src) this.convert();
  }

  convert() {
    // ... load image and convert
  }
}
```

---

## Advanced Usage

For more examples and advanced usage patterns, see the [Examples Directory](examples/).
