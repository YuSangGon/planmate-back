import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const travellerPassword = await bcrypt.hash("123456", 10);
  const plannerPassword = await bcrypt.hash("123456", 10);

  const traveller = await prisma.user.upsert({
    where: { email: "traveller@example.com" },
    update: {},
    create: {
      name: "Traveller User",
      email: "traveller@example.com",
      passwordHash: travellerPassword,
      role: "traveller",
      bio: "Loves travelling, hates planning.",
    },
  });

  const planner = await prisma.user.upsert({
    where: { email: "planner@example.com" },
    update: {},
    create: {
      name: "Planner User",
      email: "planner@example.com",
      passwordHash: plannerPassword,
      role: "planner",
      bio: "Enjoys building thoughtful itineraries.",
    },
  });

  const emma = await prisma.user.upsert({
    where: { email: "emma@example.com" },
    update: {},
    create: {
      name: "Emma",
      email: "emma@example.com",
      passwordHash: plannerPassword,
      role: "planner",
      bio: "Creates calm and thoughtful city plans with food, museums, and flexible pacing.",
      specialty: "Europe city itineraries",
      rating: 4.9,
      reviewCount: 124,
      location: "London, UK",
      responseRate: "96%",
      strengths: ["City breaks", "Museums", "Cafés", "Slow travel"],
    },
  });

  await prisma.user.upsert({
    where: { email: "daniel@example.com" },
    update: {},
    create: {
      name: "Daniel",
      email: "daniel@example.com",
      passwordHash: plannerPassword,
      role: "planner",
      bio: "Focuses on efficient routes, low-cost options, and practical choices for first-time travellers.",
      specialty: "Budget-friendly travel plans",
      rating: 4.8,
      reviewCount: 96,
    },
  });

  const sophie = await prisma.user.upsert({
    where: { email: "sophie@example.com" },
    update: {},
    create: {
      name: "Sophie",
      email: "sophie@example.com",
      passwordHash: plannerPassword,
      role: "planner",
      bio: "Designs travel around memorable meals, local cafés, and neighbourhood-based exploration.",
      specialty: "Food-focused travel routes",
      rating: 5.0,
      reviewCount: 141,
    },
  });

  await prisma.request.create({
    data: {
      travellerId: traveller.id,
      destination: "Edinburgh",
      duration: "4 days",
      budget: "£350",
      travelStyle: "calm, scenic",
      interests: ["cafés", "bookstores", "viewpoints"],
      extraNotes: "Not too packed",
      status: "open",
    },
  });

  await prisma.plan.create({
    data: {
      plannerId: planner.id,
      title: "3 Days in London",
      destination: "London",
      summary:
        "A relaxed city itinerary with cafés, museums, and riverside walks.",
      price: 18,
      duration: "3 days",
      visibility: "public",
      tags: ["city-break", "museum", "café"],
    },
  });

  await prisma.plannerReview.createMany({
    data: [
      {
        plannerId: emma.id,
        travellerId: traveller.id,
        rating: 5,
        content:
          "The itinerary felt realistic, calm, and very easy to follow. Exactly what I wanted.",
      },
      {
        plannerId: emma.id,
        travellerId: traveller.id,
        rating: 4,
        content:
          "Great city flow and lovely café suggestions. I would use Emma again.",
      },
      {
        plannerId: sophie.id,
        travellerId: traveller.id,
        rating: 5,
        content:
          "Amazing food-focused route. The neighbourhood suggestions were especially good.",
      },
    ],
  });

  await prisma.directProposal.create({
    data: {
      plannerId: emma.id,
      travellerId: traveller.id,
      title: "Calm 4-day Edinburgh trip",
      destination: "Edinburgh",
      duration: "4 days",
      budget: "GBP 350",
      travelStyle: "Scenic, Slow-paced",
      interests: ["Cafés", "Bookstores", "Viewpoints"],
      extraNotes: "I want something relaxed and not too packed.",
      message:
        "I really like your planning style and think you would be a great match for this trip.",
      status: "pending",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
