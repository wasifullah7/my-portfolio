/**
 * Removes the studio backdrop AND the white sticker ring around the subject.
 *
 * A plain colour threshold cannot do this: the ring is white, and so are the
 * highlights in his eyes and teeth. So this flood-fills inward from the border
 * instead, which only ever removes pixels connected to the outside. Then the
 * mask is blurred to feather the edge, and the backdrop tint is pulled out of
 * the semi-transparent pixels so no green fringe survives.
 */
import sharp from "sharp";

const SRC = process.argv[2];
const OUT = process.argv[3];
const GREEN_TOL = 90; // distance from sampled backdrop that still counts as backdrop
const WHITE_MIN = 193; // the ring is a green-tinted white, not a neutral one
const WHITE_SPREAD = 62; // so it needs a looser neutrality test than pure grey

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const total = width * height;

const at = (i) => i * channels;
const corner = (x, y) => {
  const i = at(y * width + x);
  return [data[i], data[i + 1], data[i + 2]];
};
const corners = [
  corner(2, 2),
  corner(width - 3, 2),
  corner(2, height - 3),
  corner(width - 3, height - 3),
];
const bg = [0, 1, 2].map((c) =>
  Math.round(corners.reduce((s, p) => s + p[c], 0) / corners.length),
);

function isOutside(idx) {
  const i = at(idx);
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  const dr = r - bg[0];
  const dg = g - bg[1];
  const db = b - bg[2];
  if (Math.sqrt(dr * dr + dg * dg + db * db) <= GREEN_TOL) return true;
  // The sticker ring: bright and close to neutral.
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return min >= WHITE_MIN && max - min <= WHITE_SPREAD;
}

// Flood fill inward from every border pixel.
const outside = new Uint8Array(total);
const stack = [];
for (let x = 0; x < width; x++) {
  stack.push(x, (height - 1) * width + x);
}
for (let y = 0; y < height; y++) {
  stack.push(y * width, y * width + width - 1);
}

while (stack.length) {
  const idx = stack.pop();
  if (outside[idx]) continue;
  if (!isOutside(idx)) continue;
  outside[idx] = 1;

  const x = idx % width;
  const y = (idx - x) / width;
  if (x > 0) stack.push(idx - 1);
  if (x < width - 1) stack.push(idx + 1);
  if (y > 0) stack.push(idx - width);
  if (y < height - 1) stack.push(idx + width);
}

// Feather: blur the hard mask, then use it as alpha.
const hardMask = Buffer.alloc(total);
for (let i = 0; i < total; i++) hardMask[i] = outside[i] ? 0 : 255;

// sharp promotes a 1-channel raw buffer to 3 channels when blurring, so read
// the stride back off the result rather than assuming it stayed single-channel.
const blurred = await sharp(hardMask, { raw: { width, height, channels: 1 } })
  .blur(1.1)
  .raw()
  .toBuffer({ resolveWithObject: true });
const soft = blurred.data;
const softStride = blurred.info.channels;

let semi = 0;
for (let i = 0; i < total; i++) {
  const alpha = soft[i * softStride];
  const o = at(i);
  data[o + 3] = alpha;

  if (alpha > 0 && alpha < 250) {
    semi++;
    // Despill the backdrop tint out of translucent edge pixels.
    const mix = 1 - alpha / 255;
    data[o] = Math.max(0, Math.min(255, Math.round(data[o] - (bg[0] - 120) * mix * 0.7)));
    data[o + 1] = Math.max(0, Math.min(255, Math.round(data[o + 1] - (bg[1] - 120) * mix * 0.7)));
    data[o + 2] = Math.max(0, Math.min(255, Math.round(data[o + 2] - (bg[2] - 120) * mix * 0.7)));
  }
}

await sharp(data, { raw: { width, height, channels } })
  .png({ compressionLevel: 9, palette: false })
  .toFile(OUT);

const removed = outside.reduce((s, v) => s + v, 0);
console.log(`backdrop sampled: rgb(${bg.join(", ")})`);
console.log(`removed:  ${((removed / total) * 100).toFixed(1)}%`);
console.log(`feathered edge pixels: ${semi}`);
console.log(`wrote ${OUT}`);
