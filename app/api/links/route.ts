import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Link from '@/models/Link';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get('clientId');

    const filter = clientId ? { clientId } : {};
    const links = await Link.find(filter).sort({ createdAt: -1 }).populate('clientId', 'name company');

    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { destinationUrl, title, description, customCode, clientId } = body;

    if (!destinationUrl) {
      return NextResponse.json(
        { success: false, error: 'Destination URL is required' },
        { status: 400 }
      );
    }

    const shortCode = customCode || nanoid(8);

    const existingLink = await Link.findOne({ shortCode });
    if (existingLink) {
      return NextResponse.json(
        { success: false, error: 'Short code already exists' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${shortCode}`;

    const qrCodeData = await QRCode.toDataURL(shortUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    const link = await Link.create({
      clientId: clientId || null,
      shortCode,
      destinationUrl,
      title,
      description,
      qrCodeData,
      isActive: true,
    });

    return NextResponse.json({ success: true, data: link }, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create link' },
      { status: 500 }
    );
  }
}
