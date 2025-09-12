// Ensures files under dist/cjs are treated as CommonJS even when the root
// package has "type": "module".
const { writeFileSync, mkdirSync } = require('fs');
const { resolve } = require('path');

const targetDir = resolve(__dirname, '..', 'dist', 'cjs');
mkdirSync(targetDir, { recursive: true });
const pkgPath = resolve(targetDir, 'package.json');
writeFileSync(pkgPath, JSON.stringify({ type: 'commonjs' }, null, 2));
console.log('Wrote dist/cjs/package.json { "type": "commonjs" }');

