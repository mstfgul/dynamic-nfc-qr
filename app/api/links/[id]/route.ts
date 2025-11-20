import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Link from '@/models/Link';
import QRCode from 'qrcode';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const link = await Link.findById(id);

    if (!link) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch link' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { destinationUrl, title, description, isActive } = body;

    const link = await Link.findById(id);
    if (!link) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    if (destinationUrl) link.destinationUrl = destinationUrl;
    if (title !== undefined) link.title = title;
    if (description !== undefined) link.description = description;
    if (isActive !== undefined) link.isActive = isActive;

    if (destinationUrl) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const shortUrl = `${baseUrl}/${link.shortCode}`;
      link.qrCodeData = await QRCode.toDataURL(shortUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    }

    await link.save();

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update link' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const link = await Link.findByIdAndDelete(id);

    if (!link) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}
