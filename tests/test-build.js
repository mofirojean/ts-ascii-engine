/**
 * Simple test to verify the build works correctly
 * Run with: node test-build.js
 */

const { AsciiGenerator, CharsetPreset } = require('../dist/index.js');

console.log('Testing ts-ascii-engine build...\n');

// Test 1: Generator instantiation
console.log('Test 1: Create AsciiGenerator instance');
try {
  const generator = new AsciiGenerator({
    charset: CharsetPreset.STANDARD,
    width: 50,
    colored: false
  });
  console.log('✓ Generator created successfully');
  console.log('  Config:', generator.getConfig());
} catch (error) {
  console.error('✗ Failed to create generator:', error.message);
  process.exit(1);
}

// Test 2: Configuration update
console.log('\nTest 2: Update configuration');
try {
  const generator = new AsciiGenerator();
  generator.updateConfig({
    charset: CharsetPreset.BLOCK,
    width: 80,
    colored: true
  });
  const config = generator.getConfig();
  console.log('✓ Configuration updated');
  console.log('  New width:', config.width);
  console.log('  Colored:', config.colored);
} catch (error) {
  console.error('✗ Failed to update config:', error.message);
  process.exit(1);
}

// Test 3: Charset presets
console.log('\nTest 3: Charset presets');
try {
  const presets = [
    CharsetPreset.BLOCK,
    CharsetPreset.STANDARD,
    CharsetPreset.MINIMAL,
    CharsetPreset.EXTENDED
  ];

  presets.forEach(preset => {
    const gen = new AsciiGenerator({ charset: preset });
    console.log(`  ✓ ${preset} charset loaded`);
  });
} catch (error) {
  console.error('✗ Failed to load charsets:', error.message);
  process.exit(1);
}

// Test 4: Custom charset
console.log('\nTest 4: Custom charset');
try {
  const generator = new AsciiGenerator({
    charset: '█▓▒░ '
  });
  console.log('✓ Custom charset accepted');
} catch (error) {
  console.error('✗ Failed to use custom charset:', error.message);
  process.exit(1);
}

// Test 5: Validation
console.log('\nTest 5: Configuration validation');
try {
  // Test negative aspect ratio (should throw)
  try {
    const generator = new AsciiGenerator({ aspectRatio: -1 });
    console.error('✗ Should have thrown error for negative aspect ratio');
    process.exit(1);
  } catch (e) {
    console.log('✓ Correctly rejected negative aspect ratio');
  }

  // Test empty charset (should throw)
  try {
    const generator = new AsciiGenerator({ charset: '' });
    console.error('✗ Should have thrown error for empty charset');
    process.exit(1);
  } catch (e) {
    console.log('✓ Correctly rejected empty charset');
  }
} catch (error) {
  console.error('✗ Validation test failed:', error.message);
  process.exit(1);
}

// Test 6: Type exports
console.log('\nTest 6: Type exports');
try {
  const { CHARSET_MAP } = require('../dist/index.js');
  console.log('✓ CHARSET_MAP exported');
  console.log('  Available presets:', Object.keys(CHARSET_MAP));
} catch (error) {
  console.error('✗ Failed to import CHARSET_MAP:', error.message);
  process.exit(1);
}

// Test 7: Utility function exports
console.log('\nTest 7: Utility function exports');
try {
  const {
    calculateLuminance,
    luminanceToChar,
    calculateDimensions
  } = require('../dist/index.js');

  // Test luminance calculation
  const lum = calculateLuminance(100, 150, 200);
  console.log('✓ calculateLuminance:', lum);

  // Test luminance to char
  const char = luminanceToChar(128, '@%#*+=-:. ', false);
  console.log('✓ luminanceToChar:', char);

  // Test dimension calculation
  const dims = calculateDimensions(640, 480, 80);
  console.log('✓ calculateDimensions:', dims);
} catch (error) {
  console.error('✗ Failed to use utility functions:', error.message);
  process.exit(1);
}

console.log('\n' + '='.repeat(50));
console.log('All tests passed! ✓');
console.log('='.repeat(50));
console.log('\nThe build is working correctly.');
console.log('\nNote: Image/video conversion requires a browser environment');
console.log('or Node.js with a canvas library like "canvas" or "node-canvas".');
