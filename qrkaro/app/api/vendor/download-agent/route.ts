// import { NextRequest, NextResponse } from 'next/server';
// import JSZip from 'jszip';
// import connectDB from '@/lib/db';
// import Vendor from '@/lib/models/Vendor';

// // The base agent.js code as a string — this gets baked into the ZIP
// function getAgentCode(): string {
//   return `
// require('dotenv').config();

// const https    = require('https');
// const http     = require('http');
// const fs       = require('fs');
// const path     = require('path');
// const os       = require('os');
// const ptp      = require('pdf-to-printer');

// const CONFIG = {
//   apiBase:      process.env.API_BASE      || 'https://nosher.in',
//   vendorId:     process.env.VENDOR_ID     || '',
//   secret:       process.env.AGENT_SECRET  || 'nosher-print-agent-secret',
//   pollInterval: parseInt(process.env.POLL_INTERVAL || '8000'),
//   downloadDir:  path.join(os.tmpdir(), 'nosher-print'),
// };

// if (!CONFIG.vendorId) {
//   console.error('❌ VENDOR_ID not set in .env file!');
//   process.exit(1);
// }

// if (!fs.existsSync(CONFIG.downloadDir)) {
//   fs.mkdirSync(CONFIG.downloadDir, { recursive: true });
// }

// const processedJobs = new Set();

// function fetchJson(url) {
//   return new Promise((resolve, reject) => {
//     const mod = url.startsWith('https') ? https : http;
//     const req = mod.get(url, (res) => {
//       if (res.statusCode === 301 || res.statusCode === 302) {
//         return fetchJson(res.headers.location).then(resolve).catch(reject);
//       }
//       let data = '';
//       res.on('data', chunk => (data += chunk));
//       res.on('end', () => {
//         try { resolve(JSON.parse(data)); }
//         catch (e) { reject(new Error('Invalid JSON: ' + data.substring(0, 100))); }
//       });
//     });
//     req.on('error', reject);
//     req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
//   });
// }

// function postJson(url, body) {
//   return new Promise((resolve, reject) => {
//     const payload = JSON.stringify(body);
//     const parsed  = new URL(url);
//     const mod     = parsed.protocol === 'https:' ? https : http;
//     const req = mod.request({
//       hostname: parsed.hostname,
//       port:     parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
//       path:     parsed.pathname,
//       method:   'POST',
//       headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
//     }, (res) => {
//       let data = '';
//       res.on('data', c => (data += c));
//       res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve({}); } });
//     });
//     req.on('error', reject);
//     req.write(payload);
//     req.end();
//   });
// }

// function downloadFile(url, dest) {
//   return new Promise((resolve, reject) => {
//     const mod  = url.startsWith('https') ? https : http;
//     const file = fs.createWriteStream(dest);
//     const request = mod.get(url, (res) => {
//       if (res.statusCode === 301 || res.statusCode === 302) {
//         file.close();
//         fs.unlink(dest, () => {});
//         return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
//       }
//       if (res.statusCode !== 200) {
//         file.close();
//         fs.unlink(dest, () => {});
//         return reject(new Error('Download failed: HTTP ' + res.statusCode));
//       }
//       res.pipe(file);
//       file.on('finish', () => file.close(resolve));
//       file.on('error', err => { fs.unlink(dest, () => {}); reject(err); });
//     });
//     request.on('error', err => { fs.unlink(dest, () => {}); reject(err); });
//     request.setTimeout(60000, () => { request.destroy(); reject(new Error('Download timeout')); });
//   });
// }

// async function silentPrint(filePath, printerName) {
//   const options = printerName ? { printer: printerName } : {};
//   await ptp.print(filePath, options);
// }

// async function markJob(jobId, status) {
//   try {
//     await postJson(CONFIG.apiBase + '/api/xerox/mark-printing', {
//       jobId, secret: CONFIG.secret, status,
//     });
//   } catch (err) {
//     console.error('Could not mark job:', err.message);
//   }
// }

// async function processJob(job, printerName) {
//   const jobId = job._id;
//   if (processedJobs.has(jobId)) return;
//   processedJobs.add(jobId);

//   console.log('\\n┌─────────────────────────────────────');
//   console.log('│ 📄 ' + job.fileName);
//   console.log('│ 📋 ' + job.pageCount + ' pages | ' + (job.colorMode || 'bw') + ' | ' + (job.copies || 1) + ' copies');
//   if (job.specialInstructions) console.log('│ 📝 ' + job.specialInstructions);
//   console.log('└─────────────────────────────────────');

//   console.log('  ⏳ [1/3] Locking job...');
//   await markJob(jobId, 'printing');

//   const ext       = require('path').extname(job.fileName) || '.pdf';
//   const localPath = require('path').join(CONFIG.downloadDir, jobId + ext);

//   console.log('  ⬇️  [2/3] Downloading...');
//   try {
//     await downloadFile(job.fileUrl, localPath);
//     const size = (fs.statSync(localPath).size / 1024).toFixed(1);
//     console.log('  ✅ Downloaded (' + size + ' KB)');
//   } catch (err) {
//     console.error('  ❌ Download failed:', err.message);
//     await markJob(jobId, 'queued');
//     processedJobs.delete(jobId);
//     return;
//   }

//   console.log('  🖨️  [3/3] Printing to: ' + (printerName || 'default') + '...');
//   try {
//     await silentPrint(localPath, printerName);
//     console.log('  ✅ Printed!');
//     await markJob(jobId, 'done');
//     console.log('  🎉 Job complete!');
//   } catch (err) {
//     console.error('  ❌ Print error:', err.message);
//     await markJob(jobId, 'queued');
//     processedJobs.delete(jobId);
//   } finally {
//     if (fs.existsSync(localPath)) fs.unlink(localPath, () => {});
//   }
// }

// let dotCount = 0;

// async function pollAndPrint() {
//   try {
//     const url  = CONFIG.apiBase + '/api/xerox/auto-jobs?vendorId=' + CONFIG.vendorId + '&secret=' + CONFIG.secret;
//     const data = await fetchJson(url);

//     if (!data.autoPrint) {
//       if (dotCount % 5 === 0) process.stdout.write('\\n  ⏸  Auto-print is OFF');
//       dotCount++;
//       return;
//     }
//     if (!data.jobs || data.jobs.length === 0) {
//       process.stdout.write('.');
//       dotCount++;
//       if (dotCount % 50 === 0) process.stdout.write('\\n  ');
//       return;
//     }
//     dotCount = 0;
//     process.stdout.write('\\n');
//     console.log('\\n📋 ' + data.jobs.length + ' new job(s)!');
//     for (const job of data.jobs) {
//       await processJob(job, data.printerName);
//     }
//     console.log('Listening...');
//     process.stdout.write('  ');
//   } catch (err) {
//     process.stdout.write('\\n');
//     console.error('\\n❌ Poll error:', err.message);
//   }
// }

// process.on('SIGINT',  () => { console.log('\\n\\n👋 Agent stopped.'); process.exit(0); });
// process.on('SIGTERM', () => { console.log('\\n\\n👋 Agent stopped.'); process.exit(0); });

// console.log('');
// console.log('╔══════════════════════════════════════════╗');
// console.log('║      🖨️  Nosher Print Agent v1.0          ║');
// console.log('╚══════════════════════════════════════════╝');
// console.log('  🏪 Vendor: ' + CONFIG.vendorId);
// console.log('  🌐 Server: ' + CONFIG.apiBase);
// console.log('  ⏱️  Poll  : ' + CONFIG.pollInterval / 1000 + 's');
// console.log('');
// console.log('Listening for new jobs...');
// process.stdout.write('  ');

// pollAndPrint();
// setInterval(pollAndPrint, CONFIG.pollInterval);
// `.trim();
// }

// function getPackageJson(): string {
//   return JSON.stringify({
//     name:        'nosher-print-agent',
//     version:     '1.0.0',
//     description: 'Nosher Print Agent — auto-print for xerox vendors',
//     main:        'agent.js',
//     scripts:     { start: 'node agent.js' },
//     dependencies: {
//       'dotenv':         '^16.4.5',
//       'pdf-to-printer': '^5.0.1',
//     },
//     engines: { node: '>=18.0.0' },
//   }, null, 2);
// }

// function getReadme(shopName: string, vendorId: string, printerName: string): string {
//   return `
// ╔══════════════════════════════════════════╗
// ║      🖨️  Nosher Print Agent               ║
// ║      Setup for: ${shopName.padEnd(24)}║
// ╚══════════════════════════════════════════╝

// YOUR DETAILS ARE ALREADY PRE-CONFIGURED ✅
//   Vendor ID    : ${vendorId}
//   Printer Name : ${printerName || 'Default system printer'}
//   Server       : https://nosher.in

// ══════════════════════════════════════════
// HOW TO USE — Only 3 steps:
// ══════════════════════════════════════════

// STEP 1: Install Node.js (one time only)
//   → Go to: https://nodejs.org
//   → Download the LTS version
//   → Run installer, click Next → Install
//   → Done! ✅

// STEP 2: Install dependencies (one time only)
//   → Right-click this folder → "Open in Terminal"
//   → Type: npm install
//   → Press Enter and wait

// STEP 3: Start the agent (every day when shop opens)
//   → Double-click: start-agent.bat
//   OR
//   → Right-click folder → "Open in Terminal"
//   → Type: node agent.js
//   → Press Enter

// ══════════════════════════════════════════
// IMPORTANT:
// ══════════════════════════════════════════
// • Keep this window open while your shop is running
// • Jobs will print AUTOMATICALLY as they arrive
// • To stop: Press Ctrl+C or close the window
// • Run it again next day when shop opens

// Need help? Contact: support@nosher.in
// `.trim();
// }

// function getStartBat(vendorId: string): string {
//   return `@echo off
// title Nosher Print Agent - ${vendorId}
// color 0A
// echo.
// echo  ==========================================
// echo   Nosher Print Agent Starting...
// echo  ==========================================
// echo.
// echo  Keep this window OPEN while shop is running
// echo  Close it to STOP auto-printing
// echo.

// :: Auto-install dependencies if node_modules is missing
// IF NOT EXIST "node_modules" (
//   echo  [SETUP] First time setup - installing dependencies...
//   echo  [SETUP] This may take 1-2 minutes. Please wait...
//   echo.
//   npm install
//   echo.
//   echo  [SETUP] Setup complete! Starting agent...
//   echo.
// )

// node agent.js
// echo.
// echo  Agent stopped. Press any key to exit.
// pause >nul
// `;
// }

// // ── Main API Route ──────────────────────────────────────────────────────────
// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const vendorId = new URL(req.url).searchParams.get('vendorId');
//     if (!vendorId)
//       return NextResponse.json({ error: 'vendorId required' }, { status: 400 });

//     const vendor = await Vendor.findOne({ vendorId });
//     if (!vendor)
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

//     if (vendor.shopType !== 'Xerox Shop')
//       return NextResponse.json({ error: 'Only Xerox vendors can download the agent' }, { status: 403 });

//     const printerName = vendor.xeroxSettings?.printerName || '';
//     const shopName    = vendor.shopName || 'Your Shop';
//     const apiBase     = process.env.NEXT_PUBLIC_APP_URL || 'https://nosher.in';
//     const agentSecret = process.env.PRINT_AGENT_SECRET  || 'nosher-print-agent-secret';

//     // ── Generate .env with vendor's details baked in ──────────────────────
//     const envContent = [
//       `API_BASE=${apiBase}`,
//       `VENDOR_ID=${vendorId}`,
//       `AGENT_SECRET=${agentSecret}`,
//       `POLL_INTERVAL=8000`,
//     ].join('\n');

//     // ── Build ZIP using JSZip ──────────────────────────────────────────────
//     const zip = new JSZip();

//     // Add all files to the ZIP
//     zip.file('agent.js',      getAgentCode());
//     zip.file('package.json',  getPackageJson());
//     zip.file('.env',          envContent);
//     zip.file('README.txt',    getReadme(shopName, vendorId, printerName));
//     zip.file('start-agent.bat', getStartBat(vendorId)); // Windows double-click launcher

//     const zipBuffer = await zip.generateAsync({
//       type:               'nodebuffer',
//       compression:        'DEFLATE',
//       compressionOptions: { level: 6 },
//     });

//     // ── Return ZIP as download ─────────────────────────────────────────────
//     return new NextResponse(zipBuffer, {
//       status:  200,
//       headers: {
//         'Content-Type':        'application/zip',
//         'Content-Disposition': `attachment; filename="nosher-agent-${vendorId}.zip"`,
//         'Content-Length':      zipBuffer.length.toString(),
//         'Cache-Control':       'no-store',
//       },
//     });

//   } catch (error: any) {
//     console.error('Download agent error:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';

const AGENT_EXE_URL = process.env.AGENT_EXE_URL!;

async function downloadExeBuffer(): Promise<Buffer> {
  const res = await fetch(AGENT_EXE_URL);
  if (!res.ok) throw new Error(`Failed to fetch agent exe: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function getEnvContent(vendorId: string, apiBase: string, agentSecret: string): string {
  return [
    `API_BASE=${apiBase}`,
    `VENDOR_ID=${vendorId}`,
    `AGENT_SECRET=${agentSecret}`,
    `POLL_INTERVAL=8000`,
  ].join('\n');
}

function getStartBat(vendorId: string): string {
  return `@echo off
title Nosher Print Agent - ${vendorId}
color 0A
echo.
echo  ==========================================
echo    Nosher Print Agent Starting...
echo  ==========================================
echo.
echo  Keep this window OPEN while shop is running
echo  Close it to STOP auto-printing
echo.
nosher-agent.exe
echo.
echo  Agent stopped. Press any key to exit.
pause >nul
`;
}

function getReadme(shopName: string, vendorId: string, printerName: string): string {
  return `
╔══════════════════════════════════════════╗
║      🖨️  Nosher Print Agent               ║
║      Setup for: ${shopName.padEnd(24)}║
╚══════════════════════════════════════════╝

YOUR DETAILS ARE ALREADY PRE-CONFIGURED ✅
  Vendor ID    : ${vendorId}
  Printer Name : ${printerName || 'Default system printer'}
  Server       : https://nosher.in

══════════════════════════════════════════
HOW TO USE — Only 2 steps:
══════════════════════════════════════════

STEP 1: Extract this ZIP anywhere on your PC

STEP 2: Double-click start.bat
  → That's it! No installation needed ✅

══════════════════════════════════════════
IMPORTANT:
══════════════════════════════════════════
• Keep the window open while your shop is running
• Jobs will print AUTOMATICALLY as they arrive
• To stop: Press Ctrl+C or close the window
• Run start.bat again next day when shop opens

Need help? Contact: support@nosher.in
`.trim();
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const vendorId = new URL(req.url).searchParams.get('vendorId');
    if (!vendorId)
      return NextResponse.json({ error: 'vendorId required' }, { status: 400 });

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor)
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    if (vendor.shopType !== 'Xerox Shop')
      return NextResponse.json({ error: 'Only Xerox vendors can download the agent' }, { status: 403 });

    const printerName = vendor.xeroxSettings?.printerName || '';
    const shopName    = vendor.shopName || 'Your Shop';
    const apiBase     = process.env.NEXT_PUBLIC_APP_URL || 'https://nosher.in';
    const agentSecret = process.env.PRINT_AGENT_SECRET  || 'nosher-print-agent-secret';

    // Fetch the pre-built .exe from /public folder (Vercel CDN)
    const exeBuffer = await downloadExeBuffer();

    // Build ZIP
    const zip = new JSZip();
    zip.file('nosher-agent.exe', exeBuffer);
    zip.file('.env',             getEnvContent(vendorId, apiBase, agentSecret));
    zip.file('start.bat',        getStartBat(vendorId));
    zip.file('README.txt',       getReadme(shopName, vendorId, printerName));

    const zipBuffer = await zip.generateAsync({
      type:               'nodebuffer',
      compression:        'DEFLATE',
      compressionOptions: { level: 6 },
    });

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/zip',
        'Content-Disposition': `attachment; filename="nosher-agent-${vendorId}.zip"`,
        'Content-Length':      zipBuffer.length.toString(),
        'Cache-Control':       'no-store',
      },
    });

  } catch (error: any) {
    console.error('Download agent error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}