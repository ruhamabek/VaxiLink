export interface HomeVisit {
  id: string;
  childId: string;
  hewId: string;
  scheduledDate: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  completedDate?: string;
}

export interface HEWPerformance {
  id: string;
  hewId: string;
  month: string;
  year: string;
  childrenRegistered: number;
  homeVisitsScheduled: number;
  homeVisitsCompleted: number;
  vaccinationsRecorded: number;
  defaultersFollowedUp: number;
  syncRate: number;
}

export interface District {
  id: string;
  name: string;
  region: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  zeroDoseCount: number;
  totalChildren: number;
  coverageRate: number;
}

export const mockHomeVisits: HomeVisit[] = [
  {
    id: "hv1",
    childId: "c3",
    hewId: "h1",
    scheduledDate: "2023-07-15",
    status: "scheduled",
    notes: "Follow up on missed Penta1 vaccination",
  },
  {
    id: "hv2",
    childId: "c4",
    hewId: "h1",
    scheduledDate: "2023-07-16",
    status: "scheduled",
    notes: "Follow up on missed Penta2 vaccination",
  },
  {
    id: "hv3",
    childId: "c5",
    hewId: "h1",
    scheduledDate: "2023-07-17",
    status: "scheduled",
    notes: "Remind about upcoming Penta1 vaccination",
  },
  {
    id: "hv4",
    childId: "c1",
    hewId: "h1",
    scheduledDate: "2023-07-10",
    status: "completed",
    notes: "Reminded about upcoming Penta3 vaccination",
    completedDate: "2023-07-10",
  },
  {
    id: "hv5",
    childId: "c2",
    hewId: "h1",
    scheduledDate: "2023-07-12",
    status: "completed",
    notes: "Followed up on overdue Vitamin A supplementation",
    completedDate: "2023-07-12",
  },
];

export const mockHEWPerformance: HEWPerformance[] = [
  {
    id: "hp1",
    hewId: "h1",
    month: "January",
    year: "2023",
    childrenRegistered: 12,
    homeVisitsScheduled: 25,
    homeVisitsCompleted: 22,
    vaccinationsRecorded: 45,
    defaultersFollowedUp: 8,
    syncRate: 95,
  },
  {
    id: "hp2",
    hewId: "h1",
    month: "February",
    year: "2023",
    childrenRegistered: 10,
    homeVisitsScheduled: 30,
    homeVisitsCompleted: 28,
    vaccinationsRecorded: 50,
    defaultersFollowedUp: 10,
    syncRate: 98,
  },
  {
    id: "hp3",
    hewId: "h1",
    month: "March",
    year: "2023",
    childrenRegistered: 15,
    homeVisitsScheduled: 35,
    homeVisitsCompleted: 30,
    vaccinationsRecorded: 60,
    defaultersFollowedUp: 12,
    syncRate: 92,
  },
  {
    id: "hp4",
    hewId: "h1",
    month: "April",
    year: "2023",
    childrenRegistered: 8,
    homeVisitsScheduled: 28,
    homeVisitsCompleted: 25,
    vaccinationsRecorded: 40,
    defaultersFollowedUp: 7,
    syncRate: 96,
  },
  {
    id: "hp5",
    hewId: "h1",
    month: "May",
    year: "2023",
    childrenRegistered: 11,
    homeVisitsScheduled: 32,
    homeVisitsCompleted: 29,
    vaccinationsRecorded: 55,
    defaultersFollowedUp: 9,
    syncRate: 97,
  },
  {
    id: "hp6",
    hewId: "h1",
    month: "June",
    year: "2023",
    childrenRegistered: 13,
    homeVisitsScheduled: 34,
    homeVisitsCompleted: 31,
    vaccinationsRecorded: 58,
    defaultersFollowedUp: 11,
    syncRate: 94,
  },
];

export const mockDistricts: District[] = [
  {
    id: "d1",
    name: "Bole",
    region: "Addis Ababa",
    coordinates: {
      latitude: 8.9806,
      longitude: 38.7578,
    },
    zeroDoseCount: 15,
    totalChildren: 1200,
    coverageRate: 98.75,
  },
  {
    id: "d2",
    name: "Kirkos",
    region: "Addis Ababa",
    coordinates: {
      latitude: 9.0092,
      longitude: 38.7612,
    },
    zeroDoseCount: 8,
    totalChildren: 950,
    coverageRate: 99.16,
  },
  {
    id: "d3",
    name: "Adama",
    region: "Oromia",
    coordinates: {
      latitude: 8.5400,
      longitude: 39.2700,
    },
    zeroDoseCount: 45,
    totalChildren: 1800,
    coverageRate: 97.50,
  },
  {
    id: "d4",
    name: "Bahir Dar",
    region: "Amhara",
    coordinates: {
      latitude: 11.5742,
      longitude: 37.3614,
    },
    zeroDoseCount: 30,
    totalChildren: 1500,
    coverageRate: 98.00,
  },
  {
    id: "d5",
    name: "Hawassa",
    region: "SNNPR",
    coordinates: {
      latitude: 7.0500,
      longitude: 38.4700,
    },
    zeroDoseCount: 25,
    totalChildren: 1300,
    coverageRate: 98.08,
  },
  {
    id: "d6",
    name: "Dire Dawa",
    region: "Dire Dawa",
    coordinates: {
      latitude: 9.5930,
      longitude: 41.8661,
    },
    zeroDoseCount: 20,
    totalChildren: 1100,
    coverageRate: 98.18,
  },
  {
    id: "d7",
    name: "Mekelle",
    region: "Tigray",
    coordinates: {
      latitude: 13.4967,
      longitude: 39.4697,
    },
    zeroDoseCount: 60,
    totalChildren: 1400,
    coverageRate: 95.71,
  },
  {
    id: "d8",
    name: "Jimma",
    region: "Oromia",
    coordinates: {
      latitude: 7.6780,
      longitude: 36.8344,
    },
    zeroDoseCount: 35,
    totalChildren: 1600,
    coverageRate: 97.81,
  },
  {
    id: "d9",
    name: "Gondar",
    region: "Amhara",
    coordinates: {
      latitude: 12.6030,
      longitude: 37.4521,
    },
    zeroDoseCount: 28,
    totalChildren: 1350,
    coverageRate: 97.93,
  },
  {
    id: "d10",
    name: "Dessie",
    region: "Amhara",
    coordinates: {
      latitude: 11.1333,
      longitude: 39.6333,
    },
    zeroDoseCount: 22,
    totalChildren: 1250,
    coverageRate: 98.24,
  },
];