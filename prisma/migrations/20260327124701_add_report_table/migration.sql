-- CreateTable
CREATE TABLE "ReportTraveller" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "travellerId" TEXT NOT NULL,
    "plannerId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportTraveller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReportTraveller_requestId_key" ON "ReportTraveller"("requestId");

-- AddForeignKey
ALTER TABLE "ReportTraveller" ADD CONSTRAINT "ReportTraveller_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTraveller" ADD CONSTRAINT "ReportTraveller_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTraveller" ADD CONSTRAINT "ReportTraveller_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
