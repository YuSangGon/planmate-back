type WorkPlanHotelOption = {
  name: string;
  location: string;
  priceRange: string;
  bookingLink?: string;
  summary: string;
  pros: string[];
  cons: string[];
  recommended: boolean;
};

type WorkPlanScheduleItem = {
  startTime: string;
  endTime: string;
  place: string;
  title: string;
  description: string;
  fee: string;
  estimatedCost: string;
  transport: string;
  durationNote: string;
  tips: string;
};

type WorkPlanDay = {
  title: string;
  dateLabel: string;
  summary: string;
  items: WorkPlanScheduleItem[];
};

type WorkPlanContent = {
  overview?: {
    destinationSummary?: string;
    recommendedBudget?: string;
    bestFor?: string;
    notes?: string;
  };
  preparation?: {
    visaInfo?: string;
    documents?: string;
    transportToAirport?: string;
    simWifi?: string;
    moneyTips?: string;
    packingTips?: string;
    otherTips?: string;
  };
  hotels?: WorkPlanHotelOption[];
  days?: WorkPlanDay[];
  extras?: {
    localTransport?: string;
    reservations?: string;
    emergencyInfo?: string;
    finalNotes?: string;
  };
};

type PreviewScheduleSample = {
  dayTitle: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  place: string;
  title: string;
  description: string;
  fee: string;
  estimatedCost: string;
  transport: string;
  tips: string;
};

export type WorkPlanPreviewContent = {
  overview: {
    destinationSummary: string;
  } | null;
  preparation: {
    visaInfo: string;
    transportToAirport: string;
  } | null;
  recommendedHotel: {
    name: string;
    location: string;
    priceRange: string;
    summary: string;
    pros: string[];
    cons: string[];
  } | null;
  randomSamples: PreviewScheduleSample[];
};

function shuffleArray<T>(items: T[]) {
  const next = [...items];

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
}

export function buildFixedWorkPlanPreview(
  content: WorkPlanContent | null | undefined,
  sampleCount = 3,
): WorkPlanPreviewContent {
  if (!content) {
    return {
      overview: null,
      preparation: null,
      recommendedHotel: null,
      randomSamples: [],
    };
  }

  const flattenedSamples: PreviewScheduleSample[] = (
    content.days ?? []
  ).flatMap((day) =>
    (day.items ?? []).map((item) => ({
      dayTitle: day.title ?? "",
      dateLabel: day.dateLabel ?? "",
      startTime: item.startTime ?? "",
      endTime: item.endTime ?? "",
      place: item.place ?? "",
      title: item.title ?? "",
      description: item.description ?? "",
      fee: item.fee ?? "",
      estimatedCost: item.estimatedCost ?? "",
      transport: item.transport ?? "",
      tips: item.tips ?? "",
    })),
  );

  const validSamples = flattenedSamples.filter(
    (item) => item.title.trim() || item.place.trim() || item.description.trim(),
  );

  const randomSamples = shuffleArray(validSamples).slice(0, sampleCount);

  const recommendedHotel =
    (content.hotels ?? []).find((hotel) => hotel.recommended) ??
    (content.hotels ?? [])[0] ??
    null;

  return {
    overview: content.overview?.destinationSummary
      ? {
          destinationSummary: content.overview.destinationSummary,
        }
      : null,

    preparation:
      content.preparation?.visaInfo || content.preparation?.transportToAirport
        ? {
            visaInfo: content.preparation?.visaInfo ?? "",
            transportToAirport: content.preparation?.transportToAirport ?? "",
          }
        : null,

    recommendedHotel: recommendedHotel
      ? {
          name: recommendedHotel.name,
          location: recommendedHotel.location,
          priceRange: recommendedHotel.priceRange,
          summary: recommendedHotel.summary,
          pros: recommendedHotel.pros ?? [],
          cons: recommendedHotel.cons ?? [],
        }
      : null,

    randomSamples,
  };
}
