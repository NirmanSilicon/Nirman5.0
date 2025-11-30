import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    // Test Cloudinary connection
    const result = await cloudinary.api.ping();
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful',
      cloudinary: result
    });
  } catch (error) {
    console.error('Cloudinary connection error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Cloudinary connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
