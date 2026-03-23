-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('traveller', 'planner');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('open', 'matched', 'in_progress', 'delivered', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "PlanVisibility" AS ENUM ('public', 'private');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "travellerId" TEXT NOT NULL,
    "plannerId" TEXT,
    "destination" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "duration" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "travelStyle" TEXT NOT NULL,
    "interests" TEXT[],
    "extraNotes" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "requestId" TEXT,
    "plannerId" TEXT NOT NULL,
    "travellerId" TEXT,
    "title" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "visibility" "PlanVisibility" NOT NULL DEFAULT 'public',
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Request_travellerId_idx" ON "Request"("travellerId");

-- CreateIndex
CREATE INDEX "Request_plannerId_idx" ON "Request"("plannerId");

-- CreateIndex
CREATE INDEX "Request_status_idx" ON "Request"("status");

-- CreateIndex
CREATE INDEX "Plan_plannerId_idx" ON "Plan"("plannerId");

-- CreateIndex
CREATE INDEX "Plan_travellerId_idx" ON "Plan"("travellerId");

-- CreateIndex
CREATE INDEX "Plan_visibility_idx" ON "Plan"("visibility");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
