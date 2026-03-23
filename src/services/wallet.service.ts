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
      role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function purchaseCoins(input: {
  userId: string;
  packageId: string;
}) {
  const coinAmount = COIN_PACKAGES[input.packageId];

  if (!coinAmount) {
    throw new Error("Invalid coin package");
  }

  return prisma.user.update({
    where: { id: input.userId },
    data: {
      coinBalance: {
        increment: coinAmount,
      },
    },
    select: {
      id: true,
      coinBalance: true,
    },
  });
}
