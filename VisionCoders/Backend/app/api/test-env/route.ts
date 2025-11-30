import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    return NextResponse.json({
        supabaseUrl: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
        geminiKey: process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET',
    });
}
