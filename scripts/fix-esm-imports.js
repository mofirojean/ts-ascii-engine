/**
 * Post-build script to add .js extensions to ESM imports
 * TypeScript doesn't add extensions by default, but browsers need them
 */

const fs = require('fs');
const path = require('path');

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
          // Don't add .js if it already has an extension
          if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
            return match;
          }
          return `from '${importPath}.js'`;
        }
      );

      // Fix exports too: export ... from './path'
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
      console.log(`Fixed imports in: ${fullPath}`);
    }
  }
}

const distEsmDir = path.join(__dirname, '..', 'dist-esm');

if (fs.existsSync(distEsmDir)) {
  console.log('Adding .js extensions to ESM imports...\n');
  addJsExtensions(distEsmDir);
  console.log('\n✓ ESM imports fixed successfully!');
} else {
  console.error('dist-esm directory not found!');
  process.exit(1);
}
