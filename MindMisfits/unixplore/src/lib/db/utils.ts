import { query } from './index';

/**
 * Generate a unique College ID in format CLG-XXXXXX
 */
export async function generateCollegeId(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const collegeId = `CLG-${randomNum}`;

        // Check if ID already exists
        const result = await query(
            'SELECT id FROM colleges WHERE college_id = $1',
            [collegeId]
        );

        if (result.rows.length === 0) {
            return collegeId;
        }

        attempts++;
    }

    throw new Error('Failed to generate unique College ID');
}

/**
 * Create a URL-safe slug from a string
 */
export function createSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Track analytics event
 */
export async function trackEvent(
    entityType: 'college' | 'club',
    entityId: number,
    eventType: string,
    metadata?: any
) {
    try {
        await query(
            `INSERT INTO analytics (entity_type, entity_id, event_type, metadata)
       VALUES ($1, $2, $3, $4)`,
            [entityType, entityId, eventType, metadata ? JSON.stringify(metadata) : null]
        );
    } catch (error) {
        console.error('Failed to track event:', error);
        // Don't throw - analytics failures shouldn't break the app
    }
}

/**
 * Increment view count
 */
export async function incrementViews(table: 'colleges' | 'clubs', id: number) {
    try {
        await query(
            `UPDATE ${table} SET views = views + 1 WHERE id = $1`,
            [id]
        );
    } catch (error) {
        console.error('Failed to increment views:', error);
    }
}
