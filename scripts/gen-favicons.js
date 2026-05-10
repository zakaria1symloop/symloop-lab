// Generates PNG + ICO favicons from public/favicon.svg using sharp.
// Run once after editing favicon.svg: `node scripts/gen-favicons.js`
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'public');
const SVG = fs.readFileSync(path.join(ROOT, 'favicon.svg'));

// Larger SVG for apple-touch-icon — same shape, scaled up so the PNG is crisp.
const SVG_BIG = SVG.toString().replace('viewBox="0 0 32 32"', 'viewBox="0 0 32 32" width="180" height="180"');

const targets = [
  { size: 16,  out: 'favicon-16x16.png' },
  { size: 32,  out: 'favicon-32x32.png' },
  { size: 48,  out: 'favicon-48x48.png' },
  { size: 180, out: 'apple-touch-icon.png',     svg: SVG_BIG },
  { size: 192, out: 'icon-192.png',             svg: SVG_BIG },
  { size: 512, out: 'icon-512.png',             svg: SVG_BIG },
];

(async () => {
  for (const t of targets) {
    await sharp(Buffer.from(t.svg || SVG))
      .resize(t.size, t.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(ROOT, t.out));
    console.log(`✓ ${t.out} (${t.size}×${t.size})`);
  }

  // Build favicon.ico — multi-size embedded (16, 32, 48). Sharp does not write
  // ICO directly, so we hand-roll a minimal ICO container with three PNGs.
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map(s => sharp(Buffer.from(SVG)).resize(s, s).png().toBuffer())
  );

  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);          // reserved
  header.writeUInt16LE(1, 2);          // type 1 = icon
  header.writeUInt16LE(sizes.length, 4); // image count

  // Directory: 16 bytes per image
  const directory = Buffer.alloc(16 * sizes.length);
  let offset = 6 + directory.length;
  sizes.forEach((s, i) => {
    const pngLen = pngs[i].length;
    directory.writeUInt8(s === 256 ? 0 : s, i * 16 + 0);  // width
    directory.writeUInt8(s === 256 ? 0 : s, i * 16 + 1);  // height
    directory.writeUInt8(0, i * 16 + 2);                  // colors (0 = >256)
    directory.writeUInt8(0, i * 16 + 3);                  // reserved
    directory.writeUInt16LE(1, i * 16 + 4);               // color planes
    directory.writeUInt16LE(32, i * 16 + 6);              // bits per pixel
    directory.writeUInt32LE(pngLen, i * 16 + 8);          // image size
    directory.writeUInt32LE(offset, i * 16 + 12);         // image offset
    offset += pngLen;
  });

  const ico = Buffer.concat([header, directory, ...pngs]);
  fs.writeFileSync(path.join(ROOT, 'favicon.ico'), ico);
  console.log(`✓ favicon.ico (${sizes.join(', ')})`);
})();
