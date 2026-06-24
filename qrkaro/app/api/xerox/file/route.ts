import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('Missing url', { status: 400 });

  try {
    // Extract everything after /raw/upload/ or /image/upload/ (with or without version)
    const match = url.match(/\/(?:raw|image)\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) return new NextResponse('Invalid Cloudinary URL', { status: 400 });

    // ✅ DO NOT strip extension — for raw files, public_id includes .pdf
    const publicId = match[1]; // e.g. "xerox-jobs/xerox_1776260369597.pdf"

    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 60,
      type: 'upload',
    });

    console.log('🔗 Signed URL:', signedUrl); // ← check this in logs

    const res = await fetch(signedUrl, { redirect: 'follow' });

    if (!res.ok) {
      console.error('❌ Cloudinary fetch failed:', res.status, res.statusText);
      return new NextResponse(`Fetch failed: ${res.status} ${res.statusText}`, { status: 502 });
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch (err: any) {
    console.error('❌ File proxy error:', err.message);
    return new NextResponse(`Error: ${err.message}`, { status: 500 });
  }
}
