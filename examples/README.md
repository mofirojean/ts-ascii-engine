# Examples Guide

This directory contains working examples demonstrating how to use ts-ascii-engine in various scenarios.

## Setup

Before running the examples, make sure you've built the library:

```bash
npm run build
```

## Running the Examples

Since these examples use ES modules, you need to serve them through a local web server (not just opening the HTML files directly).

### Option 1: Using Python (Recommended)

If you have Python installed:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000/examples/`

### Option 2: Using Node.js http-server

```bash
# Install globally
npm install -g http-server

# Run from project root
http-server -p 8000
```

Then open: `http://localhost:8000/examples/`

### Option 3: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on any HTML file
3. Select "Open with Live Server"

### Option 4: Using npm serve

```bash
# Install globally
npm install -g serve

# Run from project root
serve -p 8000
```

Then open: `http://localhost:8000/examples/`

## Available Examples

### 1. quick-test.html

**Quick verification that the build is working**

- Tests ES module imports
- Creates a generator instance
- Converts text to ASCII
- Perfect for verifying your build

**Features tested:**

- ✓ Module imports
- ✓ Instance creation
- ✓ Text conversion
- ✓ HTML output

**Open:** `http://localhost:8000/examples/quick-test.html`

---

### 2. basic.html

**Interactive image to ASCII converter**

- Upload images
- Adjust settings in real-time
- Try different charsets
- See performance metrics

**Features:**

- Image file upload
- Charset selection (Block, Standard, Minimal, Extended)
- Width adjustment (20-200 characters)
- Aspect ratio control
- Color mode toggle
- Inverted mode toggle
- Performance metrics

**Open:** `http://localhost:8000/examples/basic.html`

---

### 3. video.html

**Real-time video stream to ASCII**

- Webcam stream processing
- Live ASCII rendering
- FPS counter
- Performance monitoring

**Features:**

- Webcam access
- Real-time conversion
- Charset switching
- Color mode
- Performance stats (FPS, processing time)

**Requirements:** Webcam/camera access

**Open:** `http://localhost:8000/examples/video.html`

---

### 4. text-banner.html

**Text to ASCII art banner generator**

- Convert text to ASCII art
- Customize fonts
- Adjust sizes and weights
- Multiple preset examples

**Features:**

- Custom text input
- Font family selection
- Font size control
- Font weight options
- Charset selection
- Preset examples

**Open:** `http://localhost:8000/examples/text-banner.html`

---

### 5. worker/worker-demo.html

**Web Worker integration example**

- Off-thread ASCII processing
- Non-blocking UI
- Performance comparison

**Features:**

- Web Worker setup
- Transferable objects
- Background processing
- Webcam integration

**Note:** This is a code example. To actually run it, you'd need to compile the worker TypeScript file:

```bash
# Compile worker
npx tsc examples/worker/ascii-worker.ts --outDir examples/worker --module es2020 --target es2020 --lib es2020,dom
```

**Open:** `http://localhost:8000/examples/worker/worker-demo.html`

## Troubleshooting

### "Failed to load module script" errors

**Problem:** The browser can't load ES modules

**Solution:** Make sure you're serving files through a web server (http://), not opening them directly (file://)

### "Cannot find module" errors

**Problem:** The build hasn't been run

**Solution:** Run `npm run build` from the project root

### CORS errors

**Problem:** Cross-origin request blocked

**Solution:** Use a local web server from the project root directory

### Webcam not working

**Problem:** Permission denied or camera in use

**Solutions:**

- Grant camera permissions when prompted
- Close other apps using the camera
- Use HTTPS (some browsers require it)

### Performance issues

**Problem:** Slow rendering or low FPS

**Solutions:**

- Reduce the output width
- Use a simpler charset (Minimal instead of Extended)
- Disable colored mode
- Use the Web Worker example for better performance

## Code Snippets

### Basic Usage in Your Own HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>My ASCII App</title>
  </head>
  <body>
    <div id="output"></div>

    <script type="module">
      import { AsciiGenerator, CharsetPreset } from "../dist-esm/index.js";

      const generator = new AsciiGenerator({
        charset: CharsetPreset.BLOCK,
        width: 80,
      });

      // Your code here
    </script>
  </body>
</html>
```

### Converting an Image

```javascript
const img = new Image();
img.onload = () => {
  const result = generator.convertImage(img);
  document.getElementById("output").innerHTML = result.html;
};
img.src = "path/to/image.jpg";
```

### Real-time Video

```javascript
const video = document.querySelector("video");
function render() {
  const result = generator.convertImage(video);
  document.getElementById("output").innerHTML = result.html;
  requestAnimationFrame(render);
}
video.addEventListener("play", render);
```

## Browser Compatibility

All examples work in modern browsers:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

ES modules and Canvas API required.

## Next Steps

- Modify the examples to suit your needs
- Check the main README.md for API documentation
- See ARCHITECTURE.md for technical details
- Build your own application using ts-ascii-engine!

## Support

If you encounter issues:

1. Make sure you've run `npm run build`
2. Verify you're using a local web server
3. Check the browser console for errors
4. See the main README.md for more help
