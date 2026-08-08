import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, 'dist');
const assetsDir = path.resolve(__dirname, 'assets');
const distAssetsDir = path.resolve(distDir, 'assets');

const routeMap = {
  'login.html': ['login'],
  'signup.html': ['signup'],
  'auth.html': ['auth'],
  'dashboard.html': ['dashboard'],
  'new-project.html': ['new', 'new-project'],
  'project-detail.html': ['project', 'project-detail'],
  'booking.html': ['booking'],
  'pricing.html': ['pricing'],
  'domains.html': ['domains'],
  'marketplace.html': ['marketplace'],
  'ai-cloud.html': ['ai-cloud']
};

console.log('[CLEAN BUILD]: Reorganizing dist/ into clean URL directory structures...');

if (fs.existsSync(assetsDir)) {
  if (!fs.existsSync(distAssetsDir)) {
    fs.mkdirSync(distAssetsDir, { recursive: true });
  }
  const files = fs.readdirSync(assetsDir);
  for (const file of files) {
    fs.copyFileSync(path.join(assetsDir, file), path.join(distAssetsDir, file));
    console.log(`  ✓ Copied asset: assets/${file} -> dist/assets/${file}`);
  }
}

for (const [sourceFile, targetDirs] of Object.entries(routeMap)) {
  const sourcePath = path.join(distDir, sourceFile);
  if (fs.existsSync(sourcePath)) {
    const htmlContent = fs.readFileSync(sourcePath, 'utf8');

    for (const dir of targetDirs) {
      const targetDirPath = path.join(distDir, dir);
      if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath, { recursive: true });
      }
      fs.writeFileSync(path.join(targetDirPath, 'index.html'), htmlContent, 'utf8');
      console.log(`  ✓ Created clean URL entry: /${dir} -> dist/${dir}/index.html`);
    }
  }
}

console.log('[CLEAN BUILD]: Clean URL directory structures created successfully!');
