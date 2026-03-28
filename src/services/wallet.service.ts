import { prisma } from "../lib/prisma";

const COIN_PACKAGES: Record<string, number> = {
  starter: 100,
  standard: 250,
  plus: 500,
  pro: 1000,
};

export async function getMyCoinBalance(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      coinBalance: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function purchaseCoins(input: {
  userId: string;
  itemCode: string;
}) {
  const shopItem = await prisma.shopItems.findUnique({
    where: {
      itemCode: input.itemCode,
    },
    select: {
      id: true,
      itemCode: true,
      coins: true,
    },
  });

  if (!shopItem) {
    throw new Error("Invalid shop item");
  }

  return prisma.user.update({
    where: { id: input.userId },
    data: {
      coinBalance: {
        increment: shopItem.coins,
      },
    },
    select: {
      id: true,
      coinBalance: true,
    },
  });
}

export async function getItemLists() {
  // TODO : 접속하는 나라에 따라 아이텀 코드 할당
  const countryCode = "GBP";

  const items = await prisma.shopItems.findMany({
    include: {
      prices: {
        where: {
          countryCode,
        },
        select: {
          id: true,
          countryCode: true,
          price: true,
          isSale: true,
          salePrice: true,
        },
      },
    },
    orderBy: {
      coins: "asc",
    },
  });

  return items.map((item: any) => ({
    id: item.id,
    itemCode: item.itemCode,
    itemName: item.itemName,
    coins: item.coins,
    mainDescription: item.mainDescription,
    subDescription: item.subDescription,
    priceInfo: item.prices[0]
      ? {
          price: item.prices[0].price,
          countryCode: item.prices[0].countryCode,
          isSale: item.prices[0].isSale,
          salePrice: item.prices[0].salePrice,
        }
      : {},
  }));
}
