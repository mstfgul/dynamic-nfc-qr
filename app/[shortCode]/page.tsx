import { redirect, notFound } from 'next/navigation';
import { headers } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Link from '@/models/Link';
import Analytics from '@/models/Analytics';
import { UAParser } from 'ua-parser-js';

async function trackClick(linkId: string, shortCode: string, headersList: Headers) {
  try {
    const userAgent = headersList.get('user-agent') || '';
    const referer = headersList.get('referer') || '';
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '';

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    await Analytics.create({
      linkId,
      shortCode,
      ipAddress,
      userAgent,
      referer,
      device: result.device.type || 'desktop',
      browser: result.browser.name || 'Unknown',
      os: result.os.name || 'Unknown',
      timestamp: new Date(),
    });

    await Link.findByIdAndUpdate(linkId, { $inc: { clickCount: 1 } });
  } catch (error) {
    console.error('Error tracking click:', error);
  }
}

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;

  console.log('🔍 Looking for shortCode:', shortCode);

  try {
    await connectDB();
    console.log('✅ MongoDB connected');

    const link = await Link.findOne({ shortCode, isActive: true });
    console.log('🔗 Link found:', link ? `${link.destinationUrl}` : 'NOT FOUND');

    if (!link) {
      console.log('❌ Link not found, showing 404');
      notFound();
    }

    const headersList = await headers();
    await trackClick(link._id.toString(), shortCode, headersList);

    console.log('➡️ Redirecting to:', link.destinationUrl);
    redirect(link.destinationUrl);
  } catch (error: any) {
    if (error.message === 'NEXT_NOT_FOUND') {
      throw error;
    }
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('❌ Redirect error:', error);
    notFound();
  }
}
