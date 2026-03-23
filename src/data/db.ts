import type { UserModel } from "../models/user.model";
import type { RequestModel } from "../models/request.model";
import type { PlanModel } from "../models/plan.model";

export const db = {
  users: [] as UserModel[],
  requests: [] as RequestModel[],
  plans: [] as PlanModel[],
};
