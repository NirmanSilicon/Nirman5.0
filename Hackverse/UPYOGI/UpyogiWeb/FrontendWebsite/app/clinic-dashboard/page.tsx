/* eslint-disable react/forbid-dom-props, @next/next/no-css-tags */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Stethoscope, 
  Calendar, 
  Settings, 
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  User,
  Activity,
  Heart,
  BarChart3,
  Filter,
  Download,
  Eye,
  Star,
  IndianRupee,
  Video
} from 'lucide-react';

interface ClinicData {
  clinic_id: string;
  clinic_name: string;
  owner_name: string;
  phone_number: string;
  email: string;
  address?: string;
  nearby_city?: string;
  status: string;
  created_at: string;
}

interface ApiClinic {
  clinic_id: string;
  clinic_name: string;
  owner_name: string;
  phone_number: string;
  email: string;
  status: string;
  created_at: string;
}

export default function ClinicDashboard() {
  const router = useRouter();
  const [clinicData, setClinicData] = useState<ClinicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [analyticsData] = useState({
    totalVisits: 1247,
    totalRevenue: 186500,
    avgSatisfaction: 4.2,
    totalPatients: 892,
    emergencyVisits: 156,
    regularVisits: 1091,
    cityDistribution: [
      { city: 'Bhubaneswar', visits: 157, percentage: 12.6 },
      { city: 'Cuttack', visits: 129, percentage: 10.3 },
      { city: 'Puri', visits: 127, percentage: 10.2 },
      { city: 'Rourkela', visits: 125, percentage: 10.0 },
      { city: 'Sambalpur', visits: 124, percentage: 9.9 },
      { city: 'Balasore', visits: 98, percentage: 7.9 },
      { city: 'Bhadrak', visits: 89, percentage: 7.1 },
      { city: 'Others', visits: 398, percentage: 32.0 }
    ],
    referralSources: [
      { source: 'Direct Walk-in', count: 996, percentage: 79.9 },
      { source: 'Online Booking', count: 186, percentage: 14.9 },
      { source: 'Referral', count: 65, percentage: 5.2 }
    ],
    diagnosisDistribution: [
      { diagnosis: 'Vata Imbalance', count: 196, percentage: 15.7 },
      { diagnosis: 'Pitta Imbalance', count: 156, percentage: 12.5 },
      { diagnosis: 'Kapha Imbalance', count: 125, percentage: 10.0 },
      { diagnosis: 'Digestive Issues', count: 98, percentage: 7.9 },
      { diagnosis: 'Stress & Anxiety', count: 87, percentage: 7.0 },
      { diagnosis: 'Skin Problems', count: 76, percentage: 6.1 },
      { diagnosis: 'Others', count: 509, percentage: 40.8 }
    ],
    departmentStats: [
      { department: 'Panchakarma', consultation: 45, waiting: 25 },
      { department: 'General Medicine', consultation: 30, waiting: 20 },
      { department: 'Skin Care', consultation: 35, waiting: 30 },
      { department: 'Digestive Health', consultation: 40, waiting: 35 },
      { department: 'Mental Wellness', consultation: 50, waiting: 40 }
    ],
    satisfactionScores: [
      { score: 5, count: 349, percentage: 28.0 },
      { score: 4, count: 312, percentage: 25.0 },
      { score: 3, count: 312, percentage: 25.0 },
      { score: 2, count: 274, percentage: 22.0 }
    ],
    screeningTests: [
      { test: 'Dosha Assessment', count: 289, percentage: 23.2 },
      { test: 'Tongue Analysis', count: 231, percentage: 18.5 },
      { test: 'Pulse Diagnosis', count: 222, percentage: 17.8 },
      { test: 'Skin Analysis', count: 184, percentage: 14.8 },
      { test: 'Hair Analysis', count: 131, percentage: 10.5 },
      { test: 'Others', count: 190, percentage: 15.2 }
    ]
  });

  useEffect(() => {
    // Check if clinic is logged in
    const clinicId = sessionStorage.getItem('clinicId');
    const clinicEmail = sessionStorage.getItem('clinicEmail');

    if (!clinicId || !clinicEmail) {
      router.push('/clinic-login');
      return;
    }

    // Fetch fresh clinic data from database
    loadClinicData(clinicId);

    // Set up periodic refresh to check for status updates
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing clinic data...');
      loadClinicData(clinicId);
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(refreshInterval);
  }, [router]);

  const loadClinicData = async (clinicId: string) => {
    try {
      setLoading(true);
      console.log(`[Dashboard] Loading clinic data for: ${clinicId}`);
      
      // Use the same API as admin - check all statuses
      const [pendingResponse, approvedResponse, rejectedResponse] = await Promise.all([
        fetch('/api/clinic/list?status=pending'),
        fetch('/api/clinic/list?status=approved'),
        fetch('/api/clinic/list?status=rejected')
      ]);

      const pendingData = await pendingResponse.json();
      const approvedData = await approvedResponse.json();
      const rejectedData = await rejectedResponse.json();

      console.log('Pending clinics:', pendingData.clinics?.length || 0);
      console.log('Approved clinics:', approvedData.clinics?.length || 0);
      console.log('Rejected clinics:', rejectedData.clinics?.length || 0);
      
      // Check if our specific clinic is in the approved list
      if (approvedData.success && approvedData.clinics) {
        const ourClinic = approvedData.clinics.find((c: ApiClinic) => c.clinic_id === clinicId);
        console.log(`[Dashboard] Looking for clinic ${clinicId} in approved list:`, ourClinic ? 'FOUND' : 'NOT FOUND');
        if (ourClinic) {
          console.log(`[Dashboard] Our clinic status: ${ourClinic.status}`);
        }
      }

      // Search for clinic in all statuses
      let clinic = null;
      if (pendingData.success) {
        clinic = pendingData.clinics.find((c: ApiClinic) => c.clinic_id === clinicId);
        if (clinic) {
          console.log(`[Dashboard] Found clinic in pending: ${clinic.status}`);
        }
      }
      
      if (!clinic && approvedData.success) {
        clinic = approvedData.clinics.find((c: ApiClinic) => c.clinic_id === clinicId);
        if (clinic) {
          console.log(`[Dashboard] Found clinic in approved: ${clinic.status}`);
        }
      }
      
      if (!clinic && rejectedData.success) {
        clinic = rejectedData.clinics.find((c: ApiClinic) => c.clinic_id === clinicId);
        if (clinic) {
          console.log(`[Dashboard] Found clinic in rejected: ${clinic.status}`);
        }
      }

      if (clinic) {
        console.log(`[Dashboard] Found clinic:`, clinic);
        console.log(`[Dashboard] Clinic status: ${clinic.status}`);
        setClinicData(clinic);
        sessionStorage.setItem('clinicStatus', clinic.status);
        console.log(`[Dashboard] Successfully loaded clinic data: ${clinic.status}`);
      } else {
        console.log(`[Dashboard] Clinic not found in any status for ID: ${clinicId}`);
        throw new Error('Clinic not found in any status');
      }
    } catch (error) {
      console.error('Error loading clinic data:', error);
      // Fallback to session data
      const clinicStatus = sessionStorage.getItem('clinicStatus');
      setClinicData({
        clinic_id: clinicId,
        clinic_name: 'Clinic Name (To be updated)',
        owner_name: 'Owner Name (To be updated)',
        phone_number: 'Phone (To be updated)',
        email: sessionStorage.getItem('clinicEmail') || '',
        status: clinicStatus || 'pending',
        created_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('clinicId');
    sessionStorage.removeItem('clinicEmail');
    sessionStorage.removeItem('clinicStatus');
    
    // Redirect to login
    router.push('/clinic-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading clinic dashboard...</span>
        </div>
      </div>
    );
  }

  if (!clinicData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>No Clinic Found</CardTitle>
            <CardDescription>
              No approved clinic data found. Please contact support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">{clinicData.clinic_name}</h1>
                <p className="text-sm text-muted-foreground">Clinic Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusBadge(clinicData.status)}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const clinicId = sessionStorage.getItem('clinicId');
                  if (clinicId) loadClinicData(clinicId);
                }}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Visit Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive analytics for your clinic operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div id="analytics-section" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analyticsData.totalVisits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{analyticsData.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analyticsData.avgSatisfaction}/5</div>
              <p className="text-xs text-muted-foreground">+0.3 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analyticsData.totalPatients}</div>
              <p className="text-xs text-muted-foreground">+45 new this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select 
            className="px-3 py-2 border rounded-md text-sm"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            title="Select time period"
            aria-label="Select time period"
          >
            <option value="all">All Time</option>
            <option value="month">Last Month</option>
            <option value="week">Last Week</option>
            <option value="today">Today</option>
          </select>
          <select 
            className="px-3 py-2 border rounded-md text-sm"
            title="Select department"
            aria-label="Select department"
          >
            <option value="all">All Departments</option>
            <option value="panchakarma">Panchakarma</option>
            <option value="general">General Medicine</option>
            <option value="skin">Skin Care</option>
          </select>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* City Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visit Distribution Across Cities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.cityDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 
                        index === 2 ? 'bg-yellow-500' : 
                        index === 3 ? 'bg-purple-500' : 
                        index === 4 ? 'bg-pink-500' : 'bg-gray-500'
                      }`} />
                      <span className="text-sm font-medium">{item.city}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{item.visits}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Referral Sources Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Referral Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.referralSources.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                      <span className="text-sm font-medium">{item.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{item.count}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Diagnosis Distribution %</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.diagnosisDistribution.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate flex-1">{item.diagnosis}</span>
                    <div className="text-right ml-2">
                      <div className="text-sm font-bold">{item.percentage}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Stats and Emergency Visits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department-wise Consultation and Waiting Times */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Department-wise Average Times (mins)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.departmentStats.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{dept.department}</span>
                      <div className="flex space-x-4 text-xs text-muted-foreground">
                        <span>Consult: {dept.consultation}m</span>
                        <span>Wait: {dept.waiting}m</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-blue-100 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(dept.consultation / 60) * 100}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-red-100 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(dept.waiting / 60) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Visits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emergency vs Regular Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">Regular Visits</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{analyticsData.regularVisits}</div>
                    <div className="text-xs text-muted-foreground">87.5%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium">Emergency Visits</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{analyticsData.emergencyVisits}</div>
                    <div className="text-xs text-muted-foreground">12.5%</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="flex h-4 rounded-full">
                      <div 
                        className="bg-green-500 rounded-l-full" 
                        // eslint-disable-next-line react/forbid-dom-props
                        style={{ width: '87.5%' }}
                      />
                      <div 
                        className="bg-red-500 rounded-r-full" 
                        // eslint-disable-next-line react/forbid-dom-props
                        style={{ width: '12.5%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Screening Tests and Satisfaction Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Screening Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Screening Tests Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.screeningTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 
                        index === 2 ? 'bg-yellow-500' : 
                        index === 3 ? 'bg-purple-500' : 
                        index === 4 ? 'bg-pink-500' : 'bg-gray-500'
                      }`} />
                      <span className="text-sm font-medium">{test.test}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{test.count}</div>
                      <div className="text-xs text-muted-foreground">{test.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Satisfaction Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patient Satisfaction Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.satisfactionScores.map((score, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        score.score === 5 ? 'bg-green-500' : 
                        score.score === 4 ? 'bg-blue-500' : 
                        score.score === 3 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium">{score.score} Stars</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{score.count}</div>
                      <div className="text-xs text-muted-foreground">{score.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Patient Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Recent Patient Activity</span>
            </CardTitle>
            <CardDescription>Latest patient assessments and appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sample Patient Activity */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Sradha</span>
                      <Badge variant="secondary" className="text-xs">New Patient</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Age: 22 | Female | Height: 165cm | Weight: 55kg</div>
                      <div>Assessment: Voice + Tongue + Hair + Face Analysis Complete</div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <Activity className="h-3 w-3" />
                        <span>Voice Assessment: Completed</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Stethoscope className="h-3 w-3" />
                        <span>Tongue Analysis: Completed</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>Hair Analysis: Completed</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Assessment Complete
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Completed: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {/* Dosha Analysis Display */}
                <div className="mt-4 p-3 bg-white rounded-lg border">
                  <h4 className="text-sm font-semibold mb-2">Dosha Analysis</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">45%</div>
                      <div className="text-xs text-muted-foreground">Vata</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">25%</div>
                      <div className="text-xs text-muted-foreground">Pitta</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">30%</div>
                      <div className="text-xs text-muted-foreground">Kapha</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <Badge variant="outline" className="text-xs">
                      Dominant: Vata
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View Full Report
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule Follow-up
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Additional Sample Activities */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Priya Sharma</span>
                      <Badge variant="outline" className="text-xs">Returning</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Age: 35 | Female | Next appointment: Tomorrow 2:00 PM
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Review
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Rajesh Kumar</span>
                      <Badge variant="outline" className="text-xs">New</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Age: 45 | Male | Assessment in progress
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-100 text-blue-800">
                      <Activity className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Bookings Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Recent Patient Bookings</span>
            </CardTitle>
            <CardDescription>Manage patient appointments and view assessment reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sample Patient Booking */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Tushar</span>
                      <Badge variant="secondary" className="text-xs">New Patient</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Age: 22 | Male | Height: 175cm | Weight: 70kg</div>
                      <div>Symptoms: Cough, Breathlessness | Stress Level: 3/5</div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <Activity className="h-3 w-3" />
                        <span>Voice Assessment: Completed</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Stethoscope className="h-3 w-3" />
                        <span>Tongue Analysis: Completed</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>Hair Fall Assessment: Completed</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Prescription Ready
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Assessment completed: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {/* Dosha Analysis Display */}
                <div className="mt-4 p-3 bg-white rounded-lg border">
                  <h4 className="text-sm font-semibold mb-2">Dosha Analysis</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">45%</div>
                      <div className="text-xs text-muted-foreground">Vata</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">25%</div>
                      <div className="text-xs text-muted-foreground">Pitta</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">30%</div>
                      <div className="text-xs text-muted-foreground">Kapha</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <Badge variant="outline" className="text-xs">
                      Dominant: Vata
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="flex-1">
                    <Stethoscope className="h-3 w-3 mr-1" />
                    View Full Report
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule Follow-up
                  </Button>
                  <Button size="sm" variant="outline">
                    <User className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Additional Sample Bookings */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Priya Sharma</span>
                      <Badge variant="outline" className="text-xs">Returning</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Age: 35 | Female | Next appointment: Tomorrow 2:00 PM
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Review
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Rajesh Kumar</span>
                      <Badge variant="outline" className="text-xs">New</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Age: 45 | Male | Assessment in progress
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-100 text-blue-800">
                      <Activity className="w-3 h-3 mr-1" />
                      In Progress
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Video Button */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Share Your Success</CardTitle>
            <CardDescription>Upload your best treatment video to inspire others</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => {
                console.log('Upload button clicked!');
                console.log('Clinic status:', clinicData.status);
                window.location.href = '/clinic-upload-video';
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-lg font-semibold"
              disabled={clinicData.status !== 'approved'}
            >
              <Video className="h-6 w-6 mr-3" />
              Upload Your Best Treatment Video
            </Button>
            <div className="mt-2">
              <div className="flex items-center justify-center space-x-2">
                <p className="text-sm text-gray-500">
                  Clinic Status: <span className={`font-semibold ${
                    clinicData.status === 'approved' ? 'text-green-600' : 
                    clinicData.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {clinicData.status.toUpperCase()}
                  </span>
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const clinicId = sessionStorage.getItem('clinicId');
                    if (clinicId) loadClinicData(clinicId);
                  }}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              {clinicData.status !== 'approved' && (
                <p className="text-sm text-red-500 mt-1">
                  Please wait for clinic approval to upload videos
                </p>
              )}
              {clinicData.status === 'approved' && (
                <p className="text-sm text-green-600 mt-1">
                  ✅ Your clinic is approved! You can now upload videos.
                </p>
              )}
            </div>
            
            {/* Debug and Test Buttons */}
            <div className="mt-4 space-y-2">
              <Button 
                onClick={() => {
                  console.log('Force refresh clicked!');
                  const clinicId = sessionStorage.getItem('clinicId');
                  if (clinicId) {
                    console.log('Force refreshing clinic data...');
                    loadClinicData(clinicId);
                  }
                }}
                variant="outline"
                className="text-sm mr-2"
              >
                Force Refresh Status
              </Button>
              <Button 
                onClick={() => {
                  console.log('Test button clicked!');
                  window.location.href = '/clinic-upload-video';
                }}
                variant="outline"
                className="text-sm"
              >
                Test Upload Page (Always Enabled)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your clinic management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors"
                disabled={clinicData.status !== 'approved'}
                onClick={() => {
                  console.log('Manage Patients clicked');
                  // TODO: Implement patient management functionality
                  alert('Patient management feature coming soon!');
                }}
              >
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Manage Patients</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center hover:bg-green-50 hover:border-green-300 transition-colors"
                disabled={clinicData.status !== 'approved'}
                onClick={() => {
                  console.log('Schedule Appointments clicked');
                  // TODO: Implement appointment scheduling functionality
                  alert('Appointment scheduling feature coming soon!');
                }}
              >
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-sm">Schedule Appointments</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-colors"
                disabled={clinicData.status !== 'approved'}
                onClick={() => {
                  console.log('View Analytics clicked');
                  // Scroll to analytics section
                  const analyticsSection = document.getElementById('analytics-section');
                  if (analyticsSection) {
                    analyticsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <BarChart3 className="h-6 w-6 mb-2" />
                <span className="text-sm">View Analytics</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center hover:bg-orange-50 hover:border-orange-300 transition-colors"
                disabled={clinicData.status !== 'approved'}
                onClick={() => {
                  console.log('Clinic Settings clicked');
                  // TODO: Implement clinic settings functionality
                  alert('Clinic settings feature coming soon!');
                }}
              >
                <Settings className="h-6 w-6 mb-2" />
                <span className="text-sm">Clinic Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
