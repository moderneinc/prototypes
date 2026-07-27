#!/usr/bin/env node
/**
 * Moderne lower thirds — alpha video renderer
 * ------------------------------------------------------------------
 * Drives the same HTML prototype headlessly, grabs one transparent PNG
 * per frame, and muxes them into:
 *
 *   out/<name>.webm  VP9 + alpha   (Premiere, Resolve, DaVinci, web)
 *   out/<name>.mov   ProRes 4444   (Final Cut, After Effects, Premiere)
 *   out/<name>.png   still of the fully-on frame
 *
 * Usage
 *   node export/render.mjs                          # both presets
 *   node export/render.mjs --preset=name
 *   node export/render.mjs --variant=topic --eyebrow="The three walls" \
 *        --topic="Scale, correctness, and\nthe cost of being wrong" \
 *        --accent=#25D0C0 --position=br --hold=3000 --out=three-walls
 *   node export/render.mjs --preset=name --easing=snappy --speed=1.25
 *   node export/render.mjs --fps=60 --scale=2       # 60fps, 4K
 *   node export/render.mjs --batch=export/batch.json
 * ------------------------------------------------------------------ */

import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PAGE = path.join(ROOT, 'moderne-lower-thirds.html');
const OUT  = path.join(ROOT, 'out');

/* ---------------- args ---------------- */
const argv = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/);
  return m ? [m[1], m[2] ?? true] : [a, true];
}));

const FPS   = +(argv.fps   || 30);
const SCALE = +(argv.scale || 1);          // 1 = 1920x1080, 2 = 3840x2160
const W = 1920 * SCALE, H = 1080 * SCALE;
const KEEP  = !!argv['keep-frames'];

const PRESETS = {
  name: {
    out: 'lower-third-name',
    cfg: { variant:'name', style:'panel', position:'bl',
           name:'Johnny Appleseed', role:'Head of Engineering', org:'Moderne' }
  },
  topic: {
    out: 'lower-third-topic',
    cfg: { variant:'topic', style:'panel', position:'bl',
           eyebrow:'The three walls',
           topic:'Scale, correctness, and\\nthe cost of being wrong',
           meta:'MODERNE.IO/PLATFORM' }
  }
};

/* build the job list */
let jobs;
if (argv.batch){
  jobs = JSON.parse(fs.readFileSync(path.resolve(argv.batch), 'utf8'));
} else if (argv.preset){
  const p = PRESETS[argv.preset];
  if (!p) { console.error(`Unknown preset "${argv.preset}". Try: ${Object.keys(PRESETS).join(', ')}`); process.exit(1); }
  jobs = [{ out: argv.out || p.out, ...p.cfg, ...cliCfg() }];
} else if (Object.keys(cliCfg()).length){
  jobs = [{ out: argv.out || 'lower-third', ...cliCfg() }];
} else {
  jobs = Object.values(PRESETS).map(p => ({ out: p.out, ...p.cfg }));
}

function cliCfg(){
  const KEYS = ['variant','style','theme','position','accent','easing','gs','hold','speed',
                'hide','name','role','org','eyebrow','topic','meta'];
  const NUM  = new Set(['gs','hold','speed']);
  const o = {};
  for (const k of KEYS) if (k in argv) o[k] = NUM.has(k) ? +argv[k] : String(argv[k]);
  return o;
}

/* ---------------- render ---------------- */
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  args: ['--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none']
});
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: SCALE,
  colorScheme: 'dark'
});

await page.goto('file://' + PAGE, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

/* --html: also write a standalone self-playing .html per job (config baked
   in, chrome stripped, transparent, autoplays and loops). --html-only skips
   the video render entirely. --loop sets the pause between plays in seconds;
   --loop=-1 plays once. */
function writeHtml(name, cfg){
  const src = fs.readFileSync(PAGE, 'utf8');
  const baked = { ...cfg, __loop: 'loop' in argv ? +argv.loop : 1.5 };
  const tag = `<script>window.__BAKED=${JSON.stringify(baked)}</script>`;
  fs.writeFileSync(path.join(OUT, name + '.html'), src.replace('</head>', tag + '\n</head>'));
}

for (const job of jobs){
  const { out: name, ...cfg } = job;

  if (argv.html || argv['html-only']){
    writeHtml(name, cfg);
    console.log(`▸ ${name}.html  standalone player`);
    if (argv['html-only']) continue;
  }

  const frameDir = path.join(OUT, '.frames-' + name);
  fs.rmSync(frameDir, { recursive: true, force: true });
  fs.mkdirSync(frameDir, { recursive: true });

  await page.evaluate(c => { window.LT.setConfig(c); window.LT.exportMode(); }, cfg);
  await page.waitForTimeout(250);

  const dur    = await page.evaluate(() => window.LT.duration());
  const frames = Math.round(dur / 1000 * FPS) + 1;

  process.stdout.write(`\n▸ ${name}  ${(dur/1000).toFixed(2)}s · ${frames} frames · ${W}×${H} @ ${FPS}fps\n  `);

  for (let f = 0; f < frames; f++){
    await page.evaluate(t => window.LT.seek(t), (f / FPS) * 1000);
    await page.screenshot({
      path: path.join(frameDir, String(f).padStart(5, '0') + '.png'),
      omitBackground: true,
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
    if (f % 10 === 0) process.stdout.write('·');
  }

  // representative still: the moment everything has landed
  fs.copyFileSync(
    path.join(frameDir, String(Math.min(frames - 1, Math.round(1.6 * FPS))).padStart(5, '0') + '.png'),
    path.join(OUT, name + '.png')
  );

  const IN = ['-y', '-framerate', String(FPS), '-i', path.join(frameDir, '%05d.png')];

  // VP9 with alpha — the safest all-round NLE + web format
  ff([...IN,
    '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p',
    '-b:v', '0', '-crf', '18', '-row-mt', '1', '-auto-alt-ref', '0',
    path.join(OUT, name + '.webm')]);

  // ProRes 4444 — straight-alpha master for FCP / AE / Premiere
  ff([...IN,
    '-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le',
    '-alpha_bits', '16', '-vendor', 'apl0',
    path.join(OUT, name + '.mov')]);

  if (!KEEP) fs.rmSync(frameDir, { recursive: true, force: true });
  console.log(`\n  ✓ ${name}.webm · ${name}.mov · ${name}.png`);
}

await browser.close();
console.log(`\nDone → ${OUT}\n`);

function ff(args){
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], { stdio: 'inherit' });
}
