export type RequestStatus =
  | "open"
  | "matched"
  | "in_progress"
  | "submitted"
  | "completed"
  | "cancelled";

export type RequestModel = {
  id: string;
  travellerId: string;
  plannerId?: string | null;

  destination: string;
  startDate?: string | null;
  endDate?: string | null;
  duration: string;
  budget: string;
  travelStyle: string;
  interests: string[];
  extraNotes?: string;

  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
};
