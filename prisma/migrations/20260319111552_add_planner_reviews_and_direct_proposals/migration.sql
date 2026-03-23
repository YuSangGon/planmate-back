-- CreateEnum
CREATE TYPE "DirectProposalStatus" AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- CreateTable
CREATE TABLE "PlannerReview" (
    "id" TEXT NOT NULL,
    "plannerId" TEXT NOT NULL,
    "travellerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannerReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectProposal" (
    "id" TEXT NOT NULL,
    "plannerId" TEXT NOT NULL,
    "travellerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "travelStyle" TEXT NOT NULL,
    "interests" TEXT[],
    "extraNotes" TEXT,
    "message" TEXT NOT NULL,
    "status" "DirectProposalStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlannerReview_plannerId_idx" ON "PlannerReview"("plannerId");

-- CreateIndex
CREATE INDEX "PlannerReview_travellerId_idx" ON "PlannerReview"("travellerId");

-- CreateIndex
CREATE INDEX "DirectProposal_plannerId_idx" ON "DirectProposal"("plannerId");

-- CreateIndex
CREATE INDEX "DirectProposal_travellerId_idx" ON "DirectProposal"("travellerId");

-- AddForeignKey
ALTER TABLE "PlannerReview" ADD CONSTRAINT "PlannerReview_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannerReview" ADD CONSTRAINT "PlannerReview_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectProposal" ADD CONSTRAINT "DirectProposal_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectProposal" ADD CONSTRAINT "DirectProposal_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
