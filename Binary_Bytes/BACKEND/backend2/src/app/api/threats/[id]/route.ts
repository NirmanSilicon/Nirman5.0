import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import { getAuthToken, verifyToken } from "@/app/lib/auth";
import Threat from "@/app/models/Threat";
import { corsHeaders, handleCORS, addCorsHeaders } from "@/app/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCORS(req);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    
    if (Object.keys(body).length === 0) {
      const errorResponse = NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    const validTypes = ['unauthorized_access', 'brute_force', 'anomaly', 'intrusion'];
    const validSeverities = ['critical', 'high', 'medium', 'low'];
    const validStatuses = ['active', 'investigating', 'resolved'];

    if (body.type && !validTypes.includes(body.type)) {
      const errorResponse = NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    if (body.severity && !validSeverities.includes(body.severity)) {
      const errorResponse = NextResponse.json(
        { error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}` },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    if (body.status && !validStatuses.includes(body.status)) {
      const errorResponse = NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    const updateData: any = { ...body };
    delete updateData.userId;
    delete updateData.id;

    if (updateData.timestamp) {
      updateData.timestamp = new Date(updateData.timestamp);
    }

    const threat = await Threat.findOneAndUpdate(
      { userId: decoded.userId, id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!threat) {
      const errorResponse = NextResponse.json({ error: "Threat not found" }, { status: 404 });
      return addCorsHeaders(errorResponse, req);
    }

    const response = NextResponse.json({ threat }, { status: 200 });
    return addCorsHeaders(response, req);
  } catch (error: any) {
    console.error("Error updating threat:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to update threat", details: error.message },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const threat = await Threat.findOneAndDelete({ 
      userId: decoded.userId, 
      id: id 
    });

    if (!threat) {
      const errorResponse = NextResponse.json({ error: "Threat not found" }, { status: 404 });
      return addCorsHeaders(errorResponse, req);
    }

    const response = NextResponse.json({ message: "Threat deleted successfully" }, { status: 200 });
    return addCorsHeaders(response, req);
  } catch (error: any) {
    console.error("Error deleting threat:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to delete threat", details: error.message },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}

