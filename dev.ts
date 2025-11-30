'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/detect-disease-from-image.ts';
import '@/ai/flows/optimal-irrigation-recommendation.ts';
import '@/ai/flows/optimize-irrigation-zones.ts';
import '@/ai/flows/analyze-soil.ts';
