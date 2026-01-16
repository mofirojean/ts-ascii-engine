# Documentation Website

Beautiful, interactive documentation for `ts-ascii-engine`.

## 🚀 Quick Start

### Running Locally

The documentation website requires a web server to function properly (for ES module imports).

**Option 1: Python (Recommended)**
```bash
# From the project root
python -m http.server 8000

# Then open: http://localhost:8000/docs/
```

**Option 2: Node.js**
```bash
npx http-server -p 8000

# Then open: http://localhost:8000/docs/
```

**Option 3: VS Code Live Server**
1. Install "Live Server" extension
2. Right-click `docs/index.html`
3. Select "Open with Live Server"

## 📁 Structure

```
docs/
├── index.html          # Homepage with quick start and live demo
├── api.html            # Complete API reference
├── examples.html       # Interactive examples and demos
├── security.html       # Security best practices
├── css/
│   └── style.css       # Shared stylesheet
├── js/
│   ├── app.js          # Homepage interactive demo
│   └── examples.js     # Examples page demos
└── assets/             # Images and other assets
```

## 🎨 Pages

### 1. **index.html** - Homepage
- Hero section with key features
- Quick start guide
- Interactive live demo with sample images
- Feature highlights
- Use cases
- Framework integration examples
- Performance benchmarks

**Live Demo Features:**
- Upload images or use built-in samples
- Adjust width, charset, colors, inversion
- Real-time processing metrics
- Multiple character set options

### 2. **api.html** - API Reference
- Complete type definitions
- Method signatures and examples
- Configuration options
- Framework integration guides (React, Vue, Angular)
- Best practices
- Searchable sidebar navigation

**Covers:**
- `AsciiGenerator` class
- `AsciiConfig` interface
- `AsciiOutput` interface
- `CharsetPreset` enum
- `TextToAsciiOptions` interface
- All public methods
- Usage examples

### 3. **examples.html** - Interactive Examples
- **Image Converter**: Upload and convert images
- **Video Stream**: Real-time webcam ASCII conversion
- **Text Banner**: Convert text to ASCII art
- **Colored ASCII**: Preserve original colors
- **Character Sets**: Compare different charsets
- **Game Graphics**: Animated sprite example
- **Animation**: Smooth animated effects
- **Performance**: Optimization guide

All examples include:
- Live interactive demos
- Expandable source code
- Configuration controls
- Real-time metrics

### 4. **security.html** - Security Guide
- Built-in security protections
- XSS prevention measures
- DoS protection
- CORS handling
- Best practices with code examples
- Complete secure implementation example
- Security checklist
- Vulnerability reporting

## 🎯 Features

### Design System
- **Modern UI**: Clean, professional design
- **Responsive**: Works on all devices
- **Dark code blocks**: Syntax-highlighted examples
- **Smooth animations**: Fade-in effects, hover states
- **Interactive demos**: Live playground on every page
- **Searchable navigation**: Sidebar with auto-highlighting

### CSS Framework
Custom CSS framework with:
- CSS custom properties (variables)
- Component library (cards, buttons, alerts, tables)
- Utility classes
- Grid system
- Responsive breakpoints
- Print styles

### Interactive Features
- **Live demos**: Test the library directly in browser
- **Sample generators**: Built-in test images
- **Real-time conversion**: Instant visual feedback
- **Performance metrics**: Processing time, FPS, dimensions
- **Code examples**: Expandable source code sections
- **Smooth scrolling**: Enhanced navigation

## 🔧 Customization

### Changing Colors

Edit `css/style.css` CSS variables:

```css
:root {
  --primary: #667eea;      /* Primary brand color */
  --secondary: #764ba2;    /* Secondary color */
  --accent: #f093fb;       /* Accent color */
  /* ... more variables ... */
}
```

### Adding Pages

1. Create new HTML file in `docs/`
2. Copy header/footer from existing page
3. Link in navigation
4. Update sidebar if needed

### Modifying Demos

Edit `docs/js/app.js` or `docs/js/examples.js`:
- Add new sample generators
- Modify existing demos
- Add new interactive features

## 🚧 Development

### Prerequisites
- Web server (Python, Node.js, or VS Code Live Server)
- Modern browser with ES6 module support

### Making Changes

1. **Edit HTML/CSS/JS** files directly
2. **Refresh browser** to see changes (no build step!)
3. **Test all demos** work correctly
4. **Check responsive design** on mobile

### Testing

**Check these before committing:**
- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] All demos function properly
- [ ] Mobile responsive design works
- [ ] All links are valid
- [ ] Code examples are correct
- [ ] Images load properly

## 📱 Browser Support

- **Chrome/Edge**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Mobile browsers**: ✅ Responsive design

**Requirements:**
- ES6 module support
- Canvas API
- MediaDevices API (for webcam demo)

## 🎓 Usage Tips

### For End Users

1. **Start with Homepage**: Get overview and try live demo
2. **Check Examples**: See what's possible
3. **Read API Docs**: Learn detailed usage
4. **Review Security**: Understand best practices

### For Integrators

1. **API Reference**: Complete technical documentation
2. **Examples**: Copy-paste ready code
3. **Security Guide**: Production checklist
4. **Framework Guides**: React, Vue, Angular integration

## 🐛 Troubleshooting

### Demos Not Working

**Issue**: "Failed to resolve module specifier"
**Solution**: Must run from web server, not `file://` protocol

```bash
# Use a web server
python -m http.server 8000
```

**Issue**: Webcam demo not working
**Solution**:
- Grant camera permissions
- Use HTTPS (required for getUserMedia)
- Check browser console for errors

**Issue**: Images not converting
**Solution**:
- Check file is valid image format
- Check browser console for errors
- Try different image

### Style Issues

**Issue**: CSS not loading
**Solution**: Check file paths are correct relative to HTML files

**Issue**: Layout broken on mobile
**Solution**: Test with browser dev tools mobile emulation

## 📚 Additional Resources

- **Main README**: `../README.md`
- **API Documentation**: `../API_DOCUMENTATION.md`
- **Security Guide**: `../SECURITY.md`
- **Architecture**: `../ARCHITECTURE.md`
- **Examples**: `../examples/`

## 🤝 Contributing

To improve documentation:

1. Edit HTML/CSS/JS files
2. Test thoroughly
3. Ensure responsive design
4. Check all examples work
5. Submit pull request

## 📄 License

MIT License - same as ts-ascii-engine

---

**Built with ❤️ using ts-ascii-engine**
