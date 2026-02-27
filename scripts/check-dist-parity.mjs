import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { build } from 'esbuild';

const result = await build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/index.js',
  bundle: true,
  format: 'esm',
  target: 'es2020',
  sourcemap: true,
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react-svg-pan-zoom'],
  write: false,
});

const outputByPath = new Map(result.outputFiles.map((file) => [file.path, file.text]));
const builtJs = outputByPath.get(path.resolve('dist/index.js')) || '';
const builtMap = outputByPath.get(path.resolve('dist/index.js.map')) || '';
const [distJs, distMap] = await Promise.all([
  readFile('dist/index.js', 'utf8'),
  readFile('dist/index.js.map', 'utf8'),
]);

if (builtJs !== distJs || builtMap !== distMap) {
  console.error('dist artifacts are stale. Run `npm run build` and commit dist updates.');
  process.exit(1);
}

console.log('dist artifacts are in sync with source.');
