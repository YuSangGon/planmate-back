/*
  Warnings:

  - The values [withdrawn] on the enum `MatchProposalStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReviewSummary` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('request', 'personal');

-- AlterEnum
BEGIN;
CREATE TYPE "MatchProposalStatus_new" AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
ALTER TABLE "public"."MatchProposal" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "MatchProposal" ALTER COLUMN "status" TYPE "MatchProposalStatus_new" USING ("status"::text::"MatchProposalStatus_new");
ALTER TYPE "MatchProposalStatus" RENAME TO "MatchProposalStatus_old";
ALTER TYPE "MatchProposalStatus_new" RENAME TO "MatchProposalStatus";
DROP TYPE "public"."MatchProposalStatus_old";
ALTER TABLE "MatchProposal" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_plannerId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_requestId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_travellerId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewSummary" DROP CONSTRAINT "ReviewSummary_userId_fkey";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "planType" "PlanType" NOT NULL DEFAULT 'personal';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "ReviewSummary";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "PlannerReviewSummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "planQuality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "communication" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "timeliness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "personalisation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "practicality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "detailLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "strengths" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannerReviewSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannerReview" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "travellerId" TEXT NOT NULL,
    "plannerId" TEXT NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "planQuality" INTEGER NOT NULL,
    "communication" INTEGER NOT NULL,
    "timeliness" INTEGER NOT NULL,
    "personalisation" INTEGER NOT NULL,
    "practicality" INTEGER NOT NULL,
    "detailLevel" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannerReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanReviewSummary" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "planQuality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "practicality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "detailLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanReviewSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "planQuality" INTEGER NOT NULL,
    "practicality" INTEGER NOT NULL,
    "detailLevel" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlannerReviewSummary_userId_key" ON "PlannerReviewSummary"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PlannerReview_requestId_key" ON "PlannerReview"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanReviewSummary_planId_key" ON "PlanReviewSummary"("planId");

-- AddForeignKey
ALTER TABLE "PlannerReviewSummary" ADD CONSTRAINT "PlannerReviewSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannerReview" ADD CONSTRAINT "PlannerReview_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannerReview" ADD CONSTRAINT "PlannerReview_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannerReview" ADD CONSTRAINT "PlannerReview_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanReviewSummary" ADD CONSTRAINT "PlanReviewSummary_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanReview" ADD CONSTRAINT "PlanReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanReview" ADD CONSTRAINT "PlanReview_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
