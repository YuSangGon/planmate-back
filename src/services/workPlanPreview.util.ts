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
  preparation: {
    visaInfo?: string;
    documents?: string;
    transportToAirport?: string;
    simWifi?: string;
    moneyTips?: string;
    packingTips?: string;
    otherTips?: string;
  };
  hotels: WorkPlanHotelOption[];
  days: WorkPlanDay[];
  extras: {
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
  preparation: {
    visaInfo?: string;
    documents?: string;
    transportToAirport?: string;
    simWifi?: string;
    moneyTips?: string;
    packingTips?: string;
    otherTips?: string;
  };
  hotels: WorkPlanHotelOption[];
  days: WorkPlanDay[];
  extras: {
    localTransport?: string;
    reservations?: string;
    emergencyInfo?: string;
    finalNotes?: string;
  };
};

export function pickRandomFields<T extends Record<string, any>>(
  obj: T,
  count: number,
): Partial<T> {
  const keys = Object.keys(obj) as (keyof T)[];

  if (count > keys.length) {
    throw new Error("count cannot be greater than number of keys");
  }

  // Fisher–Yates shuffle
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }

  const selectedKeys = keys.slice(0, count);
  const result: Partial<T> = {};

  selectedKeys.forEach((key) => {
    result[key] = obj[key];
  });

  return result;
}

export function getRandomIndices(arrayLength: number, count: number): number[] {
  if (count > arrayLength) {
    throw new Error("count cannot be greater than array length");
  }

  const indices = Array.from({ length: arrayLength }, (_, i) => i);

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices.slice(0, count);
}

export function createPreviewHotels(
  hotels: WorkPlanHotelOption[],
  visibleIndices: number[],
): WorkPlanHotelOption[] {
  const visibleSet = new Set(visibleIndices);

  return hotels.map((hotel, index) => {
    if (visibleSet.has(index)) {
      const selectedHotelFields = pickRandomFields(hotel, 5);
      return {
        name: "",
        location: "",
        priceRange: "",
        bookingLink: "",
        summary: "",
        pros: [],
        cons: [],
        recommended: false,
        ...selectedHotelFields,
      };
    }

    return {
      name: "",
      location: "",
      priceRange: "",
      bookingLink: "",
      summary: "",
      pros: [],
      cons: [],
      recommended: false,
    };
  });
}

export function createPreviewDays(
  days: WorkPlanDay[],
  visibleIndices: number[],
  itemCount = 2,
): WorkPlanDay[] {
  const visibleSet = new Set(visibleIndices);

  return days.map((day, index) => {
    // 선택된 day
    if (visibleSet.has(index)) {
      const itemIndices = getRandomIndices(
        day.items.length,
        Math.min(itemCount, day.items.length),
      );

      const visibleItemSet = new Set(itemIndices);

      const previewItems = day.items.map((item, itemIndex) => {
        if (visibleItemSet.has(itemIndex)) {
          return item;
        }

        return {
          startTime: "",
          endTime: "",
          place: "",
          title: "",
          description: "",
          fee: "",
          estimatedCost: "",
          transport: "",
          durationNote: "",
          tips: "",
        };
      });

      return {
        title: day.title,
        dateLabel: day.dateLabel,
        summary: day.summary,
        items: previewItems,
      };
    }

    const dummyItem = {
      startTime: "",
      endTime: "",
      place: "",
      title: "",
      description: "",
      fee: "",
      estimatedCost: "",
      transport: "",
      durationNote: "",
      tips: "",
    };

    const itemsToRender = Array.from(
      { length: day.items.length },
      () => dummyItem,
    );

    return {
      title: day.title,
      dateLabel: day.dateLabel,
      summary: "",
      items: itemsToRender,
    };
  });
}

export function buildFixedWorkPlanPreview(
  content: WorkPlanContent | null | undefined,
): WorkPlanPreviewContent {
  if (!content) {
    return {
      preparation: {
        visaInfo: "",
        documents: "",
        transportToAirport: "",
        simWifi: "",
        moneyTips: "",
        packingTips: "",
        otherTips: "",
      },
      hotels: [],
      days: [],
      extras: {
        localTransport: "",
        reservations: "",
        emergencyInfo: "",
        finalNotes: "",
      },
    };
  }

  const selectedPreparation = pickRandomFields(content.preparation, 3);
  const previewHotelList = getRandomIndices(content.hotels.length, 1);
  const previewExtras = pickRandomFields(content.extras, 1);
  const previewDayList = getRandomIndices(content.days.length, 1);

  return {
    preparation: {
      visaInfo: "",
      documents: "",
      transportToAirport: "",
      simWifi: "",
      moneyTips: "",
      packingTips: "",
      otherTips: "",
      ...selectedPreparation,
    },
    hotels: createPreviewHotels(content.hotels, previewHotelList),
    days: createPreviewDays(content.days, previewDayList, 2),
    extras: {
      localTransport: "",
      reservations: "",
      emergencyInfo: "",
      finalNotes: "",
      ...previewExtras,
    },
  };
}
