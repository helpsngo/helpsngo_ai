import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function writePng(width, height, getPixelRgba, filePath) {
  // 1. Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // 2. IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdrChunk = Buffer.alloc(4 + 4 + 13 + 4);
  ihdrChunk.writeUInt32BE(13, 0);
  ihdrChunk.write('IHDR', 4);
  ihdrData.copy(ihdrChunk, 8);
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  ihdrChunk.writeUInt32BE(ihdrCrc, 21);

  // 3. Raw image scanlines
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // 4. Compress with zlib
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = Buffer.alloc(4 + 4 + compressed.length + 4);
  idatChunk.writeUInt32BE(compressed.length, 0);
  idatChunk.write('IDAT', 4);
  compressed.copy(idatChunk, 8);
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  idatChunk.writeUInt32BE(idatCrc, 8 + compressed.length);

  // 5. IEND
  const iendChunk = Buffer.alloc(12);
  iendChunk.writeUInt32BE(0, 0);
  iendChunk.write('IEND', 4);
  const iendCrc = crc32(Buffer.from('IEND'));
  iendChunk.writeUInt32BE(iendCrc, 8);

  const pngBuffer = Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, pngBuffer);
}

// Draw HELPS NGO brand icon (warm orange rounded icon with white emblem)
function helpsIconDrawer(isMaskable) {
  return (x, y, w, h) => {
    const nx = (x / w) * 2 - 1;
    const ny = (y / h) * 2 - 1;
    const distSq = nx * nx + ny * ny;

    // Background: Warm orange gradient #ea580c to #c2410c
    const t = (ny + 1) / 2;
    const bgR = Math.round(234 * (1 - t * 0.15));
    const bgG = Math.round(88 * (1 - t * 0.15));
    const bgB = Math.round(12 * (1 - t * 0.15));

    if (!isMaskable) {
      // Rounded corner box (squircle)
      const cornerR = 0.28;
      const qx = Math.max(0, Math.abs(nx) - (1 - cornerR));
      const qy = Math.max(0, Math.abs(ny) - (1 - cornerR));
      const cornerDist = Math.sqrt(qx * qx + qy * qy);
      if (cornerDist > cornerR) {
        return [0, 0, 0, 0]; // Transparent outside squircle
      }
    }

    // Emblem in center (scale depends on maskable padding)
    const scale = isMaskable ? 0.6 : 0.75;
    const ex = nx / scale;
    const ey = (ny + 0.05) / scale; // slight vertical centering

    // Heart + caring hands + sprout emblem
    // Heart shape: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
    const hx = ex * 1.3;
    const hy = -ey * 1.3 + 0.2;
    const a = hx * hx + hy * hy - 0.45;
    const isHeart = a * a * a - hx * hx * hy * hy * hy <= 0.01;

    // Central cross/plus or caring circle
    const cDist = Math.sqrt(ex * ex + (ey - 0.1) * (ey - 0.1));
    const isCircle = cDist < 0.22;

    // Uplifting arc/hands at bottom
    const isArc = ey > 0.35 && ey < 0.58 && Math.abs(ex) < 0.65 && Math.abs(ey - 0.45 - (ex * ex * 0.4)) < 0.1;

    if (isHeart || isCircle || isArc) {
      return [255, 255, 255, 255]; // Crisp white emblem
    }

    return [bgR, bgG, bgB, 255];
  };
}

const publicDir = path.resolve('public');

writePng(192, 192, helpsIconDrawer(false), path.join(publicDir, 'pwa-192x192.png'));
writePng(512, 512, helpsIconDrawer(false), path.join(publicDir, 'pwa-512x512.png'));
writePng(512, 512, helpsIconDrawer(true), path.join(publicDir, 'pwa-maskable-512x512.png'));
writePng(180, 180, helpsIconDrawer(false), path.join(publicDir, 'apple-touch-icon.png'));
writePng(64, 64, helpsIconDrawer(false), path.join(publicDir, 'favicon.png'));

console.log('Successfully generated Play Store & PWA icons!');
