# Testing Guide - How to Run the Examples

## Quick Start (3 Steps)

### Step 1: Build the Library

```bash
cd "D:\Projects\Open Source Peojects\ts-ascii-engine"
npm run build
```

### Step 2: Start a Web Server

Choose ONE of these options:

**Option A - Python (Easiest)**

```bash
python -m http.server 8000
```

**Option B - Node.js**

```bash
npx serve -p 8000
```

**Option C - VS Code**

- Install "Live Server" extension
- Right-click any .html file → "Open with Live Server"

### Step 3: Open Examples in Browser

Navigate to these URLs:

| Example             | URL                                             | Description                  |
| ------------------- | ----------------------------------------------- | ---------------------------- |
| **Image Converter** | http://localhost:8000/examples/basic.html       | Upload images or use samples |
| **Video Stream**    | http://localhost:8000/examples/video.html       | Real-time webcam ASCII       |
| **Text Banner**     | http://localhost:8000/examples/text-banner.html | Convert text to ASCII        |
| **Quick Test**      | http://localhost:8000/examples/quick-test.html  | Verify build works           |

---

## Example Walkthroughs

### basic.html - Image to ASCII

**What to expect:**

1. Page loads with a sample landscape image
2. ASCII conversion appears automatically
3. Performance metrics shown below

**Things to try:**

- Click "Landscape", "Portrait", or "Pattern" sample buttons
- Upload your own image (JPG, PNG, GIF)
- Adjust width slider (20-200 chars)
- Try different charsets (Block looks cool!)
- Enable "Colored" checkbox for color ASCII
- Click "Inverted" to reverse brightness
- Download as TXT file
- Copy to clipboard

**Best practices:**

- High-contrast images work best
- Portraits: Use 80-120 width
- Landscapes: Use 100-150 width
- Colored mode looks amazing with photos!

---

### video.html - Webcam Stream

**What to expect:**

1. Click "Start Webcam"
2. Browser asks for camera permission → Click "Allow"
3. Video appears on left, ASCII on right
4. FPS counter shows real-time performance

**Things to try:**

- Change charset while streaming
- Toggle colored mode
- Move around and see ASCII update
- Wave at the camera!

**Troubleshooting:**
| Problem | Solution |
|---------|----------|
| "Permission denied" | Click camera icon in address bar → Allow |
| "No camera found" | Check if webcam is connected |
| "Low FPS" | Reduce width or disable colored mode |
| Camera in use | Close other apps using camera |

**Performance tips:**

- Width 60-80 = Best FPS
- Width 100-120 = Good detail
- Width 150+ = Slower but detailed

---

### text-banner.html - Text to ASCII

**What to expect:**

1. Page loads with "HELLO" as default
2. ASCII art appears immediately
3. Can change text and see instant update

**Things to try:**

- Type your name
- Try "ASCII", "COOL", "2026"
- Change font (Impact, Courier, Arial)
- Increase font size to 100+
- Try different font weights
- Click preset examples

**Font weight options:**

- normal = Regular text
- bold = Thick text
- 100 = Thin
- 900 = Very thick

---

## Common Issues & Solutions

### "Failed to load resource: 404"

**Problem:** Opening HTML file directly (file://)

**Solution:** MUST use a web server (http://)

```bash
# Start server first
python -m http.server 8000

# Then open
http://localhost:8000/examples/basic.html
```

---

### "Cannot find module"

**Problem:** Library not built

**Solution:**

```bash
npm run build
```

---

### "CORS policy" error

**Problem:** Wrong protocol or server

**Solution:**

- Use http://localhost (not file://)
- Run server from project root
- Check URL has port number

---

### Webcam not working

**Problem:** Various camera issues

**Solutions:**

1. Grant permission when prompted
2. Check camera isn't used by another app
3. Try different browser (Chrome recommended)
4. On Safari: May need HTTPS (use `python3 -m http.server --bind localhost 8000`)

---

### Images not converting

**Problem:** Image format or size

**Solutions:**

- Use JPG, PNG, or GIF
- Keep images under 5MB
- Ensure image loaded (check preview)

---

## Performance Expectations

### Image Conversion (basic.html)

| Width   | Processing Time | Quality        |
| ------- | --------------- | -------------- |
| 20-40   | <5ms            | Low detail     |
| 60-80   | 5-15ms          | Good           |
| 100-120 | 15-30ms         | Great          |
| 150-200 | 30-50ms         | Maximum detail |

### Video Stream (video.html)

| Settings            | Expected FPS | Use Case          |
| ------------------- | ------------ | ----------------- |
| Width 60, No color  | 50-60        | Smooth animation  |
| Width 80, No color  | 40-50        | Good balance      |
| Width 100, Colored  | 20-30        | Pretty but slower |
| Width 150+, Colored | 10-20        | High detail       |

---

## Testing Checklist

Before reporting issues, verify:

- [ ] Ran `npm run build` successfully
- [ ] Using web server (http://, not file://)
- [ ] Server started from project root
- [ ] Using modern browser (Chrome 90+, Firefox 88+)
- [ ] JavaScript enabled
- [ ] Console shows no errors (F12 → Console)

---

## Example URLs (After Starting Server)

With server running on port 8000:

```
http://localhost:8000/examples/basic.html
http://localhost:8000/examples/video.html
http://localhost:8000/examples/text-banner.html
http://localhost:8000/examples/quick-test.html

file:///D:/Projects/.../basic.html (WRONG - Won't work)
```

---

## Features to Test

### basic.html

- [ ] Upload image
- [ ] Click sample buttons (Landscape, Portrait, Pattern)
- [ ] Adjust width slider
- [ ] Change charset
- [ ] Toggle colored mode
- [ ] Toggle inverted mode
- [ ] Download as TXT
- [ ] Copy to clipboard
- [ ] Check performance metrics

### video.html

- [ ] Start webcam
- [ ] Grant permission
- [ ] See video on left
- [ ] See ASCII on right
- [ ] Change charset live
- [ ] Toggle colored mode
- [ ] Check FPS counter
- [ ] Stop webcam

### text-banner.html

- [ ] Enter custom text
- [ ] Change font family
- [ ] Adjust font size
- [ ] Change font weight
- [ ] Try preset examples
- [ ] Change charset

---

## Pro Tips

### For Best ASCII Art:

1. **Images**: Use high-contrast photos
2. **Width**: Start at 100, adjust to taste
3. **Charset**: Block = modern, Standard = classic
4. **Colored**: Makes photos look amazing
5. **Aspect Ratio**: 0.55 works for most fonts

### For Best Performance:

1. Lower width = faster processing
2. Simpler charset = slightly faster
3. Colored mode adds ~2-5ms overhead
4. Video: 60-80 width for smooth FPS

### For Sharing:

1. Download as TXT for Discord/forums
2. Copy to clipboard for quick sharing
3. Screenshot the output for images
4. Colored mode looks great on dark backgrounds

---

## Success Indicators

You'll know it's working when:

- Sample image loads automatically in basic.html
- ASCII art appears instantly
- Performance metrics show <50ms processing
- Video shows your face in ASCII (weird but cool!)
- Text banner creates recognizable letters
- No errors in browser console (F12)

---

## Getting Help

If problems persist:

1. Check browser console (F12)
2. Copy error message
3. Verify you followed all steps
4. Check IMPROVEMENTS.md for known issues
5. Review examples/README.md for more details

**All examples are tested and working - enjoy creating ASCII art!**
