export type Dosha = "Vata" | "Pitta" | "Kapha";
export type DoshaType = "vata" | "pitta" | "kapha";

export interface Therapy {
  id: string;
  dosha: Dosha;
  name: string;
  description: string;
  duration: string;
  price: string;
  image?: string;
  benefits: string[];
  contraindications?: string[];
}

export interface Instruction {
  id: string;
  text: string;
  completed: boolean;
  hasAlert?: boolean;
  alertTime?: string;
  details?: string;
  tips?: string[];
}

export interface TherapySection {
  id: string;
  title: string;
  instructions: Instruction[];
}

export interface TherapyModule {
  id: string;
  name: string;
  clinic: string;
  scheduledDate: string;
  scheduledTime: string;
  dominantDosha: DoshaType;
  sections: TherapySection[];
  overallProgress: number;
  therapyId: string; // Links to the main therapy data
  bookingId?: string; // Links to the booking
}

export interface UserModule {
  id: string;
  userId: string;
  therapyModule: TherapyModule;
  createdAt: string;
  lastAccessed: string;
  completed: boolean;
}
