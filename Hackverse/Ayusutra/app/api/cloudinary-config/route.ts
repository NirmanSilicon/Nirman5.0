import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if Cloudinary is configured
    const isConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      success: true,
      configured: isConfigured,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || null
    });
  } catch (error) {
    console.error('Error checking Cloudinary config:', error);
    return NextResponse.json({
      success: false,
      configured: false,
      error: 'Failed to check configuration'
    });
  }
}
