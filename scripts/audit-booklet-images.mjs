#!/usr/bin/env node
/**
 * Quality gate for USM booklet illustrations.
 * Checks the actual 40 published Markdown files, their authoring mirrors,
 * image references, captions and basic image metadata.
 *
 * Run: node scripts/audit-booklet-images.mjs
 * Fatal findings fail CI; editorial quality warnings are reported separately.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pubDir = path.join(root, 'public', 'apostilas', 'md');
const assetDir = path.join(root, 'public', 'apostilas', 'imagens');
const sourceDir = path.join(root, 'apostilas');
const isImage = (file) => /\.(?:png|jpe?g|svg|webp)$/i.test(file);
const errors = [];
const warnings = [];
const rows = [];
const used = new Map();
const captionReg = /^\*(?:Figura|Ilustração|Esquema|Fotografia|Quadro)/i;

function jpegSize(b) {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    if ([0xd8, 0xd9, 0x01].includes(marker) || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    if (i + 4 >= b.length) break;
    const len = b.readUInt16BE(i + 2);
    if (len < 2 || i + 2 + len > b.length) break;
    if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}
function rasterSize(filename) {
  const b = fs.readFileSync(filename);
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png' && b.length > 24 && b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  if (ext === '.jpg' || ext === '.jpeg') return jpegSize(b);
  if (ext === '.webp' && b.length > 30) {
    const fmt = b.toString('ascii',12,16);
    if (fmt === 'VP8X') return { width: 1 + b.readUIntLE(24,3), height: 1 + b.readUIntLE(27,3) };
  }
  return null;
}

const manifests = JSON.parse(fs.readFileSync(path.join(root,'public','apostilas','manifest.json'),'utf8'));
const codes = Object.keys(manifests).sort();
const sourceByCode = new Map();
for (const lot of fs.readdirSync(sourceDir).filter(x => /^lote-\d+$/.test(x))) {
  for (const file of fs.readdirSync(path.join(sourceDir,lot))) {
    const match = file.match(/^Apostila_([A-Z]\d{2})_.+\.md$/);
    if (!match) continue;
    if (sourceByCode.has(match[1])) errors.push('Duplicate authoring source: '+match[1]);
    sourceByCode.set(match[1],path.join(sourceDir,lot,file));
  }
}
if (codes.length !== 40) errors.push('Manifest expected 40 modules, found '+codes.length);
if (sourceByCode.size !== codes.length) errors.push('Published/source module count mismatch');

for (const code of codes) {
  const file = path.join(pubDir,code+'.md');
  if (!fs.existsSync(file)) { errors.push(code+': published Markdown missing'); continue; }
  const raw = fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
  const authoring = sourceByCode.get(code);
  if (!authoring || !fs.existsSync(authoring)) {
    errors.push(code+': authoring source missing');
  } else {
    const localSource = fs.readFileSync(authoring,'utf8').replace(/\r\n/g,'\n').replaceAll('../imagens/','./apostilas/imagens/');
    if (localSource !== raw) errors.push(code+': published and source versions diverged');
  }
  const lines = raw.split('\n');
  let firstPercent = null;
  const assets = [];
  for (let n = 0; n < lines.length; n++) {
    const match = lines[n].trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (!match) continue;
    const alt = match[1].trim();
    const src = match[2].trim();
    if (firstPercent == null) firstPercent = Math.round(100*n/Math.max(1,lines.length));
    if (alt.length < 12) warnings.push(code+': uninformative image alt at line '+(n+1));
    if (!lines[n+1]?.trim().match(captionReg)) errors.push(code+': missing attribution/caption after image at line '+(n+1));
    if (!src.startsWith('./apostilas/imagens/')) { errors.push(code+': external or unexpected image URL: '+src); continue; }
    const name = src.slice('./apostilas/imagens/'.length);
    if (name.includes('..') || name.includes('/') || !isImage(name)) { errors.push(code+': unsafe image path '+name); continue; }
    if (!fs.existsSync(path.join(assetDir,name))) { errors.push(code+': image asset missing '+name); continue; }
    assets.push(name);
    if (!used.has(name)) used.set(name,new Set());
    used.get(name).add(code);
  }
  const uniq = new Set(assets).size;
  if (uniq < 4) warnings.push(code+': only '+uniq+' distinct images for the full module');
  if (firstPercent != null && firstPercent > 40) warnings.push(code+': first image starts '+firstPercent+'% into the text');
  if (!assets.length) errors.push(code+': no instructional images');
  rows.push({code, images: assets.length, distinct:uniq, first_image: firstPercent==null?'none':firstPercent+'%'});
}

const fragile = [];
for (const name of used.keys()) {
  const filename = path.join(assetDir,name);
  if (name.endsWith('.svg')) {
    const svg = fs.readFileSync(filename,'utf8').trim();
    if (!svg.includes('<svg') || !svg.includes('</svg>')) errors.push(name+': invalid SVG wrapper');
    if (!svg.includes('<title') && !svg.includes('aria-label')) warnings.push(name+': SVG lacks accessible title');
  } else {
    const dims = rasterSize(filename);
    if (!dims) { warnings.push(name+': raster dimensions could not be read'); continue; }
    if (Math.min(dims.width,dims.height) < 600) {
      fragile.push({name, dimensions:dims.width+'x'+dims.height, used_by:[...used.get(name)].join(',')});
    }
  }
}
const publishedImages = fs.readdirSync(assetDir).filter(isImage);
const authoringImages = new Set(fs.readdirSync(path.join(sourceDir,'imagens')).filter(isImage));
for (const name of publishedImages) if (!authoringImages.has(name)) errors.push('Asset not mirrored in original sources: '+name);
console.log('\nUSM IMAGE AUDIT: '+rows.length+' modules, '+rows.reduce((n,r)=>n+r.images,0)+' image placements, '+used.size+' referenced assets.');
console.table(rows);
console.log('\nLOW-RESOLUTION PHOTO REVIEW: '+fragile.length);
console.table(fragile);
console.log('WARNINGS: '+warnings.length);
for (const msg of warnings) console.warn('  WARN '+msg);
console.log('ERRORS: '+errors.length);
for (const msg of errors) console.error('  ERROR '+msg);
if (errors.length) process.exitCode = 1;
