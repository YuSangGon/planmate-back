export type PlanChangeSection =
  | "basic_info"
  | "overview"
  | "preparation"
  | "hotels"
  | "daily_timetable"
  | "extras";

export type UpdatePlanSectionInput = {
  section: PlanChangeSection;
  note: string;
  data: Record<string, unknown>;
};
