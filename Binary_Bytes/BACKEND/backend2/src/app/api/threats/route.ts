import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import { getAuthToken, verifyToken } from "@/app/lib/auth";
import Threat from "@/app/models/Threat";
import { corsHeaders, handleCORS, addCorsHeaders } from "@/app/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCORS(req);
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const token = getAuthToken(req);
    if (!token) {
      const errorResponse = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(errorResponse, req);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      const errorResponse = NextResponse.json({ error: "Invalid token" }, { status: 401 });
      return addCorsHeaders(errorResponse, req);
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');

    const validStatuses = ['active', 'investigating', 'resolved'];
    const validSeverities = ['critical', 'high', 'medium', 'low'];

    const query: any = { userId: decoded.userId };
    if (status && status !== 'all') {
      if (!validStatuses.includes(status)) {
        const errorResponse = NextResponse.json(
          { error: `Invalid status filter. Must be one of: ${validStatuses.join(', ')}, or 'all'` },
          { status: 400 }
        );
        return addCorsHeaders(errorResponse, req);
      }
      query.status = status;
    }
    if (severity && severity !== 'all') {
      if (!validSeverities.includes(severity)) {
        const errorResponse = NextResponse.json(
          { error: `Invalid severity filter. Must be one of: ${validSeverities.join(', ')}, or 'all'` },
          { status: 400 }
        );
        return addCorsHeaders(errorResponse, req);
      }
      query.severity = severity;
    }

    const threats = await Threat.find(query).sort({ timestamp: -1 });
    
    const response = NextResponse.json({ threats }, { status: 200 });
    return addCorsHeaders(response, req);
  } catch (error: any) {
    console.error("Error fetching threats:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to fetch threats", details: error.message },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const token = getAuthToken(req);
    if (!token) {
      const errorResponse = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(errorResponse, req);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      const errorResponse = NextResponse.json({ error: "Invalid token" }, { status: 401 });
      return addCorsHeaders(errorResponse, req);
    }

    const body = await req.json();
    const { id, timestamp, type, severity, source, camera, description, status } = body;

    if (!id || !type || !severity || !source || !camera || !description) {
      const errorResponse = NextResponse.json(
        { error: "Missing required fields: id, type, severity, source, camera, and description are required" },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    const validTypes = ['unauthorized_access', 'brute_force', 'anomaly', 'intrusion'];
    const validSeverities = ['critical', 'high', 'medium', 'low'];
    const validStatuses = ['active', 'investigating', 'resolved'];

    if (!validTypes.includes(type)) {
      const errorResponse = NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    if (!validSeverities.includes(severity)) {
      const errorResponse = NextResponse.json(
        { error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}` },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    if (status && !validStatuses.includes(status)) {
      const errorResponse = NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    const threat = await Threat.create({
      userId: decoded.userId,
      id,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      type,
      severity,
      source,
      camera,
      description,
      status: status || 'active',
    });

    const response = NextResponse.json({ threat }, { status: 201 });
    return addCorsHeaders(response, req);
  } catch (error: any) {
    console.error("Error creating threat:", error);
    if (error.code === 11000) {
      const errorResponse = NextResponse.json(
        { error: "Threat with this ID already exists" },
        { status: 409 }
      );
      return addCorsHeaders(errorResponse, req);
    }
    const errorResponse = NextResponse.json(
      { error: "Failed to create threat", details: error.message },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}

