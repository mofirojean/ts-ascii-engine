# Security Best Practices

## Overview

`ts-ascii-engine` has been designed with security in mind, but like any library that processes user input and generates HTML output, it requires proper usage to maintain security in your applications.

## Security Measures Implemented

### 1. Input Validation & Sanitization

#### Charset Sanitization

- **Issue**: Custom charset strings could contain malicious HTML/script characters
- **Protection**: All custom charset strings are automatically sanitized to remove dangerous characters: `<`, `>`, `'`, `"`, `&`, `` ` ``
- **Implementation**: See `src/core/ascii-engine.ts:resolveCharset()`

```typescript
// UNSAFE (characters removed automatically)
const generator = new AsciiGenerator({
  charset: '<script>alert("XSS")</script>',
});

// SAFE - dangerous chars automatically removed
// Resulting charset: 'scriptalert("XSS")/script'
```

#### Dimension Limits

- **Issue**: Unbounded canvas dimensions could cause memory exhaustion (DoS)
- **Protection**: Maximum limits enforced
  - Max width/height: 10,000 characters
  - Max total characters (Standard): 25,000,000 (5000×5000)
  - **Max total characters (Colored)**: 1,000,000 (1000×1000) - Strict limit to prevent browser crashes
- **Implementation**: See `src/core/ascii-engine.ts:validateConfig()`

```typescript
// THROWS ERROR (Colored Mode Limit)
const generator = new AsciiGenerator({
  width: 2000,
  height: 2000,
  colored: true, // 4M chars > 1M limit
});

// SAFE
const generator = new AsciiGenerator({
  width: 1000,
  height: 1000,
  colored: true, // 1M chars <= 1M limit
});
```

#### Text Length Limits

- **Issue**: Extremely long text could cause resource exhaustion
- **Protection**: Maximum text length of 10,000 characters
- **Implementation**: See `src/utils/canvas-helpers.ts:renderTextToCanvas()`

### 2. HTML Output Security

#### HTML Escaping

- **Protection**: All character output is HTML-escaped to prevent XSS
- **Characters escaped**: `&`, `<`, `>`, `"`, `'`, `` ` ``
- **Implementation**: See `src/core/ascii-engine.ts:escapeHtml()`

```typescript
const result = generator.convertImage(img);
// All characters in result.html are properly escaped
```

#### CSS Value Validation

- **Protection**: All RGB color values are clamped to valid ranges (0-255)
- **Implementation**: See `src/utils/canvas-helpers.ts:rgbToCSS()`

### 3. CORS Protection

#### Cross-Origin Image Handling

- **Protection**: Clear error messages for CORS issues
- **Error**: Throws descriptive error when attempting to process cross-origin images without proper headers
- **Implementation**: See `src/utils/canvas-helpers.ts:extractPixelData()`

```typescript
// Will throw SecurityError if image doesn't have CORS headers
const img = new Image();
img.src = "https://external-domain.com/image.jpg";

// SAFE - Enable CORS
const img = new Image();
img.crossOrigin = "anonymous";
img.src = "https://external-domain.com/image.jpg";
```

### 4. Array Bounds Checking

#### Pixel Data Access

- **Protection**: All array access is bounds-checked
- **Implementation**: See `src/utils/canvas-helpers.ts:samplePixelColor()`

## Security Best Practices for Users

### 1. Sanitize Custom Charsets

**Never pass user-controlled data directly as custom charsets:**

```typescript
// UNSAFE - Don't do this
const userCharset = prompt("Enter custom charset:");
const generator = new AsciiGenerator({ charset: userCharset });

// SAFE - Validate first
function isValidCharset(charset: string): boolean {
  return /^[\w\s\.,-_]+$/.test(charset) && charset.length <= 20;
}

const userCharset = prompt("Enter custom charset:");
if (isValidCharset(userCharset)) {
  const generator = new AsciiGenerator({ charset: userCharset });
}
```

### 2. Limit Input Dimensions

**Set reasonable limits based on your use case:**

```typescript
// RECOMMENDED - Set limits appropriate for your application
function createGenerator(userWidth: number) {
  const MAX_WIDTH = 300; // Your application's limit
  const safeWidth = Math.min(userWidth, MAX_WIDTH);

  return new AsciiGenerator({ width: safeWidth });
}
```

### 3. Use Content Security Policy (CSP)

**When displaying HTML output, implement CSP headers:**

```html
<!-- RECOMMENDED CSP headers -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; style-src 'unsafe-inline'"
/>
```

**Note**: `'unsafe-inline'` is needed for inline styles if using colored mode. For stricter CSP, use plain text output:

```typescript
// STRICTEST - Use text output instead of HTML
const result = generator.convertImage(img);
document.getElementById("output").textContent = result.text;
```

### 4. Handle CORS Properly

**Always set crossOrigin when loading external images:**

```typescript
// CORRECT
async function loadExternalImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Important!
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
```

### 5. Validate Text Inputs

**Limit text length when using `convertText()`:**

```typescript
// SAFE
function convertUserText(text: string) {
  const MAX_LENGTH = 100; // Your limit
  const safeText = text.substring(0, MAX_LENGTH);

  return generator.convertText(safeText, {
    fontSize: 48,
    fontWeight: "bold",
  });
}
```

### 6. Sanitize Font Parameters

**Use whitelisted fonts only:**

```typescript
// RECOMMENDED
const ALLOWED_FONTS = ["Arial", "Helvetica", "Times New Roman", "Courier New"];

function getSafeFont(userFont: string): string {
  return ALLOWED_FONTS.includes(userFont) ? userFont : "Arial";
}

const result = generator.convertText("Hello", {
  font: getSafeFont(userInput),
});
```

### 7. Rate Limiting

**Implement rate limiting for user-triggered conversions:**

```typescript
// RECOMMENDED - Debounce user input
import { debounce } from "lodash";

const debouncedConvert = debounce((img) => {
  const result = generator.convertImage(img);
  updateDisplay(result.html);
}, 300); // 300ms delay

inputElement.addEventListener("change", (e) => {
  debouncedConvert(e.target.files[0]);
});
```

## Threat Model

### What ts-ascii-engine Protects Against

- **XSS via charset injection** - Custom charsets are sanitized
- **DoS via memory exhaustion** - Dimension limits enforced
- **HTML injection** - All output is escaped
- **Out-of-bounds array access** - Bounds checking implemented
- **CORS errors** - Clear error messages

### What ts-ascii-engine Cannot Protect Against

- **Server-side attacks** - This is a client-side library
- **Network attacks** - Image loading security is your responsibility
- **Social engineering** - User education required
- **Application-level logic flaws** - Your code's responsibility

## Vulnerability Reporting

If you discover a security vulnerability, please:

1. **Do not** open a public issue
2. Email details to: [your-security-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Checklist

When integrating ts-ascii-engine:

- [ ] Never pass unsanitized user input as charset
- [ ] Set application-specific dimension limits
- [ ] Implement CSP headers if displaying HTML
- [ ] Use `crossOrigin="anonymous"` for external images
- [ ] Validate and limit text input length
- [ ] Whitelist allowed font families
- [ ] Implement rate limiting for conversions
- [ ] Consider using text output instead of HTML for strictest security
- [ ] Test with malicious inputs during development
- [ ] Keep the library updated

## Example: Secure Implementation

```typescript
import { AsciiGenerator, CharsetPreset } from "ts-ascii-engine";

class SecureAsciiConverter {
  private generator: AsciiGenerator;
  private readonly MAX_WIDTH = 200;
  private readonly MAX_TEXT_LENGTH = 500;
  private readonly ALLOWED_FONTS = ["Arial", "Courier New", "Georgia"];

  constructor() {
    this.generator = new AsciiGenerator({
      charset: CharsetPreset.STANDARD, // Use preset, not user input
      width: this.MAX_WIDTH,
      colored: true,
    });
  }

  async convertImageSafely(imageUrl: string): Promise<string> {
    // Validate URL
    if (!this.isValidImageUrl(imageUrl)) {
      throw new Error("Invalid image URL");
    }

    // Load with CORS
    const img = await this.loadImageWithCORS(imageUrl);

    // Convert
    const result = this.generator.convertImage(img);

    // Return escaped HTML
    return result.html;
  }

  convertTextSafely(text: string, font: string = "Arial"): string {
    // Sanitize inputs
    const safeText = text.substring(0, this.MAX_TEXT_LENGTH);
    const safeFont = this.ALLOWED_FONTS.includes(font) ? font : "Arial";

    // Convert
    const result = this.generator.convertText(safeText, {
      font: safeFont,
      fontSize: 48,
      fontWeight: "bold",
    });

    return result.html;
  }

  private async loadImageWithCORS(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
  }

  private isValidImageUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  }
}

// Usage
const converter = new SecureAsciiConverter();

// Safe image conversion
try {
  const html = await converter.convertImageSafely(userProvidedUrl);
  document.getElementById("output").innerHTML = html;
} catch (error) {
  console.error("Conversion failed:", error);
}

// Safe text conversion
const html = converter.convertTextSafely(userProvidedText, "Arial");
document.getElementById("output").innerHTML = html;
```

## Updates & Patches

Security fixes are released as patch versions. Always use the latest version:

```bash
npm update ts-ascii-engine
```

Check for updates regularly or use automated dependency management tools like Dependabot or Renovate.

## Additional Resources

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Last Updated**: 2026-01-16
**Version**: 1.0.0
