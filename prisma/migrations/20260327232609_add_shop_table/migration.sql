-- CreateTable
CREATE TABLE "ShopItems" (
    "id" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "coins" INTEGER NOT NULL,
    "mainDescription" TEXT NOT NULL,
    "subDescription" TEXT NOT NULL,

    CONSTRAINT "ShopItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopItemPrices" (
    "id" TEXT NOT NULL,
    "shopItemId" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ShopItemPrices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopItems_itemCode_key" ON "ShopItems"("itemCode");

-- AddForeignKey
ALTER TABLE "ShopItemPrices" ADD CONSTRAINT "ShopItemPrices_shopItemId_fkey" FOREIGN KEY ("shopItemId") REFERENCES "ShopItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
