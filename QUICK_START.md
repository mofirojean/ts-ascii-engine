# Quick Start Guide

Get up and running with ts-ascii-engine in under 5 minutes.

## Installation

```bash
npm install ts-ascii-engine
```

## Basic Setup

### 1. Import the Library

```typescript
import { AsciiGenerator, CharsetPreset } from "ts-ascii-engine";
```

### 2. Create a Generator Instance

```typescript
const generator = new AsciiGenerator({
  charset: CharsetPreset.BLOCK, // Character set to use
  width: 80, // Output width in characters
  colored: false, // Enable/disable color
  aspectRatio: 0.55, // Font aspect correction
});
```

### 3. Convert an Image

```typescript
// Get an image element
const img = document.querySelector("img");

// Convert to ASCII
const result = generator.convertImage(img);

// Display as text
console.log(result.text);

// Or display as HTML
document.body.innerHTML = result.html;
```

## Common Use Cases

### Image Upload

```typescript
const input = document.querySelector('input[type="file"]');
input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const result = generator.convertImage(img);
      document.getElementById("output").innerHTML = result.html;
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});
```

### Webcam Stream

```typescript
const video = document.createElement("video");

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
  video.play();

  function render() {
    const result = generator.convertImage(video);
    document.getElementById("output").innerHTML = result.html;
    requestAnimationFrame(render);
  }

  render();
});
```

### Text Banner

```typescript
const result = generator.convertText("HELLO WORLD", {
  font: "Arial",
  fontSize: 72,
  fontWeight: "bold",
});

console.log(result.text);
```

## Configuration Options

### Charsets

```typescript
// Built-in presets
CharsetPreset.BLOCK; // ██▓▒░  (5 characters)
CharsetPreset.STANDARD; // @%#*+=-:.  (10 characters)
CharsetPreset.MINIMAL; // @+.  (3 characters)
CharsetPreset.EXTENDED; // 70+ characters for detail

// Custom charset (dark to light)
generator.updateConfig({ charset: "█▓▒░ " });
```

### Width/Height

```typescript
// Fixed width (height calculated automatically)
generator.updateConfig({ width: 100 });

// Fixed height (width calculated automatically)
generator.updateConfig({ height: 50 });
```

### Color Support

```typescript
// Enable colored ASCII
generator.updateConfig({ colored: true });

// Access color data
const colors = generator.generateColorMap(img);
```

### Aspect Ratio

```typescript
// Adjust for your font (typical: 0.5-0.6)
generator.updateConfig({ aspectRatio: 0.55 });
```

## Output Structure

```typescript
interface AsciiOutput {
  text: string; // Plain text with newlines
  html: string; // HTML with <pre> tag
  characters: string[][]; // 2D array of characters
  colors?: CharColor[][]; // 2D array of colors (if enabled)
  metadata: {
    width: number; // Output width in chars
    height: number; // Output height in chars
    characterCount: number; // Total characters
    processingTime: number; // Time in milliseconds
    charset: string; // Charset used
    hasColor: boolean; // Color enabled?
  };
}
```

## Performance Tips

1. **Limit output size** - Smaller dimensions = faster processing
2. **Use simpler charsets** - Fewer characters = faster lookup
3. **Disable colors** - Color processing adds overhead
4. **Use Web Workers** - For real-time video processing
5. **Reuse generator** - Create once, update config as needed

## Next Steps

- Check out the [full README](./README.md) for detailed documentation
- Explore [examples](./examples/) for more use cases
- See framework integrations for React, Vue, and Angular

## Troubleshooting

### Image not converting

- Ensure image is loaded (`img.complete === true`)
- Check CORS if loading from external source
- Verify image dimensions are valid

### Performance issues

- Reduce output width/height
- Use simpler charset
- Consider Web Worker for video

### Colors not showing

- Set `colored: true` in config
- Check HTML output is being used (not text)

## Support

- Documentation: [README.md](./README.md)
- Examples: [examples/](./examples/)
- Issues: GitHub Issues
