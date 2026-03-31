export type PlannerReview = {
  requestId: string;
  overallRating: number;
  planQuality: number;
  communication: number;
  timeliness: number;
  personalisation: number;
  practicality: number;
  detailLevel: number;
  content: string;
};

export type PlannerReviewSummary = {
  reviewCount: number;
  overallRatingAvg: number;
  planQualityAvg: number;
  communicationAvg: number;
  timelinessAvg: number;
  personalisationAvg: number;
  practicalityAvg: number;
  detailLevelAvg: number;
};

export type ReviewType = {
  id: string;
  overallRating: number;
  planQuality: number;
  practicality: number;
  detailLevel: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "submitted";
};
