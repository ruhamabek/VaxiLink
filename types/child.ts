export interface Child {
  id: string;
  name: string;
  birthdate: string;
  gender: "male" | "female";
  photo?: string;
  caregiverId: string;
  vaccinations: Vaccination[];
  nextAppointment?: string;
}

export interface Vaccination {
  id: string;
  name: string;
  scheduledDate: string;
  administeredDate?: string;
  status: "completed" | "due" | "overdue" | "upcoming";
  location?: string;
  notes?: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  region: string;
  district: string;
  phone?: string;
  email?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  vaccinesAvailable: string[];
}

export interface VaccineInfo {
  id: string;
  name: string;
  description: string;
  ageAdministered: string;
  doses: number;
  protectsAgainst: string[];
  sideEffects: string[];
  imageUrl?: string;
  audioUrl?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: "text" | "reminder" | "notification";
}

export interface Reminder {
  id: string;
  childId: string;
  vaccinationId: string;
  dueDate: string;
  sent: boolean;
  acknowledged: boolean;
}

export interface Feedback {
  id: string;
  userId: string;
  type: "clinic-issue" | "vaccine-unavailable" | "service-quality" | "app-feedback" | "other";
  clinicId?: string;
  description: string;
  timestamp: string;
  status: "submitted" | "in-review" | "resolved";
}