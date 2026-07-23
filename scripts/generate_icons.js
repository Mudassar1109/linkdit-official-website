import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Create SVG representation matching LinkDit Pad official branding
const createLinkDitPadSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  <defs>
    <!-- Background Gradient for 3D Pad -->
    <linearGradient id="padGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e3a5f" />
      <stop offset="50%" stop-color="#0f233f" />
      <stop offset="100%" stop-color="#081426" />
    </linearGradient>

    <!-- Metallic Ring Gradient -->
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8" />
      <stop offset="30%" stop-color="#f8fafc" />
      <stop offset="70%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#64748b" />
    </linearGradient>

    <!-- Blue Pencil Body Gradient -->
    <linearGradient id="pencilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="50%" stop-color="#1d4ed8" />
      <stop offset="100%" stop-color="#1e40af" />
    </linearGradient>

    <!-- Pencil Ferrule (Metal Ring) -->
    <linearGradient id="ferruleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#cbd5e1" />
      <stop offset="50%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>

    <!-- Soft Drop Shadow -->
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="#000000" flood-opacity="0.45" />
    </filter>

    <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#1d4ed8" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Outer Shadow Container -->
  <g filter="url(#dropShadow)">

    <!-- Main Notebook Body (Rounded Rectangle Pad) -->
    <rect x="120" y="110" width="680" height="810" rx="90" ry="90" fill="url(#padGrad)" stroke="#2563eb" stroke-width="4" stroke-opacity="0.4" />

    <!-- Inner Bevel Border -->
    <rect x="135" y="125" width="650" height="780" rx="75" ry="75" fill="none" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.25" />

    <!-- 3 Top Ring Binders -->
    <!-- Left Ring -->
    <rect x="260" y="50" width="44" height="120" rx="22" fill="url(#ringGrad)" stroke="#0f172a" stroke-width="4" />
    <ellipse cx="282" cy="150" rx="14" ry="7" fill="#081426" />

    <!-- Center Ring -->
    <rect x="490" y="50" width="44" height="120" rx="22" fill="url(#ringGrad)" stroke="#0f172a" stroke-width="4" />
    <ellipse cx="512" cy="150" rx="14" ry="7" fill="#081426" />

    <!-- Right Ring -->
    <rect x="720" y="50" width="44" height="120" rx="22" fill="url(#ringGrad)" stroke="#0f172a" stroke-width="4" />
    <ellipse cx="742" cy="150" rx="14" ry="7" fill="#081426" />

    <!-- Bottom-Right Page Curl revealing lined paper underneath -->
    <g id="pageCurl">
      <path d="M 640 920 L 710 770 Q 770 770 800 830 Z" fill="#f8fafc" />
      <path d="M 640 920 Q 710 880 770 770 L 800 920 Z" fill="#020617" opacity="0.3" />
      <path d="M 640 920 Q 710 840 800 830 L 800 920 Z" fill="#1d4ed8" opacity="0.85" />
      <path d="M 640 920 Q 720 860 800 830" fill="none" stroke="#60a5fa" stroke-width="3" />
    </g>

    <!-- Main LP Monogram Logo -->
    <g filter="url(#logoGlow)" transform="translate(240, 240)">
      <!-- 'L' Shape (White Solid Wrap) -->
      <path d="M 40 30 L 130 30 L 130 320 L 310 320 L 310 400 L 40 400 Z" fill="#ffffff" />

      <!-- 'P' Shape (Blue with inner counter/bubble) -->
      <path d="M 170 80 L 320 80 C 390 80 430 115 430 180 C 430 245 390 280 320 280 L 250 280 L 250 320 L 170 320 Z" fill="#2563eb" />
      
      <!-- Inner 'P' Speech Bubble Notch -->
      <path d="M 250 140 L 310 140 C 340 140 360 155 360 180 C 360 205 340 220 310 220 L 250 220 Z" fill="#ffffff" />
      <polygon points="250,200 220,230 250,220" fill="#ffffff" />
    </g>

    <!-- Brand Text: LinkDit Pad -->
    <g transform="translate(190, 710)">
      <!-- Link -->
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="78" fill="#ffffff" letter-spacing="-1">Link</text>
      <!-- Dit -->
      <text x="165" y="0" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="78" fill="#3b82f6" letter-spacing="-1">Dit</text>
      <!-- Pad -->
      <text x="280" y="0" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="78" fill="#ffffff" letter-spacing="-1">Pad</text>

      <!-- Tagline: WRITE. LINK. THINK. -->
      <text x="5" y="45" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="28" fill="#94a3b8" letter-spacing="6">WRITE. LINK. THINK.</text>
    </g>

    <!-- Stylized Blue Pencil resting at an angle on the right -->
    <g transform="translate(680, 160) rotate(22, 100, 300)">
      <!-- Pencil Body -->
      <rect x="70" y="0" width="55" height="520" rx="10" fill="url(#pencilGrad)" />

      <!-- Pencil Top Cap (Eraser) -->
      <rect x="70" y="-40" width="55" height="40" rx="8" fill="#f43f5e" />

      <!-- Metal Ferrule -->
      <rect x="68" y="0" width="59" height="30" fill="url(#ferruleGrad)" />

      <!-- Sharpened Wooden Tip -->
      <polygon points="70,520 125,520 97.5,600" fill="#fde047" />

      <!-- Graphite Point -->
      <polygon points="90,576 105,576 97.5,600" fill="#1e293b" />
    </g>

  </g>
</svg>
`;

async function generateAllIcons() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('Generating official LinkDit Pad icons...');

  // 1. app-icon-1024.png (1024x1024) - Master source
  const svg1024 = Buffer.from(createLinkDitPadSvg(1024));
  await sharp(svg1024)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(publicDir, 'app-icon-1024.png'));
  console.log('Created app-icon-1024.png');

  // 2. icon-256.png (256x256) - Main application icon & manifest
  await sharp(svg1024)
    .resize(256, 256)
    .png()
    .toFile(path.join(publicDir, 'icon-256.png'));
  console.log('Created icon-256.png');

  // 3. icon-128.png (128x128) - PWA shortcut icon
  await sharp(svg1024)
    .resize(128, 128)
    .png()
    .toFile(path.join(publicDir, 'icon-128.png'));
  console.log('Created icon-128.png');

  // 4. favicon-32x32.png (32x32) - Browser tab icon
  await sharp(svg1024)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Created favicon-32x32.png');

  // 5. favicon.ico - Main website favicon (ICO format)
  // Sharp can generate crisp ICO / PNG favicon
  await sharp(svg1024)
    .resize(32, 32)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Created favicon.ico');

  // Also create apple-touch-icon.png (180x180) for iOS support
  await sharp(svg1024)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Copy build assets to dist if dist exists
  const distDir = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    const filesToCopy = [
      'app-icon-1024.png',
      'icon-256.png',
      'icon-128.png',
      'favicon-32x32.png',
      'favicon.ico',
      'apple-touch-icon.png'
    ];
    for (const file of filesToCopy) {
      fs.copyFileSync(path.join(publicDir, file), path.join(distDir, file));
    }
    console.log('Copied all icons to dist folder.');
  }

  console.log('All icons generated successfully!');
}

generateAllIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
