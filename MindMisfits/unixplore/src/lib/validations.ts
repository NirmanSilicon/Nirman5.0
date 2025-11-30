import { z } from 'zod';

// College Registration Schema
export const collegeRegistrationSchema = z.object({
    name: z.string().min(3, 'College name must be at least 3 characters').max(255),
    location: z.string().min(3, 'Location is required').max(255),
    city: z.string().min(2).max(100).optional(),
    state: z.string().min(2).max(100).optional(),
    officialWebsite: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    officialEmail: z.string().email('Must be a valid email'),
    adminEmail: z.string().email('Must be a valid email'),
    adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CollegeRegistrationInput = z.infer<typeof collegeRegistrationSchema>;

// College Login Schema
export const collegeLoginSchema = z.object({
    email: z.string().email('Must be a valid email'),
    password: z.string().min(1, 'Password is required'),
});

export type CollegeLoginInput = z.infer<typeof collegeLoginSchema>;

// Club Registration Schema
export const clubRegistrationSchema = z.object({
    name: z.string().min(3, 'Club name must be at least 3 characters').max(255),
    collegeId: z.string().min(1, 'College selection is required'),
    email: z.string().email('Must be a valid email'),
    categoryId: z.number().int().positive('Category is required'),
    adminName: z.string().min(2, 'Admin name is required').max(255),
    adminEmail: z.string().email('Must be a valid email'),
    adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
    description: z.string().min(50, 'Description must be at least 50 characters').max(2000),
});

export type ClubRegistrationInput = z.infer<typeof clubRegistrationSchema>;

// Club Login Schema
export const clubLoginSchema = z.object({
    email: z.string().email('Must be a valid email'),
    password: z.string().min(1, 'Password is required'),
});

export type ClubLoginInput = z.infer<typeof clubLoginSchema>;

// Update College Schema
export const updateCollegeSchema = z.object({
    name: z.string().min(3).max(255).optional(),
    location: z.string().min(3).max(255).optional(),
    city: z.string().min(2).max(100).optional(),
    state: z.string().min(2).max(100).optional(),
    officialWebsite: z.string().url().optional().or(z.literal('')),
    officialEmail: z.string().email().optional(),
});

export type UpdateCollegeInput = z.infer<typeof updateCollegeSchema>;

// Update Club Schema
export const updateClubSchema = z.object({
    about: z.string().max(5000).optional(),
    contactInfo: z.object({
        email: z.string().email().optional(),
        phone: z.string().optional(),
        socialLinks: z.array(z.object({
            platform: z.string(),
            url: z.string().url(),
        })).optional(),
    }).optional(),
});

export type UpdateClubInput = z.infer<typeof updateClubSchema>;

// Announcement Schema
export const announcementSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(255),
    content: z.string().min(20, 'Content must be at least 20 characters'),
    published: z.boolean().default(true),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;

// Registration Schema
export const registrationSchema = z.object({
    title: z.string().min(5).max(255),
    description: z.string().max(1000).optional(),
    registrationLink: z.string().url('Must be a valid URL').optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    status: z.enum(['open', 'closed', 'upcoming']).default('open'),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
