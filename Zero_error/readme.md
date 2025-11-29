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
