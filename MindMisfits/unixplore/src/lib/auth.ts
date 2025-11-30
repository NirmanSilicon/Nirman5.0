import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const SALT_ROUNDS = 12;

export interface TokenPayload {
    id: number;
    email: string;
    role: 'college_admin' | 'club_admin';
    collegeId?: number;
    clubId?: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d',
    });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

/**
 * Middleware to verify authentication
 */
export async function requireAuth(
    authHeader: string | null,
    requiredRole?: 'college_admin' | 'club_admin'
): Promise<TokenPayload> {
    const token = extractToken(authHeader);

    if (!token) {
        throw new Error('No authentication token provided');
    }

    const payload = verifyToken(token);

    if (!payload) {
        throw new Error('Invalid or expired token');
    }

    if (requiredRole && payload.role !== requiredRole) {
        throw new Error('Insufficient permissions');
    }

    return payload;
}
