// ╔═══════════════════════════════════════════════════════╗
// ║         Nosher Print Agent v1.0                       ║
// ║  Runs on vendor's PC — silently prints new jobs       ║
// ╚═══════════════════════════════════════════════════════╝
//
// SETUP:
//  1. Install Node.js from https://nodejs.org
//  2. Fill in .env file with VENDOR_ID and API_BASE
//  3. Run: npm install
//  4. Run: node agent.js
//
// ─────────────────────────────────────────────────────────

require('dotenv').config();

const https    = require('https');
const http     = require('http');
const fs       = require('fs');
const path     = require('path');
const os       = require('os');
const ptp      = require('pdf-to-printer');

// ── Config ─────────────────────────────────────────────────────────────────
const CONFIG = {
  apiBase:      process.env.API_BASE      || 'http://localhost:3000',
  vendorId:     process.env.VENDOR_ID     || '',
  secret:       process.env.AGENT_SECRET  || 'nosher-print-agent-secret',
  pollInterval: parseInt(process.env.POLL_INTERVAL || '8000'),
  downloadDir:  path.join(os.tmpdir(), 'nosher-print'),
};

// ── Validate config ─────────────────────────────────────────────────────────
if (!CONFIG.vendorId) {
  console.error('');
  console.error('❌ ERROR: VENDOR_ID is not set in your .env file!');
  console.error('   Open .env and add: VENDOR_ID=your_vendor_id_here');
  console.error('');
  process.exit(1);
}

if (CONFIG.apiBase.includes('localhost')) {
  console.warn('⚠️  WARNING: API_BASE is localhost. Change to your live domain in .env');
}

// Create temp dir for downloads
if (!fs.existsSync(CONFIG.downloadDir)) {
  fs.mkdirSync(CONFIG.downloadDir, { recursive: true });
}

// ── Track processed jobs (avoid duplicate prints in same session) ───────────
const processedJobs = new Set();

// ── HTTP GET → JSON ─────────────────────────────────────────────────────────
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`Invalid JSON: ${data.substring(0, 100)}`)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Request timed out')); });
  });
}

// ── HTTP POST → JSON ────────────────────────────────────────────────────────
function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const parsed  = new URL(url);
    const mod     = parsed.protocol === 'https:' ? https : http;

    const req = mod.request({
      hostname: parsed.hostname,
      port:     parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path:     parsed.pathname + parsed.search,
      method:   'POST',
      headers:  {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`Invalid JSON: ${data.substring(0, 100)}`)); }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('POST timed out')); });
    req.write(payload);
    req.end();
  });
}

// ── Download file (handles Cloudinary redirects) ────────────────────────────
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const mod  = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);

    const request = mod.get(url, (res) => {
      // Follow redirects — Cloudinary uses these
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(dest, () => {});
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`Download failed: HTTP ${res.statusCode}`));
      }

      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', err => { fs.unlink(dest, () => {}); reject(err); });
    });

    request.on('error', err => { fs.unlink(dest, () => {}); reject(err); });
    request.setTimeout(60000, () => {
      request.destroy();
      reject(new Error('Download timed out after 60s'));
    });
  });
}

// ── Silent Print using pdf-to-printer ──────────────────────────────────────
async function silentPrint(filePath, printerName) {
  const options = printerName ? { printer: printerName } : {};
  console.log(`   🖨️  Printer: "${printerName || 'default system printer'}"`);
  await ptp.print(filePath, options);
}

// ── Mark job status on server ───────────────────────────────────────────────
async function markJob(jobId, status) {
  try {
    await postJson(`${CONFIG.apiBase}/api/xerox/mark-printing`, {
      jobId,
      secret: CONFIG.secret,
      status,
    });
  } catch (err) {
    console.error(`   ⚠️  Could not mark job ${jobId} as [${status}]: ${err.message}`);
  }
}

// ── Process one job ─────────────────────────────────────────────────────────
async function processJob(job, printerName) {
  const jobId = job._id;

  // Skip if already handled this session
  if (processedJobs.has(jobId)) return;
  processedJobs.add(jobId);

  console.log('');
  console.log('  ┌──────────────────────────────────────────────');
  console.log(`  │ 📄 File     : ${job.fileName}`);
  console.log(`  │ 📋 Pages    : ${job.pageCount}`);
  console.log(`  │ 🎨 Color    : ${job.colorMode || job.printType || 'bw'}`);
  console.log(`  │ 📐 Paper    : ${job.paperSize || 'A4'}`);
  console.log(`  │ 🔁 Copies   : ${job.copies || 1}`);
  console.log(`  │ ↕️  2-Sided  : ${job.doubleSided ? 'Yes' : 'No'}`);
  if (job.specialInstructions) {
    console.log(`  │ 📝 Notes    : ${job.specialInstructions}`);
  }
  console.log('  └──────────────────────────────────────────────');

  // ── Step 1: Lock job immediately so no other agent picks it up ────────────
  console.log('  ⏳ [1/3] Locking job...');
  await markJob(jobId, 'printing');
  console.log('  ✅ Locked as "printing"');

  // ── Step 2: Download PDF from Cloudinary ──────────────────────────────────
  const ext       = path.extname(job.fileName) || '.pdf';
  const localPath = path.join(CONFIG.downloadDir, `${jobId}${ext}`);

  console.log('  ⬇️  [2/3] Downloading from Cloudinary...');
  try {
    await downloadFile(job.fileUrl, localPath);
    const size = (fs.statSync(localPath).size / 1024).toFixed(1);
    console.log(`  ✅ Downloaded (${size} KB)`);
  } catch (err) {
    console.error(`  ❌ Download failed: ${err.message}`);
    // Revert so vendor sees it on dashboard and can retry manually
    await markJob(jobId, 'queued');
    processedJobs.delete(jobId);
    return;
  }

  // ── Step 3: Print ──────────────────────────────────────────────────────────
  console.log('  🖨️  [3/3] Sending to printer...');
  try {
    await silentPrint(localPath, printerName);
    console.log('  ✅ Sent to printer!');

    await markJob(jobId, 'done');
    console.log('  🎉 Job complete!\n');
  } catch (err) {
    console.error(`  ❌ Print failed: ${err.message}`);
    // Put back to queued so vendor can manually handle it
    await markJob(jobId, 'queued');
    processedJobs.delete(jobId);
  } finally {
    // Always clean up temp file
    if (fs.existsSync(localPath)) {
      fs.unlink(localPath, () => {});
    }
  }
}

// ── Main poll loop ──────────────────────────────────────────────────────────
let dotCount = 0;

async function pollAndPrint() {
  try {
    const url  = `${CONFIG.apiBase}/api/xerox/auto-jobs?vendorId=${CONFIG.vendorId}&secret=${CONFIG.secret}`;
    const data = await fetchJson(url);

    if (!data.autoPrint) {
      if (dotCount % 5 === 0) {
        process.stdout.write('\n  ⏸  Auto-print is OFF in settings. Waiting...');
      }
      dotCount++;
      return;
    }

    if (!data.jobs || data.jobs.length === 0) {
      process.stdout.write('.');
      dotCount++;
      // New line every 50 dots so terminal stays clean
      if (dotCount % 50 === 0) process.stdout.write('\n  ');
      return;
    }

    // Reset dot counter when jobs arrive
    dotCount = 0;
    process.stdout.write('\n');
    console.log(`\n📋 ${data.jobs.length} new job(s) found!`);

    // Process jobs one by one (don't flood printer)
    for (const job of data.jobs) {
      await processJob(job, data.printerName);
    }

    console.log('Listening for new jobs...');
    process.stdout.write('  ');

  } catch (err) {
    process.stdout.write('\n');
    console.error(`\n❌ Poll error: ${err.message}`);
    console.log('   Will retry on next poll...\n');
  }
}

// ── Graceful shutdown ───────────────────────────────────────────────────────
process.on('SIGINT', () => {
  console.log('\n\n👋 Agent stopped. Goodbye!\n');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Agent stopped.\n');
  process.exit(0);
});

// ── Start ───────────────────────────────────────────────────────────────────
console.log('');
console.log('╔══════════════════════════════════════════╗');
console.log('║      🖨️  Nosher Print Agent v1.0          ║');
console.log('╚══════════════════════════════════════════╝');
console.log('');
console.log(`  🏪 Vendor ID  : ${CONFIG.vendorId}`);
console.log(`  🌐 API Base   : ${CONFIG.apiBase}`);
console.log(`  ⏱️  Poll Every : ${CONFIG.pollInterval / 1000}s`);
console.log(`  📁 Temp Dir   : ${CONFIG.downloadDir}`);
console.log(`  💻 Platform   : ${os.platform()}`);
console.log('');
console.log('──────────────────────────────────────────');
console.log('Listening for new jobs...');
process.stdout.write('  ');

// Run immediately, then every N seconds
pollAndPrint();
setInterval(pollAndPrint, CONFIG.pollInterval);