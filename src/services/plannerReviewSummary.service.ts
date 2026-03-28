import { prisma } from "../lib/prisma";

function buildStrengths(input: {
  planQuality: number;
  communication: number;
  timeliness: number;
  personalisation: number;
  practicality: number;
  detailLevel: number;
}) {
  const candidates = [
    { key: "High-quality plans", value: input.planQuality },
    { key: "Great communication", value: input.communication },
    { key: "On-time delivery", value: input.timeliness },
    { key: "Highly personalised", value: input.personalisation },
    { key: "Practical planning", value: input.practicality },
    { key: "Detailed guidance", value: input.detailLevel },
  ];

  return candidates
    .filter((item) => item.value >= 4.5)
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map((item) => item.key)
    .join(", ");
}

function toFixedNumber(value: number | null | undefined, digits = 1) {
  if (value == null) return 0;
  return Number(value.toFixed(digits));
}

export async function refreshPlannerReviewSummary(userId: string) {
  const aggregate = await prisma.plannerReview.aggregate({
    where: {
      plannerId: userId,
    },
    _count: {
      id: true,
    },
    _avg: {
      overallRating: true,
      planQuality: true,
      communication: true,
      timeliness: true,
      personalisation: true,
      practicality: true,
      detailLevel: true,
    },
  });

  const reviewCount = aggregate._count.id ?? 0;

  const rating = toFixedNumber(aggregate._avg.overallRating);
  const planQuality = toFixedNumber(aggregate._avg.planQuality);
  const communication = toFixedNumber(aggregate._avg.communication);
  const timeliness = toFixedNumber(aggregate._avg.timeliness);
  const personalisation = toFixedNumber(aggregate._avg.personalisation);
  const practicality = toFixedNumber(aggregate._avg.practicality);
  const detailLevel = toFixedNumber(aggregate._avg.detailLevel);

  const strengths =
    reviewCount === 0
      ? ""
      : buildStrengths({
          planQuality,
          communication,
          timeliness,
          personalisation,
          practicality,
          detailLevel,
        });

  const summary = await prisma.plannerReviewSummary.upsert({
    where: { userId },
    update: {
      reviewCount,
      rating,
      planQuality,
      communication,
      timeliness,
      personalisation,
      practicality,
      detailLevel,
      strengths,
    },
    create: {
      userId,
      reviewCount,
      rating,
      planQuality,
      communication,
      timeliness,
      personalisation,
      practicality,
      detailLevel,
      strengths,
    },
  });

  return summary;
}
