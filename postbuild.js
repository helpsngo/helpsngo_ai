import fs from 'fs';
import path from 'path';

// Sync output from dist to .next so platforms expecting Next.js directory structure find the build
const distDir = path.resolve('dist');
const nextDir = path.resolve('.next');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyDirRecursive(distDir, nextDir);
  // Also create a standalone HTML pointer inside .next if needed
  if (fs.existsSync(path.join(distDir, 'index.html'))) {
    fs.copyFileSync(path.join(distDir, 'index.html'), path.join(nextDir, 'index.html'));
  }
} catch (err) {
  console.error('Error copying build output to .next directory:', err);
}
