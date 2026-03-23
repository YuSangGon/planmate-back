-- CreateEnum
CREATE TYPE "MatchProposalStatus" AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- CreateTable
CREATE TABLE "MatchProposal" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "plannerId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "proposedPrice" INTEGER,
    "estimatedDays" INTEGER,
    "status" "MatchProposalStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MatchProposal_requestId_idx" ON "MatchProposal"("requestId");

-- CreateIndex
CREATE INDEX "MatchProposal_plannerId_idx" ON "MatchProposal"("plannerId");

-- CreateIndex
CREATE INDEX "MatchProposal_status_idx" ON "MatchProposal"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MatchProposal_requestId_plannerId_key" ON "MatchProposal"("requestId", "plannerId");

-- AddForeignKey
ALTER TABLE "MatchProposal" ADD CONSTRAINT "MatchProposal_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchProposal" ADD CONSTRAINT "MatchProposal_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
