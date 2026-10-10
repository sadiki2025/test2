import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { transform } from 'esbuild';
import { minify } from 'html-minifier-terser';

const outputDirectory = 'dist';
mkdirSync(outputDirectory, { recursive: true });

const [javascript, stylesheet, html] = await Promise.all([
  transform(readFileSync('script.js', 'utf8'), { loader: 'js', minify: true }),
  transform(readFileSync('style.css', 'utf8'), { loader: 'css', minify: true }),
  minify(readFileSync('index.html', 'utf8'), {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true
  })
]);

writeFileSync(join(outputDirectory, 'script.js'), javascript.code);
writeFileSync(join(outputDirectory, 'style.css'), stylesheet.code);
writeFileSync(join(outputDirectory, 'index.html'), html);
cpSync('images', join(outputDirectory, 'images'), { recursive: true });

console.log('Production files created in dist/. Publish only this folder.');
