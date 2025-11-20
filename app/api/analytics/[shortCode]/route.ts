import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Analytics from '@/models/Analytics';
import Link from '@/models/Link';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    await connectDB();
    const { shortCode } = await params;

    const link = await Link.findOne({ shortCode });
    if (!link) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    const analytics = await Analytics.find({ shortCode }).sort({ timestamp: -1 });

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      total: analytics.length,
      last24Hours: analytics.filter((a) => a.timestamp >= last24Hours).length,
      last7Days: analytics.filter((a) => a.timestamp >= last7Days).length,
      last30Days: analytics.filter((a) => a.timestamp >= last30Days).length,
      byDevice: analytics.reduce((acc: Record<string, number>, curr) => {
        const device = curr.device || 'Unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {}),
      byBrowser: analytics.reduce((acc: Record<string, number>, curr) => {
        const browser = curr.browser || 'Unknown';
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
      }, {}),
      byOS: analytics.reduce((acc: Record<string, number>, curr) => {
        const os = curr.os || 'Unknown';
        acc[os] = (acc[os] || 0) + 1;
        return acc;
      }, {}),
      byCountry: analytics.reduce((acc: Record<string, number>, curr) => {
        const country = curr.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {}),
    };

    return NextResponse.json({
      success: true,
      data: {
        link,
        stats,
        recentClicks: analytics.slice(0, 100),
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
