"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Heart,
  Activity,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Filter,
  PieChart,
  TrendingDown
} from "lucide-react"

// Mock data generators
const generatePatientProgressData = () => ({
  painLevel: [
    { session: 1, value: 8, date: "2024-01-01" },
    { session: 2, value: 7, date: "2024-01-08" },
    { session: 3, value: 6, date: "2024-01-15" },
    { session: 4, value: 5, date: "2024-01-22" },
    { session: 5, value: 4, date: "2024-01-29" },
    { session: 6, value: 3, date: "2024-02-05" },
  ],
  stressLevel: [
    { session: 1, value: 9, date: "2024-01-01" },
    { session: 2, value: 8, date: "2024-01-08" },
    { session: 3, value: 7, date: "2024-01-15" },
    { session: 4, value: 6, date: "2024-01-22" },
    { session: 5, value: 5, date: "2024-01-29" },
    { session: 6, value: 4, date: "2024-02-05" },
  ],
  energyScore: [
    { session: 1, value: 3, date: "2024-01-01" },
    { session: 2, value: 4, date: "2024-01-08" },
    { session: 3, value: 5, date: "2024-01-15" },
    { session: 4, value: 6, date: "2024-01-22" },
    { session: 5, value: 7, date: "2024-01-29" },
    { session: 6, value: 8, date: "2024-02-05" },
  ],
  symptomSeverity: [
    { session: 1, value: 8, date: "2024-01-01" },
    { session: 2, value: 7, date: "2024-01-08" },
    { session: 3, value: 6, date: "2024-01-15" },
    { session: 4, value: 5, date: "2024-01-22" },
    { session: 5, value: 4, date: "2024-01-29" },
    { session: 6, value: 3, date: "2024-02-05" },
  ]
})

const generateSessionCompletionData = () => ({
  completed: 78,
  droppedOut: 22,
  total: 100
})

const generateTherapyUtilizationData = () => ({
  vamana: { count: 45, percentage: 25 },
  virechana: { count: 38, percentage: 21 },
  basti: { count: 52, percentage: 29 },
  nasya: { count: 28, percentage: 16 },
  raktamokshana: { count: 15, percentage: 9 }
})

const generateFeedbackTrendsData = () => ({
  excellent: 45,
  good: 35,
  average: 15,
  poor: 5
})

const generateRevenueData = () => ({
  monthly: [
    { month: "Jan", revenue: 125000, sessions: 45 },
    { month: "Feb", revenue: 142000, sessions: 52 },
    { month: "Mar", revenue: 138000, sessions: 48 },
    { month: "Apr", revenue: 156000, sessions: 58 },
    { month: "May", revenue: 168000, sessions: 62 },
    { month: "Jun", revenue: 175000, sessions: 68 }
  ],
  pending: 25000,
  cancelled: 15000
})

const generateComplianceData = () => ({
  dietCompliance: 85,
  lifestyleCompliance: 72,
  medicationCompliance: 91,
  followUpCompliance: 78
})

// Chart Components
const LineChart = ({ data, title, color = "blue" }: { data: any[], title: string, color?: string }) => {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end justify-between">
        {data.map((point, index) => {
          const height = ((point.value - minValue) / (maxValue - minValue)) * 200
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className={`w-8 bg-${color}-500 rounded-t`}
                style={{ height: `${height}px` }}
              />
              <span className="text-xs text-gray-600">{point.session}</span>
              <span className="text-xs font-medium">{point.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const DonutChart = ({ data, title }: { data: any, title: string }) => {
  const { completed, droppedOut } = data
  const total = completed + droppedOut
  const completedPercentage = (completed / total) * 100
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="16"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#10b981"
              strokeWidth="16"
              strokeDasharray={`${(completedPercentage / 100) * 502.4} 502.4`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedPercentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm">Completed: {completed}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm">Dropped: {droppedOut}</span>
        </div>
      </div>
    </div>
  )
}

const BarChart = ({ data, title }: { data: any, title: string }) => {
  const maxCount = Math.max(...Object.values(data).map((d: any) => d.count))
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([therapy, info]: [string, any]) => {
          const height = (info.count / maxCount) * 200
          return (
            <div key={therapy} className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium capitalize">{therapy}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div 
                  className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(info.count / maxCount) * 100}%` }}
                >
                  <span className="text-white text-xs font-medium">{info.count}</span>
                </div>
              </div>
              <div className="w-12 text-sm text-gray-600">{info.percentage}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const SentimentChart = ({ data, title }: { data: any, title: string }) => {
  const total = Object.values(data).reduce((sum: number, val: any) => sum + val, 0)
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([sentiment, count]: [string, any]) => {
          const percentage = (count / total) * 100
          const color = sentiment === 'excellent' ? 'bg-green-500' : 
                       sentiment === 'good' ? 'bg-blue-500' :
                       sentiment === 'average' ? 'bg-yellow-500' : 'bg-red-500'
          
          return (
            <div key={sentiment} className="flex items-center space-x-4">
              <div className="w-20 text-sm font-medium capitalize">{sentiment}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div 
                  className={`${color} h-6 rounded-full flex items-center justify-end pr-2`}
                  style={{ width: `${percentage}%` }}
                >
                  <span className="text-white text-xs font-medium">{count}</span>
                </div>
              </div>
              <div className="w-12 text-sm text-gray-600">{percentage.toFixed(1)}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const RevenueChart = ({ data, title }: { data: any, title: string }) => {
  const maxRevenue = Math.max(...data.monthly.map((d: any) => d.revenue))
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end justify-between">
        {data.monthly.map((month: any, index: number) => {
          const height = (month.revenue / maxRevenue) * 200
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className="w-8 bg-green-500 rounded-t"
                style={{ height: `${height}px` }}
              />
              <span className="text-xs text-gray-600">{month.month}</span>
              <span className="text-xs font-medium">₹{month.revenue.toLocaleString()}</span>
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-sm text-yellow-800">Pending Payments</div>
          <div className="text-lg font-semibold text-yellow-900">₹{data.pending.toLocaleString()}</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-sm text-red-800">Cancelled Revenue</div>
          <div className="text-lg font-semibold text-red-900">₹{data.cancelled.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}

const ComplianceChart = ({ data, title }: { data: any, title: string }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-4">
        {Object.entries(data).map(([type, percentage]: [string, any]) => {
          const color = percentage >= 80 ? 'bg-green-500' : 
                       percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          
          return (
            <div key={type} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-sm text-gray-600">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`${color} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState("overview")
  const [visibleGraphs, setVisibleGraphs] = useState({
    patientProgress: true,
    sessionCompletion: true,
    therapyUtilization: true,
    feedbackTrends: true,
    revenueInsights: true,
    complianceTracking: true
  })
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("painLevel")

  // Mock data
  const patientProgressData = generatePatientProgressData()
  const sessionCompletionData = generateSessionCompletionData()
  const therapyUtilizationData = generateTherapyUtilizationData()
  const feedbackTrendsData = generateFeedbackTrendsData()
  const revenueData = generateRevenueData()
  const complianceData = generateComplianceData()

  const toggleGraph = (graphName: keyof typeof visibleGraphs) => {
    setVisibleGraphs(prev => ({
      ...prev,
      [graphName]: !prev[graphName]
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive insights for therapy effectiveness and business growth</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.href = "/admin"}>
                Back to Admin
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">78%</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹1.75L</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +8% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Satisfaction</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">4.2/5</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +0.3 from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Dashboard Controls
              </CardTitle>
              <CardDescription>Customize your analytics view and manage initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Graph Visibility Controls */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Graph Visibility</h4>
                  <div className="space-y-3">
                    {Object.entries(visibleGraphs).map(([graph, visible]) => (
                      <div key={graph} className="flex items-center justify-between">
                        <Label htmlFor={graph} className="capitalize">
                          {graph.replace(/([A-Z])/g, ' $1')}
                        </Label>
                        <Switch
                          id={graph}
                          checked={visible}
                          onCheckedChange={() => toggleGraph(graph as keyof typeof visibleGraphs)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Range */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Time Range</h4>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">Last Month</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                      <SelectItem value="1year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Metric Selection */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Patient Progress Metric</h4>
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="painLevel">Pain Level</SelectItem>
                      <SelectItem value="stressLevel">Stress Level</SelectItem>
                      <SelectItem value="energyScore">Energy Score</SelectItem>
                      <SelectItem value="symptomSeverity">Symptom Severity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="patient" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Patient Analytics
              </TabsTrigger>
              <TabsTrigger value="business" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Business Insights
              </TabsTrigger>
              <TabsTrigger value="initiatives" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Initiatives
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {visibleGraphs.sessionCompletion && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Session Completion Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DonutChart data={sessionCompletionData} title="" />
                    </CardContent>
                  </Card>
                )}

                {visibleGraphs.therapyUtilization && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Therapy Utilization
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BarChart data={therapyUtilizationData} title="" />
                    </CardContent>
                  </Card>
                )}

                {visibleGraphs.patientProgress && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Patient Progress Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LineChart 
                        data={patientProgressData[selectedMetric as keyof typeof patientProgressData]} 
                        title={`${selectedMetric.replace(/([A-Z])/g, ' $1')} Over Sessions`}
                        color="blue"
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Patient Analytics Tab */}
            <TabsContent value="patient" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {visibleGraphs.patientProgress && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Pain Level Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LineChart data={patientProgressData.painLevel} title="" color="red" />
                    </CardContent>
                  </Card>
                )}

                {visibleGraphs.patientProgress && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Stress Level Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LineChart data={patientProgressData.stressLevel} title="" color="orange" />
                    </CardContent>
                  </Card>
                )}

                {visibleGraphs.patientProgress && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Energy Score Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LineChart data={patientProgressData.energyScore} title="" color="green" />
                    </CardContent>
                  </Card>
                )}

                {visibleGraphs.complianceTracking && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Pre/Post Procedure Compliance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ComplianceChart data={complianceData} title="" />
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Business Insights Tab */}
            <TabsContent value="business" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {visibleGraphs.revenueInsights && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Revenue & Billing Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RevenueChart data={revenueData} title="" />
                    </CardContent>
                  </Card>
                )}

                {visibleGraphs.feedbackTrends && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Patient Feedback Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SentimentChart data={feedbackTrendsData} title="" />
                    </CardContent>
                  </Card>
                )}

                {visibleGraphs.therapyUtilization && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Weekly Therapy Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BarChart data={therapyUtilizationData} title="" />
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Initiatives Tab */}
            <TabsContent value="initiatives" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Therapy Quality Initiative
                    </CardTitle>
                    <CardDescription>Standardize therapy protocols across branches</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Protocol Compliance</span>
                      <Badge variant="secondary">85%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Staff Training</span>
                      <Badge variant="secondary">92%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quality Score</span>
                      <Badge variant="secondary">4.3/5</Badge>
                    </div>
                    <Button className="w-full">Launch Initiative</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Patient Engagement Initiative
                    </CardTitle>
                    <CardDescription>Improve patient retention and satisfaction</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Retention Rate</span>
                      <Badge variant="secondary">78%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Satisfaction Score</span>
                      <Badge variant="secondary">4.2/5</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Feedback Response</span>
                      <Badge variant="secondary">65%</Badge>
                    </div>
                    <Button className="w-full">Launch Initiative</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Operational Efficiency Initiative
                    </CardTitle>
                    <CardDescription>Optimize resource allocation and reduce wait times</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg. Wait Time</span>
                      <Badge variant="secondary">12 min</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cancellation Rate</span>
                      <Badge variant="secondary">8%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Resource Utilization</span>
                      <Badge variant="secondary">87%</Badge>
                    </div>
                    <Button className="w-full">Launch Initiative</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Management
                    </CardTitle>
                    <CardDescription>Configure automated patient communications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pre-procedure reminders</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Post-session feedback</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Compliance alerts</span>
                        <Switch />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">Configure Rules</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
