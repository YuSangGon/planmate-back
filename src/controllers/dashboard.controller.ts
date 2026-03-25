import type { Request, Response } from "express";
import { getSentProposalsForPlanner } from "../services/proposal.service";
import { getReceivedDirectProposalsForPlanner } from "../services/directProposal.service";
import { getPlansForPlanner } from "../services/plan.service";
// import { getReceivedReviewsForPlanner } from "../services/review.service";

export async function getPlannerSentProposals(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const data = await getSentProposalsForPlanner(plannerId);

  res.json({
    success: true,
    data,
  });
}

export async function getPlannerReceivedDirectProposals(
  req: Request,
  res: Response,
) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const data = await getReceivedDirectProposalsForPlanner(plannerId);

  res.json({
    success: true,
    data,
  });
}

export async function getPlannerOwnPlans(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const data = await getPlansForPlanner(plannerId);

  res.json({
    success: true,
    data,
  });
}

// export async function getPlannerReceivedReviews(req: Request, res: Response) {
//   const plannerId = req.auth?.sub;

//   if (!plannerId) {
//     res.status(401).json({
//       success: false,
//       message: "Unauthorized",
//     });
//     return;
//   }

//   const data = await getReceivedReviewsForPlanner(plannerId);

//   res.json({
//     success: true,
//     data,
//   });
// }
