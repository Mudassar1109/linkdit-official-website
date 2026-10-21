import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

const MASTER = path.join(publicDir, 'app-icon-1024.png');

// A square, transparent canvas built from the master: the source art is
// trimmed of empty margins and re-centered, so derived sizes never stretch or
// clip the logo regardless of the master's original aspect ratio.
async function buildSquareMaster() {
  const trimmed = await sharp(MASTER).trim({ threshold: 1 }).png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  const side = Math.max(meta.width, meta.height);
  const pad = Math.round(side * 0.06);
  const square = await sharp({
    create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: trimmed, gravity: 'center' }])
    .png()
    .toBuffer();
  return sharp({
    create: { width: side + pad * 2, height: side + pad * 2, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: square, gravity: 'center' }])
    .png()
    .toBuffer();
}

const PNG_TARGETS = [
  { name: 'app-icon-1024.png', size: 1024 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-256.png', size: 256 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-128.png', size: 128 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 },
];

const ICO_SIZES = [16, 32, 48];

async function resizePng(size) {
  const master = await buildSquareMaster();
  return sharp(master)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function buildIco(sizes) {
  const pngs = [];
  for (const size of sizes) {
    pngs.push(await resizePng(size));
  }

  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  pngs.forEach((png, i) => {
    const size = sizes[i];
    const e = i * 16;
    dir[e] = size === 256 ? 0 : size;
    dir[e + 1] = size === 256 ? 0 : size;
    dir[e + 2] = 0;
    dir[e + 3] = 0;
    dir.writeUInt16LE(1, e + 4);
    dir.writeUInt16LE(32, e + 6);
    dir.writeUInt32LE(png.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });

  return Buffer.concat([header, dir, ...pngs]);
}

async function generateAllIcons() {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  if (!fs.existsSync(MASTER)) {
    throw new Error(`Official master icon not found: ${MASTER}`);
  }

  console.log('Generating Typodocs icons from official master...');

  for (const target of PNG_TARGETS) {
    await sharp(await buildSquareMaster())
      .resize(target.size, target.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(path.join(publicDir, target.name));
    console.log(`Created ${target.name}`);
  }

  const ico = await buildIco(ICO_SIZES);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
  console.log('Created favicon.ico');

  const distDir = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    const filesToCopy = [...PNG_TARGETS.map((t) => t.name), 'favicon.ico'];
    for (const file of filesToCopy) {
      fs.copyFileSync(path.join(publicDir, file), path.join(distDir, file));
    }
    console.log('Copied all icons to dist folder.');
  }

  console.log('All icons generated successfully!');
}

generateAllIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});