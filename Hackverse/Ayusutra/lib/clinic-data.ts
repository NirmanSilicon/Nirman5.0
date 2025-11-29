export interface Doctor {
  name: string
  specialization: string
  experience: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: string
}

export interface ClinicSubmission {
  id: string
  clinicName: string
  ownerName: string
  address: string
  nearbyCity: string
  distance: string
  googleMapsLocation: string
  photos: string[]
  doctors: Doctor[]
  services: Service[]
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  termsAccepted: boolean
}

export interface ClinicFormData {
  clinicName: string
  ownerName: string
  address: string
  nearbyCity: string
  distance: string
  googleMapsLocation: string
  photos: string[]
  doctors: Doctor[]
  services: Service[]
  termsAccepted: boolean
}

class ClinicDataManager {
  private static instance: ClinicDataManager

  private constructor() {}

  static getInstance(): ClinicDataManager {
    if (!ClinicDataManager.instance) {
      ClinicDataManager.instance = new ClinicDataManager()
    }
    return ClinicDataManager.instance
  }

  // Get all clinics by status
  getPendingClinics(): ClinicSubmission[] {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem("pendingClinics") || "[]")
  }

  getApprovedClinics(): ClinicSubmission[] {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem("approvedClinics") || "[]")
  }

  getRejectedClinics(): ClinicSubmission[] {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem("rejectedClinics") || "[]")
  }

  getAllClinics(): ClinicSubmission[] {
    return [...this.getPendingClinics(), ...this.getApprovedClinics(), ...this.getRejectedClinics()]
  }

  // Submit new clinic
  submitClinic(formData: ClinicFormData): string {
    const newClinic: ClinicSubmission = {
      id: Date.now().toString(),
      ...formData,
      status: "pending",
      submittedAt: new Date().toISOString(),
    }

    const existingClinics = this.getPendingClinics()
    const updatedClinics = [...existingClinics, newClinic]

    if (typeof window !== "undefined") {
      localStorage.setItem("pendingClinics", JSON.stringify(updatedClinics))
    }

    return newClinic.id
  }

  // Admin actions
  approveClinic(clinicId: string): boolean {
    const pendingClinics = this.getPendingClinics()
    const clinic = pendingClinics.find((c) => c.id === clinicId)

    if (!clinic) return false

    const updatedClinic: ClinicSubmission = {
      ...clinic,
      status: "approved",
      reviewedAt: new Date().toISOString(),
    }

    // Remove from pending
    const updatedPending = pendingClinics.filter((c) => c.id !== clinicId)

    // Add to approved
    const approvedClinics = this.getApprovedClinics()
    const updatedApproved = [...approvedClinics, updatedClinic]

    if (typeof window !== "undefined") {
      localStorage.setItem("pendingClinics", JSON.stringify(updatedPending))
      localStorage.setItem("approvedClinics", JSON.stringify(updatedApproved))
    }

    return true
  }

  rejectClinic(clinicId: string): boolean {
    const pendingClinics = this.getPendingClinics()
    const clinic = pendingClinics.find((c) => c.id === clinicId)

    if (!clinic) return false

    const updatedClinic: ClinicSubmission = {
      ...clinic,
      status: "rejected",
      reviewedAt: new Date().toISOString(),
    }

    // Remove from pending
    const updatedPending = pendingClinics.filter((c) => c.id !== clinicId)

    // Add to rejected
    const rejectedClinics = this.getRejectedClinics()
    const updatedRejected = [...rejectedClinics, updatedClinic]

    if (typeof window !== "undefined") {
      localStorage.setItem("pendingClinics", JSON.stringify(updatedPending))
      localStorage.setItem("rejectedClinics", JSON.stringify(updatedRejected))
    }

    return true
  }

  // Statistics
  getStats() {
    const pending = this.getPendingClinics().length
    const approved = this.getApprovedClinics().length
    const rejected = this.getRejectedClinics().length
    const total = pending + approved + rejected

    return {
      total,
      pending,
      approved,
      rejected,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
    }
  }

  // Validation helpers
  validateClinicForm(data: Partial<ClinicFormData>): string[] {
    const errors: string[] = []

    if (!data.clinicName?.trim()) errors.push("Clinic name is required")
    if (!data.ownerName?.trim()) errors.push("Owner name is required")
    if (!data.address?.trim()) errors.push("Address is required")
    if (!data.nearbyCity?.trim()) errors.push("Nearby city is required")
    if (!data.distance || Number.parseFloat(data.distance) <= 0) errors.push("Valid distance is required")

    if (!data.doctors || data.doctors.length === 0) {
      errors.push("At least one doctor is required")
    } else {
      data.doctors.forEach((doctor, index) => {
        if (!doctor.name?.trim()) errors.push(`Doctor ${index + 1} name is required`)
        if (!doctor.specialization?.trim()) errors.push(`Doctor ${index + 1} specialization is required`)
        if (!doctor.experience || Number.parseFloat(doctor.experience) <= 0)
          errors.push(`Doctor ${index + 1} valid experience is required`)
      })
    }

    if (!data.services || data.services.length === 0) {
      errors.push("At least one service is required")
    } else {
      data.services.forEach((service, index) => {
        if (!service.name?.trim()) errors.push(`Service ${index + 1} name is required`)
        if (!service.price || Number.parseFloat(service.price) <= 0)
          errors.push(`Service ${index + 1} valid price is required`)
      })
    }

    if (!data.termsAccepted) errors.push("Terms and conditions must be accepted")

    return errors
  }

  // Search and filter
  searchClinics(query: string, status?: ClinicSubmission["status"]): ClinicSubmission[] {
    let clinics: ClinicSubmission[]

    if (status) {
      switch (status) {
        case "pending":
          clinics = this.getPendingClinics()
          break
        case "approved":
          clinics = this.getApprovedClinics()
          break
        case "rejected":
          clinics = this.getRejectedClinics()
          break
        default:
          clinics = this.getAllClinics()
      }
    } else {
      clinics = this.getAllClinics()
    }

    if (!query.trim()) return clinics

    const searchTerm = query.toLowerCase()
    return clinics.filter(
      (clinic) =>
        clinic.clinicName.toLowerCase().includes(searchTerm) ||
        clinic.ownerName.toLowerCase().includes(searchTerm) ||
        clinic.nearbyCity.toLowerCase().includes(searchTerm) ||
        clinic.doctors.some(
          (doctor) =>
            doctor.name.toLowerCase().includes(searchTerm) || doctor.specialization.toLowerCase().includes(searchTerm),
        ) ||
        clinic.services.some((service) => service.name.toLowerCase().includes(searchTerm)) ||
        clinic.photos.some((photo) => photo.toLowerCase().includes(searchTerm)),
    )
  }
}

export const clinicDataManager = ClinicDataManager.getInstance()
