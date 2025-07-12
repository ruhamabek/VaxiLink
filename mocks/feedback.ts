import { Feedback } from "@/types/child";

export const mockFeedback: Feedback[] = [
  {
    id: "f1",
    userId: "c1",
    type: "clinic-issue",
    clinicId: "cl1",
    description: "The clinic was closed during the posted opening hours on Monday.",
    timestamp: "2023-06-20T10:30:00Z",
    status: "resolved",
  },
  {
    id: "f2",
    userId: "c1",
    type: "vaccine-unavailable",
    clinicId: "cl2",
    description: "Measles vaccine was not available when I visited.",
    timestamp: "2023-07-05T14:15:00Z",
    status: "in-review",
  },
  {
    id: "f3",
    userId: "c2",
    type: "service-quality",
    clinicId: "cl3",
    description: "The health worker was very helpful and explained everything clearly.",
    timestamp: "2023-07-10T11:45:00Z",
    status: "submitted",
  },
  {
    id: "f4",
    userId: "c3",
    type: "app-feedback",
    description: "The reminder feature is very helpful, but I would like to be able to customize the timing.",
    timestamp: "2023-07-15T09:20:00Z",
    status: "submitted",
  },
];