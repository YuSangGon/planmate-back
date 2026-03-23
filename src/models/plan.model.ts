export type PlanVisibility = "public" | "private";

export type PlanModel = {
  id: string;
  requestId?: string | null;
  plannerId: string;
  travellerId?: string | null;

  title: string;
  destination: string;
  summary: string;
  price: number;
  duration: string;

  visibility: PlanVisibility;
  tags: string[];

  createdAt: string;
  updatedAt: string;
};
