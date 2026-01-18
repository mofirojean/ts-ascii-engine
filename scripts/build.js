/**
 * Complete build script for ts-ascii-engine
 * Handles both CommonJS and ESM builds with proper file extensions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function log(message) {
  console.log(`\n📦 ${message}`);
}

function addJsExtensions(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      addJsExtensions(fullPath);
    } else if (file.name.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Fix relative imports: './path' -> './path.js'
      content = content.replace(
        /from\s+['"](\.[^'"]+)['"]/g,
        (match, importPath) => {
          if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
            return match;
          }
          return `from '${importPath}.js'`;
        }
      );

      // Fix exports: export ... from './path'
      content = content.replace(
        /export\s+.*\s+from\s+['"](\.[^'"]+)['"]/g,
        (match, importPath) => {
          if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
            return match;
          }
          return match.replace(importPath, `${importPath}.js`);
        }
      );

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDirectory(src, dest, filter) {
  const files = fs.readdirSync(src, { withFileTypes: true });

  for (const file of files) {
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);

    if (file.isDirectory()) {
      copyDirectory(srcPath, destPath, filter);
    } else if (!filter || filter(file.name)) {
      copyFile(srcPath, destPath);
    }
  }
}

// Clean previous builds
log('Cleaning previous builds...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
if (fs.existsSync('dist-esm')) {
  fs.rmSync('dist-esm', { recursive: true });
}

// Build CommonJS
log('Building CommonJS...');
execSync('tsc', { stdio: 'inherit' });

// Build ESM
log('Building ES Modules...');
execSync('tsc -p tsconfig.esm.json', { stdio: 'inherit' });

// Fix ESM imports
log('Fixing ESM imports (adding .js extensions)...');
addJsExtensions('dist-esm');

// Copy the main ESM entry point
// copyFile('dist-esm/index.js', 'dist/index.esm.js'); // REMOVED: Keep dist-esm separate

log('✓ Build completed successfully!');
console.log('\nOutput:');
console.log('  - dist/index.js       (CommonJS)');
console.log('  - dist/index.esm.js   (ES Module)');
console.log('  - dist/index.d.ts     (TypeScript definitions)');
console.log('  - dist/core/          (Shared compiled modules)');
console.log('  - dist/types/         (Shared compiled modules)');
console.log('  - dist/utils/         (Shared compiled modules)\n');
