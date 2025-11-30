import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(d);
}

/**
 * Get category color class
 */
export function getCategoryColor(categorySlug: string): string {
    const colors: Record<string, string> = {
        technical: 'bg-technical/10 text-technical border-technical/20',
        cultural: 'bg-cultural/10 text-cultural border-cultural/20',
        social: 'bg-social/10 text-social border-social/20',
        sports: 'bg-sports/10 text-sports border-sports/20',
        media: 'bg-media/10 text-media border-media/20',
    };
    return colors[categorySlug] || 'bg-gray-100 text-gray-800 border-gray-200';
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}
