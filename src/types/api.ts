export type UserRole = "traveller" | "planner";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: unknown;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Plan = {
  id: string;
  title: string;
  destination: string;
  price: number;
};

export type TripRequest = {
  id: string;
  destination: string;
  duration: string;
  budget: string;
  travelStyle: string;
  interests: string;
  extraNotes: string;
  requesterRole: UserRole;
};
