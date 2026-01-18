const { AsciiGenerator } = require('../dist/index.js');

console.log('🔒 Testing Security Limits...\n');

let testsPassed = 0;
let testsFailed = 0;

function assertThrow(fn, expectedErrorSubstring, testName) {
  try {
    fn();
    console.error(`❌ ${testName} FAILED: Did not throw expected error`);
    testsFailed++;
  } catch (e) {
    if (e.message.includes(expectedErrorSubstring)) {
      console.log(`✅ ${testName} PASSED: Caught expected error: "${e.message}"`);
      testsPassed++;
    } else {
      console.error(`❌ ${testName} FAILED: Wrong error message. Got: "${e.message}", Expected: "${expectedErrorSubstring}"`);
      testsFailed++;
    }
  }
}

function assertNoThrow(fn, testName) {
  try {
    fn();
    console.log(`✅ ${testName} PASSED: Execution successful`);
    testsPassed++;
  } catch (e) {
    console.error(`❌ ${testName} FAILED: Threw unexpected error: "${e.message}"`);
    testsFailed++;
  }
}

// 1. Test Standard Limit (Constructor)
assertThrow(
  () => {
    new AsciiGenerator({ width: 5000, height: 6000 }); // 30M > 25M
  },
  'exceeds maximum allowed',
  'Constructor: Huge Standard Dimensions'
);

// 2. Test Colored Limit (Constructor)
assertThrow(
  () => {
    new AsciiGenerator({ width: 2000, height: 2000, colored: true }); // 4M > 1M
  },
  'exceeds maximum allowed for colored output',
  'Constructor: Huge Colored Dimensions'
);

// 3. Test Safe Colored Usage
assertNoThrow(
  () => {
    new AsciiGenerator({ width: 1000, height: 1000, colored: true }); // 1M == 1M
  },
  'Constructor: Safe Colored Dimensions'
);

// 4. Test UpdateConfig Limit
assertThrow(
  () => {
    const gen = new AsciiGenerator({ width: 100, colored: false });
    gen.updateConfig({ width: 2000, height: 2000, colored: true });
  },
  'exceeds maximum allowed for colored output',
  'updateConfig: Huge Colored Dimensions'
);

console.log(`\nResults: ${testsPassed} passed, ${testsFailed} failed.`);

if (testsFailed > 0) {
  process.exit(1);
}
