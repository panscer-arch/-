const { PrismaClient } = require("@prisma/client");
const { loadLocalEnv } = require("../src/load-env");

loadLocalEnv();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for seed:phase1.");
}

const prisma = new PrismaClient();

function toDate(value) {
  return new Date(`${value}T00:00:00.000Z`);
}

async function seedReferenceData() {
  await prisma.product.upsert({
    where: { id: "product_unity_lockup" },
    update: { slug: "unity_lockup", name: "Lockup" },
    create: {
      id: "product_unity_lockup",
      slug: "unity_lockup",
      name: "Lockup",
    },
  });

  await prisma.product.upsert({
    where: { id: "product_unity_daily" },
    update: { slug: "unity_daily", name: "Daily Flow" },
    create: {
      id: "product_unity_daily",
      slug: "unity_daily",
      name: "Daily Flow",
    },
  });

  await prisma.productCycle.upsert({
    where: { code: "imperium_30d_22_5" },
    update: {},
    create: {
      id: "cycle_imperium_30d_22_5",
      productId: "product_unity_lockup",
      code: "imperium_30d_22_5",
      durationDays: 30,
      payoutRate: "22.50",
    },
  });

  await prisma.productCycle.upsert({
    where: { code: "core_200d_1_1" },
    update: {},
    create: {
      id: "cycle_core_200d_1_1",
      productId: "product_unity_daily",
      code: "core_200d_1_1",
      durationDays: 200,
      payoutRateDaily: "1.10",
    },
  });

  await prisma.user.upsert({
    where: { id: "usr_201" },
    update: {
      displayName: "Barny Broflovsky",
      country: "Great Britain",
      city: "Manchester",
    },
    create: {
      id: "usr_201",
      displayName: "Barny Broflovsky",
      country: "Great Britain",
      city: "Manchester",
    },
  });

  await prisma.user.upsert({
    where: { id: "usr_305" },
    update: {
      displayName: "Aisha Karim",
      country: "UAE",
      city: "Dubai",
    },
    create: {
      id: "usr_305",
      displayName: "Aisha Karim",
      country: "UAE",
      city: "Dubai",
    },
  });

  await prisma.wallet.upsert({
    where: { address: "0xA91...7D1" },
    update: {
      role: "user",
      network: "BNB",
      ownerType: "Инвестор",
      userId: "usr_201",
    },
    create: {
      id: "wallet_user_1",
      address: "0xA91...7D1",
      role: "user",
      network: "BNB",
      ownerType: "Инвестор",
      userId: "usr_201",
    },
  });

  await prisma.wallet.upsert({
    where: { address: "0xB52...1F8" },
    update: {
      role: "creator",
      network: "Ethereum",
      ownerType: "Creator",
      userId: "usr_305",
    },
    create: {
      id: "wallet_creator_1",
      address: "0xB52...1F8",
      role: "creator",
      network: "Ethereum",
      ownerType: "Creator",
      userId: "usr_305",
    },
  });
}

async function seedOrders() {
  await prisma.order.upsert({
    where: { id: "ord_1001" },
    update: {},
    create: {
      id: "ord_1001",
      userId: "usr_201",
      walletId: "wallet_user_1",
      productId: "product_unity_lockup",
      cycleCode: "imperium_30d_22_5",
      depositAmount: "5000",
      createdAt: toDate("2026-04-12"),
      maturesAt: toDate("2026-05-12"),
      expectedPayoutTotal: "6125",
      paidAmount: "0",
      remainingAmount: "6125",
      claimableNow: "0",
      accruedLater: "6125",
      status: "active",
    },
  });

  await prisma.order.upsert({
    where: { id: "ord_1002" },
    update: {},
    create: {
      id: "ord_1002",
      userId: "usr_305",
      walletId: "wallet_creator_1",
      productId: "product_unity_daily",
      cycleCode: "core_200d_1_1",
      depositAmount: "2800",
      createdAt: toDate("2026-04-25"),
      expectedPayoutTotal: "6720",
      paidAmount: "620",
      remainingAmount: "6100",
      claimableNow: "310",
      accruedLater: "5790",
      status: "active",
    },
  });
}

async function seedPhase1ReadModels() {
  await prisma.dailyCashPosition.upsert({
    where: { date: toDate("2026-05-07") },
    update: {},
    create: {
      id: "cash_2026_05_07",
      date: toDate("2026-05-07"),
      openingBalance: "31200",
      incomingFact: "18250",
      outgoingFact: "9400",
      closingBalance: "40050",
      availableCash: "28600",
      reservedForPayouts: "11450",
    },
  });

  const obligations = [
    {
      id: "obl_2026_05_08_1",
      date: "2026-05-08",
      productSlug: "unity_daily",
      cycleCode: "core_200d_1_1",
      walletAddress: "0xA91...7D1",
      orderId: "ord_1002",
      obligationType: "user_cycle_payout",
      amount: "2450",
      status: "scheduled",
    },
    {
      id: "obl_2026_05_08_2",
      date: "2026-05-08",
      productSlug: "unity_daily",
      cycleCode: "core_200d_1_1",
      walletAddress: "0xA91...7D1",
      orderId: "ord_1002",
      obligationType: "claimable_now",
      amount: "820",
      status: "claimable",
    },
    {
      id: "obl_2026_05_12_1",
      date: "2026-05-12",
      productSlug: "unity_lockup",
      cycleCode: "imperium_30d_22_5",
      walletAddress: "0xA91...7D1",
      orderId: "ord_1001",
      obligationType: "user_cycle_payout",
      amount: "6125",
      status: "scheduled",
    },
  ];

  for (const item of obligations) {
    await prisma.dailyObligation.upsert({
      where: { id: item.id },
      update: {},
      create: {
        ...item,
        date: toDate(item.date),
      },
    });
  }

  const planFactRows = [
    {
      id: "pf_2026_05_07_daily",
      date: "2026-05-07",
      source: "unity_daily",
      country: "UAE",
      leader: "Aisha Karim",
      productSlug: "unity_daily",
      plan: "8000",
      fact: "5200",
      gap: "2800",
      carryForwardDeficit: "3200",
      requiredTargetNextDay: "30150",
    },
    {
      id: "pf_2026_05_07_lockup",
      date: "2026-05-07",
      source: "unity_lockup",
      country: "Great Britain",
      leader: "Barny Broflovsky",
      productSlug: "unity_lockup",
      plan: "10000",
      fact: "8400",
      gap: "1600",
      carryForwardDeficit: "3200",
      requiredTargetNextDay: "30150",
    },
  ];

  for (const row of planFactRows) {
    await prisma.planFactInflowDaily.upsert({
      where: { id: row.id },
      update: {},
      create: {
        ...row,
        date: toDate(row.date),
      },
    });
  }

  const walletRows = [
    {
      id: "wallet_daily_1",
      walletId: "wallet_user_1",
      date: "2026-05-07",
      balance: "12400",
      inflow: "17100",
      outflow: "8900",
      claimable: "3100",
      accrued: "5800",
      linkedObligations: "6400",
      claimPressure: "18.1",
      obligationLoad: "37.4",
      riskScore: "41",
      activityScore: "82",
      netContribution: "7250",
      concentrationShare: "22",
      reinvestFlow: "4100",
    },
    {
      id: "wallet_daily_2",
      walletId: "wallet_creator_1",
      date: "2026-05-07",
      balance: "9800",
      inflow: "13300",
      outflow: "5400",
      claimable: "2200",
      accrued: "4700",
      linkedObligations: "5200",
      claimPressure: "16.5",
      obligationLoad: "39.1",
      riskScore: "52",
      activityScore: "74",
      netContribution: "5850",
      concentrationShare: "19",
      reinvestFlow: "3190",
    },
  ];

  for (const row of walletRows) {
    await prisma.walletBalanceDaily.upsert({
      where: { id: row.id },
      update: {},
      create: {
        ...row,
        date: toDate(row.date),
      },
    });
  }

  const partnerRows = [
    {
      id: "branch_daily_1",
      date: "2026-05-07",
      partnerId: "partner_11",
      branch: "North Star",
      leader: "Leader 1",
      generatedInflow: "22800",
      referralAccrual: "3200",
      referralPaid: "2500",
      downlineObligations: "7100",
      netContribution: "12500",
      structuralLeak: "13",
      leaderDependency: "51",
      conversionToDeposit: "46",
      depthScore: "76",
      activeInvited: 112,
      depositingInvited: 74,
    },
    {
      id: "branch_daily_2",
      date: "2026-05-07",
      partnerId: "partner_12",
      branch: "Golden Bridge",
      leader: "Leader 2",
      generatedInflow: "19900",
      referralAccrual: "2700",
      referralPaid: "2150",
      downlineObligations: "6300",
      netContribution: "10900",
      structuralLeak: "16",
      leaderDependency: "45",
      conversionToDeposit: "42",
      depthScore: "69",
      activeInvited: 97,
      depositingInvited: 58,
    },
  ];

  for (const row of partnerRows) {
    await prisma.partnerBranchDaily.upsert({
      where: { id: row.id },
      update: {},
      create: {
        ...row,
        date: toDate(row.date),
      },
    });
  }
}

async function main() {
  await seedReferenceData();
  await seedOrders();
  await seedPhase1ReadModels();
  console.log("Phase 1 analytics seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
