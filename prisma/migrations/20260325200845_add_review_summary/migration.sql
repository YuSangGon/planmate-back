/*
  Warnings:

  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `responseRate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `specialty` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `strengths` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "location",
DROP COLUMN "rating",
DROP COLUMN "responseRate",
DROP COLUMN "reviewCount",
DROP COLUMN "specialty",
DROP COLUMN "strengths";

-- CreateTable
CREATE TABLE "ReviewSummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER NOT NULL,
    "planQuality" INTEGER NOT NULL,
    "communication" INTEGER NOT NULL,
    "timeliness" INTEGER NOT NULL,
    "personalisation" INTEGER NOT NULL,
    "practicality" INTEGER NOT NULL,
    "detailLevel" INTEGER NOT NULL,
    "strengths" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewSummary_userId_key" ON "ReviewSummary"("userId");

-- AddForeignKey
ALTER TABLE "ReviewSummary" ADD CONSTRAINT "ReviewSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
