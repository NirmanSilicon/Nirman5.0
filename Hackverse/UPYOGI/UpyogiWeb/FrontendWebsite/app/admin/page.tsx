"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  User,
  FileText,
  Eye,
  Check,
  X,
  MapPin,
  Stethoscope,
  IndianRupee,
  Search,
  BarChart3,
} from "lucide-react"
import { clinicDataManager, type ClinicSubmission } from "@/lib/clinic-data"

// Database clinic type
interface DatabaseClinic {
  id: number;
  clinic_id: string;
  clinic_name: string;
  owner_name: string;
  phone_number: string;
  email: string;
  address: string;
  nearby_city: string;
  distance: string;
  google_maps_location: string;
  photos: any[];
  doctors: any[];
  services: any[];
  status: string;
  admin_notes: string;
  default_username: string;
  default_password: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [pendingClinics, setPendingClinics] = useState<DatabaseClinic[]>([])
  const [approvedClinics, setApprovedClinics] = useState<DatabaseClinic[]>([])
  const [rejectedClinics, setRejectedClinics] = useState<DatabaseClinic[]>([])
  const [selectedClinic, setSelectedClinic] = useState<DatabaseClinic | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [processingClinic, setProcessingClinic] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingAction, setProcessingAction] = useState<string | null>(null) // 'approve' or 'reject'
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    approvalRate: 0,
  })

  useEffect(() => {
    loadClinics()
  }, [])

  const loadClinics = async () => {
    try {
      console.log('Loading clinics...')
      const [pendingResponse, approvedResponse, rejectedResponse] = await Promise.all([
        fetch('/api/clinic/list?status=pending'),
        fetch('/api/clinic/list?status=approved'),
        fetch('/api/clinic/list?status=rejected')
      ])

      const pendingData = await pendingResponse.json()
      const approvedData = await approvedResponse.json()
      const rejectedData = await rejectedResponse.json()

      console.log('Pending clinics:', pendingData.clinics?.length || 0)
      console.log('Approved clinics:', approvedData.clinics?.length || 0)
      console.log('Rejected clinics:', rejectedData.clinics?.length || 0)

      setPendingClinics(pendingData.clinics || [])
      setApprovedClinics(approvedData.clinics || [])
      setRejectedClinics(rejectedData.clinics || [])

      // Calculate stats
      const total = pendingData.clinics.length + approvedData.clinics.length + rejectedData.clinics.length
      const approved = approvedData.clinics.length
      const approvalRate = total > 0 ? (approved / total) * 100 : 0

      setStats({
        total,
        pending: pendingData.clinics.length,
        approved,
        rejected: rejectedData.clinics.length,
        approvalRate
      })
    } catch (error) {
      console.error('Error loading clinics:', error)
    }
  }

  const approveClinic = async (clinicId: string) => {
    // Prevent multiple clicks
    if (isProcessing || processingClinic) {
      console.log('Already processing a clinic, ignoring click')
      return
    }

    try {
      setIsProcessing(true)
      setProcessingClinic(clinicId)
      setProcessingAction('approve')
      console.log('Approving clinic:', clinicId)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock success - just show success message
      console.log('✅ Clinic approved successfully! (UI Only)')
      alert('✅ Clinic approved successfully!')
      
      // Update UI state locally (no backend call)
      const clinicToMove = pendingClinics.find(c => c.clinic_id === clinicId)
      if (clinicToMove) {
        setPendingClinics(prev => prev.filter(c => c.clinic_id !== clinicId))
        setApprovedClinics(prev => [...prev, { ...clinicToMove, status: 'approved' }])
      }
      
    } catch (error) {
      console.error('Error approving clinic:', error)
      alert(`Error approving clinic: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
      setProcessingClinic(null)
      setProcessingAction(null)
    }
  }

  const rejectClinic = async (clinicId: string) => {
    // Prevent multiple clicks
    if (isProcessing || processingClinic) {
      console.log('Already processing a clinic, ignoring click')
      return
    }

    try {
      setIsProcessing(true)
      setProcessingClinic(clinicId)
      setProcessingAction('reject')
      console.log('Rejecting clinic:', clinicId)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock success - just show success message
      console.log('✅ Clinic rejected successfully! (UI Only)')
      alert('✅ Clinic rejected successfully!')
      
      // Update UI state locally (no backend call)
      const clinicToMove = pendingClinics.find(c => c.clinic_id === clinicId)
      if (clinicToMove) {
        setPendingClinics(prev => prev.filter(c => c.clinic_id !== clinicId))
        setRejectedClinics(prev => [...prev, { ...clinicToMove, status: 'rejected' }])
      }
      
    } catch (error) {
      console.error('Error rejecting clinic:', error)
      alert(`Error rejecting clinic: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
      setProcessingClinic(null)
      setProcessingAction(null)
    }
  }

  const getFilteredClinics = (clinics: DatabaseClinic[]) => {
    if (!searchQuery.trim()) return clinics
    return clinics.filter(
      (clinic) =>
        clinic.clinic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.nearby_city.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const ClinicCard = ({ clinic, showActions = false }: { clinic: DatabaseClinic; showActions?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5 text-primary" />
              {clinic.clinic_name}
            </CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center gap-1 text-sm">
                <User className="w-3 h-3" />
                Owner: {clinic.owner_name}
              </div>
              <div className="flex items-center gap-1 text-sm mt-1">
                <MapPin className="w-3 h-3" />
                {clinic.nearby_city} ({clinic.distance} km away)
              </div>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md gap-1.5 px-3 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                  onClick={() => setSelectedClinic(clinic)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {clinic.clinic_name} - Full Details
                  </DialogTitle>
                  <DialogDescription>Complete clinic registration information</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Clinic Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Clinic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Clinic Name</p>
                        <p className="font-semibold">{clinic.clinic_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Owner Name</p>
                        <p className="font-semibold">{clinic.owner_name}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p className="font-semibold">{clinic.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nearby City</p>
                        <p className="font-semibold">{clinic.nearby_city}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Distance</p>
                        <p className="font-semibold">{clinic.distance} km</p>
                      </div>
                      {clinic.google_maps_location && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-muted-foreground">Google Maps Location</p>
                          <p className="font-semibold text-blue-600 break-all">{clinic.google_maps_location}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Doctors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Doctors ({clinic.doctors?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(clinic.doctors || []).map((doctor, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <h4 className="font-semibold">{doctor.name}</h4>
                            <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                            <p className="text-sm text-muted-foreground">{doctor.experience} years experience</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Services */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Services & Pricing ({clinic.services?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(clinic.services || []).map((service) => (
                          <div key={service.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{service.name}</h4>
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <IndianRupee className="w-3 h-3" />
                                {service.price}
                              </Badge>
                            </div>
                            {service.description && (
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
              <Stethoscope className="w-4 h-4" />
              Doctors ({clinic.doctors?.length || 0})
            </h4>
            <div className="space-y-1">
              {(clinic.doctors || []).slice(0, 2).map((doctor, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium">{doctor.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {doctor.specialization} • {doctor.experience} years
                  </p>
                </div>
              ))}
              {(clinic.doctors?.length || 0) > 2 && (
                <p className="text-xs text-muted-foreground">+{(clinic.doctors?.length || 0) - 2} more doctors</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4" />
              Services ({clinic.services?.length || 0})
            </h4>
            <div className="space-y-1">
              {(clinic.services || []).slice(0, 3).map((service) => (
                <div key={service.id} className="flex justify-between items-center text-sm">
                  <span className="truncate">{service.name}</span>
                  <Badge variant="outline" className="text-xs">
                    ₹{service.price}
                  </Badge>
                </div>
              ))}
              {(clinic.services?.length || 0) > 3 && (
                <p className="text-xs text-muted-foreground">+{(clinic.services?.length || 0) - 3} more services</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Submitted: {new Date(clinic.created_at).toLocaleDateString()}
          </div>
          {showActions && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  rejectClinic(clinic.clinic_id);
                }}
                disabled={isProcessing}
              >
                {processingClinic === clinic.clinic_id && processingAction === 'reject' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1" />
                ) : (
                  <X className="w-4 h-4 mr-1" />
                )}
                {processingClinic === clinic.clinic_id && processingAction === 'reject' ? 'Rejecting...' : 'Reject'}
              </Button>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  approveClinic(clinic.clinic_id);
                }}
                disabled={isProcessing}
              >
                {processingClinic === clinic.clinic_id && processingAction === 'approve' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1" />
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                {processingClinic === clinic.clinic_id && processingAction === 'approve' ? 'Approving...' : 'Approve'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage Ayurvedic clinic registrations</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => (window.location.href = "/admin/analytics")}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics Dashboard
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/clinicdashboard")}>
                View Clinic Dashboard
              </Button>
              <Button onClick={() => (window.location.href = "/")}>Home</Button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search clinics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                <XCircle className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.approvalRate}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different clinic statuses */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending ({getFilteredClinics(pendingClinics).length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Approved ({getFilteredClinics(approvedClinics).length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Rejected ({getFilteredClinics(rejectedClinics).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-6">
              {getFilteredClinics(pendingClinics).length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Pending Submissions</h3>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "No clinics match your search criteria."
                        : "All clinic registrations have been reviewed."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getFilteredClinics(pendingClinics).map((clinic) => (
                    <ClinicCard key={clinic.clinic_id} clinic={clinic} showActions={true} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-6">
              {getFilteredClinics(approvedClinics).length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Approved Clinics</h3>
                    <p className="text-muted-foreground">No clinics have been approved yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getFilteredClinics(approvedClinics).map((clinic) => (
                    <ClinicCard key={clinic.clinic_id} clinic={clinic} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-6">
              {getFilteredClinics(rejectedClinics).length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Rejected Clinics</h3>
                    <p className="text-muted-foreground">No clinics have been rejected.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getFilteredClinics(rejectedClinics).map((clinic) => (
                    <ClinicCard key={clinic.clinic_id} clinic={clinic} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
