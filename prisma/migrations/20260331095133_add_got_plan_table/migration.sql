-- CreateTable
CREATE TABLE "GotPlans" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GotPlans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GotPlans" ADD CONSTRAINT "GotPlans_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GotPlans" ADD CONSTRAINT "GotPlans_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
