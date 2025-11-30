team name - zero error
  import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Bell,
  Bot,
  Camera,
  FileText,
  LayoutDashboard,
  Pipette,
  Settings,
  TrendingUp,
  Wind,
} from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Dashboard components
import RealTimeMonitoring from "@/components/dashboard/real-time-monitoring"
import AiPoweredRouting from "@/components/dashboard/ai-powered-routing"
import FlyAshQualityAnalyzer from "@/components/dashboard/fly-ash-quality-analyzer"
import AshDisposalForecast from "@/components/dashboard/ash-disposal-forecast"
import PipelineSimulation from "@/components/dashboard/pipeline-simulation"
import AutomatedReporting from "@/components/dashboard/automated-reporting"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <Wind className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-semibold">AshFlow Insights</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Bot />
                AI Routing
                <Badge variant="secondary" className="ml-auto">3</Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Camera />
                Quality Analysis
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <TrendingUp />
                Forecasting
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Pipette />
                Pipeline Sim
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FileText />
                Reports
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <RealTimeMonitoring />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AiPoweredRouting />
            </div>
            <AshDisposalForecast />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <FlyAshQualityAnalyzer />
            <PipelineSimulation />
            <AutomatedReporting />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
'use server';
/**
 * @fileOverview AI-powered routing flow for ash disposal.
 *
 * - aiPoweredRouting - A function that suggests the best ash disposal route.
 * - AIPoweredRoutingInput - The input type for the aiPoweredRouting function.
 * - AIPoweredRoutingOutput - The return type for the aiPoweredRouting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredRoutingInputSchema = z.object({
  dailyAshGenerated: z.number().describe('Daily ash generated in tons.'),
  siloLevelPercentage: z.number().describe('Current silo level as a percentage.'),
  pipelineLoadPercentage: z.number().describe('Current pipeline load as a percentage.'),
  availableRoutes: z.array(z.string()).describe('List of available disposal routes.'),
  historicalData: z.string().describe('Historical data about routes and disposal outcomes.'),
});
export type AIPoweredRoutingInput = z.infer<typeof AIPoweredRoutingInputSchema>;

const AIPoweredRoutingOutputSchema = z.object({
  bestRoute: z.string().describe('The suggested best disposal route.'),
  predictionScore: z.number().describe('A score indicating the confidence in the route selection.'),
  reasoning: z.string().describe('Explanation of why the route was selected.'),
});
export type AIPoweredRoutingOutput = z.infer<typeof AIPoweredRoutingOutputSchema>;

export async function aiPoweredRouting(input: AIPoweredRoutingInput): Promise<AIPoweredRoutingOutput> {
  return aiPoweredRoutingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredRoutingPrompt',
  input: {schema: AIPoweredRoutingInputSchema},
  output: {schema: AIPoweredRoutingOutputSchema},
  prompt: `You are an expert in logistics and waste management. Given the current conditions, you must select the best fly ash disposal route.

Current Conditions:
- Daily Ash Generated: {{dailyAshGenerated}} tons
- Silo Level: {{siloLevelPercentage}}%
- Pipeline Load: {{pipelineLoadPercentage}}%
- Available Routes: {{availableRoutes}}
- Historical Data: {{historicalData}}

Consider the following factors when selecting the best route:
- Minimizing environmental impact
- Reducing transportation costs
- Ensuring compliance with regulations
- Optimizing disposal efficiency

Based on this data, select the best route and provide a prediction score (0-100) and reasoning for your choice. Format your selection as a JSON object.
`,
});

const aiPoweredRoutingFlow = ai.defineFlow(
  {
    name: 'aiPoweredRoutingFlow',
    inputSchema: AIPoweredRoutingInputSchema,
    outputSchema: AIPoweredRoutingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
'use server';

/**
 * @fileOverview Predicts fly ash generation, silo fill times, and pipeline pressure levels for the next 24 hours.
 *
 * - ashDisposalForecast - Predicts fly ash generation, silo fill times, and pipeline pressure levels.
 * - AshDisposalForecastInput - The input type for the ashDisposalForecast function.
 * - AshDisposalForecastOutput - The return type for the ashDisposalForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AshDisposalForecastInputSchema = z.object({
  recentAshGenerationData: z.string().describe('Recent fly ash generation data in tons/hour.'),
  currentSiloLevelPercentage: z.number().describe('The current silo level as a percentage (0-100).'),
  currentPipelinePressure: z.number().describe('The current pipeline pressure in PSI.'),
  disposalRoute: z.string().describe('Current disposal route.'),
});
export type AshDisposalForecastInput = z.infer<typeof AshDisposalForecastInputSchema>;

const AshDisposalForecastOutputSchema = z.object({
  predictedAshGenerationNext24Hours: z
    .string()
    .describe('Predicted fly ash generation for the next 24 hours in tons.'),
  predictedSiloFillTime: z
    .string()
    .describe('Predicted time until the silo reaches full capacity.'),
  predictedPipelinePressureNext24Hours: z
    .string()
    .describe('Predicted pipeline pressure levels for the next 24 hours in PSI.'),
  suggestedActions: z.string().describe('Suggestions for action.'),
});
export type AshDisposalForecastOutput = z.infer<typeof AshDisposalForecastOutputSchema>;

export async function ashDisposalForecast(input: AshDisposalForecastInput): Promise<AshDisposalForecastOutput> {
  return ashDisposalForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ashDisposalForecastPrompt',
  input: {schema: AshDisposalForecastInputSchema},
  output: {schema: AshDisposalForecastOutputSchema},
  prompt: `You are an expert in predicting fly ash generation, silo fill times, and pipeline pressure levels in a power plant. Using the provided data, predict the next 24 hours of fly ash generation, estimate silo fill times, and forecast pipeline pressure levels. Recommend proactive measures to prevent overflows.

Recent Ash Generation Data: {{{recentAshGenerationData}}}
Current Silo Level: {{{currentSiloLevelPercentage}}}%
Current Pipeline Pressure: {{{currentPipelinePressure}}} PSI
Current Disposal Route: {{{disposalRoute}}}

Respond with predictedAshGenerationNext24Hours, predictedSiloFillTime, predictedPipelinePressureNext24Hours, and suggestedActions.
`,
});

const ashDisposalForecastFlow = ai.defineFlow(
  {
    name: 'ashDisposalForecastFlow',
    inputSchema: AshDisposalForecastInputSchema,
    outputSchema: AshDisposalForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
'use server';

/**
 * @fileOverview Analyzes fly ash images to determine carbon content and moisture level,
 * determining its suitability for cement, bricks, roads, or geo-polymer.
 *
 * - analyzeFlyAshQuality - A function that handles the fly ash quality analysis process.
 * - AnalyzeFlyAshQualityInput - The input type for the analyzeFlyAshQuality function.
 * - AnalyzeFlyAshQualityOutput - The return type for the analyzeFlyAshQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFlyAshQualityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of fly ash, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeFlyAshQualityInput = z.infer<typeof AnalyzeFlyAshQualityInputSchema>;

const AnalyzeFlyAshQualityOutputSchema = z.object({
  carbonContent: z
    .string()
    .describe('The detected carbon content (darkness) of the fly ash.'),
  moistureLevel: z.string().describe('The detected moisture level of the fly ash.'),
  suitability: z
    .string()
    .describe(
      'Suitable applications for the fly ash, such as cement, bricks, roads, or geo-polymer.'
    ),
});
export type AnalyzeFlyAshQualityOutput = z.infer<typeof AnalyzeFlyAshQualityOutputSchema>;

export async function analyzeFlyAshQuality(
  input: AnalyzeFlyAshQualityInput
): Promise<AnalyzeFlyAshQualityOutput> {
  return analyzeFlyAshQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFlyAshQualityPrompt',
  input: {schema: AnalyzeFlyAshQualityInputSchema},
  output: {schema: AnalyzeFlyAshQualityOutputSchema},
  prompt: `You are an expert material scientist specializing in analyzing fly ash quality.

You will analyze the provided image of fly ash to determine its carbon content, moisture level, and suitability for various applications.

Analyze the following fly ash image:

{{media url=photoDataUri}}

Based on your analysis, provide the carbon content (darkness), moisture level, and suitable applications for the fly ash.

Output in the following JSON format:
{
  "carbonContent": "<carbon content description>",
  "moistureLevel": "<moisture level description>",
  "suitability": "<suitable applications>"
}`,
});

const analyzeFlyAshQualityFlow = ai.defineFlow(
  {
    name: 'analyzeFlyAshQualityFlow',
    inputSchema: AnalyzeFlyAshQualityInputSchema,
    outputSchema: AnalyzeFlyAshQualityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

