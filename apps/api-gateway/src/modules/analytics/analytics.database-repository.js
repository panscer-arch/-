function toNumber(value) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  return Number(value);
}

function pickDateRangeDays(query) {
  const range = query?.dateRange || "30d";
  if (range === "7d") return 7;
  if (range === "90d") return 90;
  return 30;
}

function buildGeneratedAt() {
  return new Date().toISOString();
}

function requirePrismaClient() {
  try {
    const { PrismaClient } = require("@prisma/client");
    return new PrismaClient();
  } catch (error) {
    throw new Error(
      "Database mode requires @prisma/client. Run npm install in apps/api-gateway before enabling ANALYTICS_DATA_MODE=database.",
    );
  }
}

async function getPrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required when ANALYTICS_DATA_MODE=database.");
  }

  if (!global.__analyticsPrisma) {
    global.__analyticsPrisma = requirePrismaClient();
  }

  return global.__analyticsPrisma;
}

async function getLatestCashPosition(prisma) {
  return prisma.dailyCashPosition.findFirst({
    orderBy: { date: "desc" },
  });
}

async function getRecentObligations(prisma, days = 30) {
  const now = new Date();
  const to = new Date(now);
  to.setDate(to.getDate() + days);
  return prisma.dailyObligation.findMany({
    where: {
      date: {
        gte: now,
        lte: to,
      },
    },
    orderBy: [{ date: "asc" }],
  });
}

async function getRecentPlanFact(prisma, days = 30) {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - days + 1);
  return prisma.planFactInflowDaily.findMany({
    where: {
      date: {
        gte: from,
        lte: now,
      },
    },
    orderBy: [{ date: "asc" }],
  });
}

async function getRecentOrders(prisma, limit = 50) {
  return prisma.order.findMany({
    include: {
      wallet: true,
      product: true,
      user: true,
    },
    orderBy: [{ createdAt: "desc" }],
    take: limit,
  });
}

function withMeta(payload, query) {
  return {
    ...payload,
    meta: {
      generatedAt: buildGeneratedAt(),
      query,
      source: "analytics-prisma-read-model",
    },
  };
}

async function getOverview(query) {
  const prisma = await getPrisma();
  const [cashPosition, obligations, planFact] = await Promise.all([
    getLatestCashPosition(prisma),
    getRecentObligations(prisma, 30),
    getRecentPlanFact(prisma, 30),
  ]);

  const todayPlanFact = planFact.at(-1);
  const obligations7d = obligations
    .filter((row) => {
      const diff = (new Date(row.date) - new Date()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .reduce((sum, row) => sum + toNumber(row.amount), 0);
  const obligations30d = obligations.reduce((sum, row) => sum + toNumber(row.amount), 0);

  return withMeta({
    generatedAt: buildGeneratedAt(),
    currency: "USD",
    summary: {
      incomingToday: toNumber(cashPosition?.incomingFact),
      planToday: toNumber(todayPlanFact?.plan),
      factToday: toNumber(todayPlanFact?.fact),
      gapToday: toNumber(todayPlanFact?.gap),
      carryForwardDeficit: toNumber(todayPlanFact?.carryForwardDeficit),
      targetToday: toNumber(todayPlanFact?.plan) + toNumber(todayPlanFact?.carryForwardDeficit),
      targetTomorrow: toNumber(todayPlanFact?.requiredTargetNextDay),
      obligations7d,
      obligations30d,
      deficit7d: Math.max(0, obligations7d - toNumber(cashPosition?.availableCash)),
      deficit30d: Math.max(0, obligations30d - toNumber(cashPosition?.availableCash)),
      coverage7d: obligations7d ? Number(((toNumber(cashPosition?.availableCash) / obligations7d) * 100).toFixed(1)) : 100,
      coverage30d: obligations30d ? Number(((toNumber(cashPosition?.availableCash) / obligations30d) * 100).toFixed(1)) : 100,
      requiredNewMoney: Math.max(0, obligations30d - toNumber(cashPosition?.availableCash)),
      referralBurden: 0,
      platformFee: 0,
      operatorNet: Math.max(0, toNumber(cashPosition?.availableCash) - obligations30d),
      claimableNow: 0,
      accruedLater: 0,
      firstRiskDate: obligations30d > toNumber(cashPosition?.availableCash) ? new Date().toISOString().slice(0, 10) : "без риска",
      firstRiskGap: Math.max(0, obligations30d - toNumber(cashPosition?.availableCash)),
    },
    cashPosition: cashPosition
      ? {
          openingBalance: toNumber(cashPosition.openingBalance),
          incomingFact: toNumber(cashPosition.incomingFact),
          outgoingFact: toNumber(cashPosition.outgoingFact),
          closingBalance: toNumber(cashPosition.closingBalance),
          availableCash: toNumber(cashPosition.availableCash),
          reservedForPayouts: toNumber(cashPosition.reservedForPayouts),
        }
      : null,
    signals: [],
    actions: [],
  }, query);
}

async function getCashPosition(query) {
  const prisma = await getPrisma();
  const days = pickDateRangeDays(query);
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - days + 1);
  const rows = await prisma.dailyCashPosition.findMany({
    where: {
      date: {
        gte: from,
        lte: now,
      },
    },
    orderBy: [{ date: "asc" }],
  });

  return withMeta({
    currency: "USD",
    days: rows.map((row) => ({
      date: row.date.toISOString().slice(0, 10),
      openingBalance: toNumber(row.openingBalance),
      incomingFact: toNumber(row.incomingFact),
      outgoingFact: toNumber(row.outgoingFact),
      closingBalance: toNumber(row.closingBalance),
      availableCash: toNumber(row.availableCash),
      reservedForPayouts: toNumber(row.reservedForPayouts),
    })),
  }, query);
}

async function getObligations(query) {
  const prisma = await getPrisma();
  const schedule = await getRecentObligations(prisma, 30);
  const normalized = schedule.map((row) => ({
    date: row.date.toISOString().slice(0, 10),
    product: row.productSlug,
    cycle: row.cycleCode,
    wallet: row.walletAddress,
    obligationType: row.obligationType,
    amount: toNumber(row.amount),
    status: row.status,
  }));

  return withMeta({
    currency: "USD",
    totals: {
      today: normalized
        .filter((row) => row.date === new Date().toISOString().slice(0, 10))
        .reduce((sum, row) => sum + row.amount, 0),
      next7d: normalized.slice(0, 7).reduce((sum, row) => sum + row.amount, 0),
      next30d: normalized.reduce((sum, row) => sum + row.amount, 0),
    },
    schedule: normalized,
  }, query);
}

async function getPlanFact(query) {
  const prisma = await getPrisma();
  const rows = await getRecentPlanFact(prisma, pickDateRangeDays(query));
  const latest = rows.at(-1);

  return withMeta({
    currency: "USD",
    summary: {
      planToday: toNumber(latest?.plan),
      factToday: toNumber(latest?.fact),
      gapToday: toNumber(latest?.gap),
      carryForwardDeficit: toNumber(latest?.carryForwardDeficit),
      requiredTargetNextDay: toNumber(latest?.requiredTargetNextDay),
    },
    breakdown: rows.map((row) => ({
      date: row.date.toISOString().slice(0, 10),
      source: row.source,
      country: row.country,
      leader: row.leader,
      product: row.productSlug,
      plan: toNumber(row.plan),
      fact: toNumber(row.fact),
      gap: toNumber(row.gap),
    })),
  }, query);
}

async function getOrders(query) {
  const prisma = await getPrisma();
  const rows = await getRecentOrders(prisma, 50);
  return withMeta({
    currency: "USD",
    rows: rows.map((row) => ({
      orderId: row.id,
      userId: row.userId,
      wallet: row.wallet?.address || row.walletId,
      product: row.product?.slug || row.productId,
      cycle: row.cycleCode,
      depositAmount: toNumber(row.depositAmount),
      createdAt: row.createdAt.toISOString().slice(0, 10),
      maturesAt: row.maturesAt ? row.maturesAt.toISOString().slice(0, 10) : null,
      expectedPayoutTotal: toNumber(row.expectedPayoutTotal),
      paidAmount: toNumber(row.paidAmount),
      remainingAmount: toNumber(row.remainingAmount),
      claimableNow: toNumber(row.claimableNow),
      accruedLater: toNumber(row.accruedLater),
      status: row.status,
    })),
  }, query);
}

async function getWallets(query) {
  const prisma = await getPrisma();
  const rows = await prisma.walletBalanceDaily.findMany({
    where: {},
    include: {
      wallet: true,
    },
    orderBy: [{ date: "desc" }],
    take: 50,
  });
  const normalized = rows.map((row) => ({
    wallet: row.wallet?.address || row.walletId,
    role: row.wallet?.role || "user",
    ownerType: row.wallet?.ownerType || "Инвестор",
    network: row.wallet?.network || "BNB",
    balance: toNumber(row.balance),
    inflow: toNumber(row.inflow),
    outflow: toNumber(row.outflow),
    claimable: toNumber(row.claimable),
    accrued: toNumber(row.accrued),
    linkedObligations: toNumber(row.linkedObligations),
    claimPressure: toNumber(row.claimPressure),
    obligationLoad: toNumber(row.obligationLoad),
    riskScore: toNumber(row.riskScore),
    activityScore: toNumber(row.activityScore),
    netContribution: toNumber(row.netContribution),
    concentrationShare: toNumber(row.concentrationShare),
    reinvestFlow: toNumber(row.reinvestFlow),
  }));

  return withMeta({
    currency: "USD",
    summary: {
      top5Concentration: normalized.slice(0, 5).reduce((sum, row) => sum + row.concentrationShare, 0),
      avgClaimPressure: normalized.length ? normalized.reduce((sum, row) => sum + row.claimPressure, 0) / normalized.length : 0,
      avgActivityScore: normalized.length ? normalized.reduce((sum, row) => sum + row.activityScore, 0) / normalized.length : 0,
    },
    rows: normalized,
  }, query);
}

async function getPartnerStructure(query) {
  const prisma = await getPrisma();
  const rows = await prisma.partnerBranchDaily.findMany({
    orderBy: [{ date: "desc" }],
    take: 50,
  });
  const normalized = rows.map((row) => ({
    partnerId: row.partnerId,
    branch: row.branch,
    leader: row.leader,
    generatedInflow: toNumber(row.generatedInflow),
    referralAccrual: toNumber(row.referralAccrual),
    referralPaid: toNumber(row.referralPaid),
    downlineObligations: toNumber(row.downlineObligations),
    netContribution: toNumber(row.netContribution),
    structuralLeak: toNumber(row.structuralLeak),
    leaderDependency: toNumber(row.leaderDependency),
    conversionToDeposit: toNumber(row.conversionToDeposit),
    depthScore: toNumber(row.depthScore),
    activeInvited: row.activeInvited,
    depositingInvited: row.depositingInvited,
  }));

  return withMeta({
    currency: "USD",
    summary: {
      referralAccrual: normalized.reduce((sum, row) => sum + row.referralAccrual, 0),
      referralPaid: normalized.reduce((sum, row) => sum + row.referralPaid, 0),
      avgReferralRate: normalized.length ? normalized.reduce((sum, row) => sum + (row.generatedInflow ? (row.referralAccrual / row.generatedInflow) * 100 : 0), 0) / normalized.length : 0,
      avgLeaderDependency: normalized.length ? normalized.reduce((sum, row) => sum + row.leaderDependency, 0) / normalized.length : 0,
    },
    rows: normalized,
  }, query);
}

async function getReinvest(query) {
  const prisma = await getPrisma();
  const rows = await prisma.reinvestDaily.findMany({
    orderBy: [{ date: "desc" }],
    take: 50,
  });

  const byProduct = rows.filter((row) => row.source).map((row) => ({
    source: row.source,
    claimedCapital: toNumber(row.claimedCapital),
    reinvestedCapital: toNumber(row.reinvestedCapital),
    capitalRate: toNumber(row.capitalRate),
    claimUsers: row.claimUsers,
    reinvestUsers: row.reinvestUsers,
    userRate: toNumber(row.userRate),
  }));

  const byCountry = rows
    .filter((row) => row.country)
    .map((row) => ({
      country: row.country,
      claimUsers: row.claimUsers,
      reinvestUsers: row.reinvestUsers,
      userRate: toNumber(row.userRate),
      claimedCapital: toNumber(row.claimedCapital),
      reinvestedCapital: toNumber(row.reinvestedCapital),
      capitalRate: toNumber(row.capitalRate),
    }));

  const first = rows[0];
  return withMeta({
    currency: "USD",
    summary: {
      reinvestUsersRate: first ? toNumber(first.userRate) : 0,
      reinvestCapitalRate: first ? toNumber(first.capitalRate) : 0,
      repeatDepositRate: first ? toNumber(first.userRate) : 0,
      averageDaysToReinvest: first ? toNumber(first.averageDaysToReinvest) : 0,
    },
    byProduct,
    byCountry,
    timeline: [],
  }, query);
}

async function getLeaders(query) {
  const prisma = await getPrisma();
  const [participation, attraction] = await Promise.all([
    prisma.leaderParticipationDaily.findMany({ orderBy: [{ date: "desc" }], take: 50 }),
    prisma.leaderAttractionDaily.findMany({ orderBy: [{ date: "desc" }], take: 50 }),
  ]);

  return withMeta({
    currency: "USD",
    summary: {},
    participation: participation.map((row) => ({
      name: row.leader,
      country: row.country,
      investment: toNumber(row.investment),
      cycles: row.cycles,
      activeDays: row.activeDays,
      obligations: toNumber(row.obligations),
      referralIncome: toNumber(row.referralIncome),
      netContribution: toNumber(row.netContribution),
      reinvestRate: toNumber(row.reinvestRate),
      retentionRate: toNumber(row.retentionRate),
      claimRate: toNumber(row.claimRate),
    })),
    attraction: attraction.map((row) => ({
      name: row.leader,
      country: row.country,
      invited: row.invited,
      activeInvited: row.activeInvited,
      depositingInvited: row.depositingInvited,
      inflow: toNumber(row.inflow),
      referralLoad: toNumber(row.referralLoad),
      leaderDependency: toNumber(row.leaderDependency),
      baseRetention: toNumber(row.baseRetention),
      reinvestRate: toNumber(row.reinvestRate),
      claimPressure: toNumber(row.claimPressure),
      netContribution: toNumber(row.netContribution),
    })),
  }, query);
}

async function getGeography(query) {
  const prisma = await getPrisma();
  const rows = await prisma.countryDaily.findMany({
    orderBy: [{ date: "desc" }],
    take: 50,
  });
  return withMeta({
    currency: "USD",
    summary: {},
    rows: rows.map((row) => ({
      country: row.country,
      city: row.city,
      users: row.users,
      wallets: row.wallets,
      inflow: toNumber(row.inflow),
      obligations: toNumber(row.obligations),
      deposits: toNumber(row.deposits),
      activeUsers: row.activeUsers,
      activeRate: toNumber(row.activeRate),
      newUsers: row.newUsers,
      repeatUsers: row.repeatUsers,
      repeatRate: toNumber(row.repeatRate),
      reinvestUsers: row.reinvestUsers,
      reinvestRate: toNumber(row.reinvestRate),
      payingUsers: row.payingUsers,
      payingRate: toNumber(row.payingRate),
      claimUsers: row.claimUsers,
      claimRate: toNumber(row.claimRate),
      riskScore: toNumber(row.riskScore),
      growthScore: toNumber(row.growthScore),
      obligationLoad: toNumber(row.obligationLoad),
    })),
  }, query);
}

async function getTraffic(query) {
  const prisma = await getPrisma();
  const rows = await prisma.trafficDaily.findMany({
    orderBy: [{ date: "desc" }],
    take: 50,
  });
  const first = rows[0];
  return withMeta({
    currency: "USD",
    summary: first
      ? {
          siteOnline: first.siteOnline,
          cabinetOnline: first.cabinetOnline,
          sessionsToday: first.sessionsToday,
          authorizedToday: first.authorizedToday,
          walletConnects: first.walletConnects,
          depositStarts: first.depositStarts,
          newVisitors: first.newVisitors,
          repeatVisitors: first.repeatVisitors,
          engagedUsers: first.engagedUsers,
          averageSessionMinutes: toNumber(first.averageSessionMinutes),
        }
      : {},
    countries: rows
      .filter((row) => row.country)
      .map((row) => ({
        country: row.country,
        siteUsers: row.siteOnline,
        cabinetUsers: row.cabinetOnline,
        sessions: row.sessionsToday,
        wallets: row.walletConnects,
        newVisitors: row.newVisitors,
        repeatVisitors: row.repeatVisitors,
        engagementRate: row.siteOnline ? Number(((row.engagedUsers / row.siteOnline) * 100).toFixed(1)) : 0,
        depositConversion: toNumber(row.depositConversion),
      })),
    sources: rows.map((row) => ({
      source: row.source,
      siteUsers: row.siteOnline,
      cabinetUsers: row.cabinetOnline,
      walletConnects: row.walletConnects,
      deposits: row.depositStarts,
      conversion: row.siteOnline ? Number(((row.cabinetOnline / row.siteOnline) * 100).toFixed(1)) : 0,
      newVisitors: row.newVisitors,
      repeatVisitors: row.repeatVisitors,
      bounceRate: toNumber(row.bounceRate),
      depositStarts: row.depositStarts,
      depositConversion: toNumber(row.depositConversion),
      qualityScore: toNumber(row.qualityScore),
    })),
    funnel: [],
    conversion: [],
    timeline: rows.map((row) => ({
      date: row.date.toISOString().slice(5, 10),
      incomingAmount: row.siteOnline,
      cyclePayouts: row.walletConnects,
    })),
  }, query);
}

async function getBaseComposition(query) {
  const prisma = await getPrisma();
  const rows = await prisma.baseCompositionDaily.findMany({
    orderBy: [{ date: "desc" }],
    take: 50,
  });

  return withMeta({
    currency: "USD",
    segments: rows.map((row) => ({
      segment: row.segment,
      users: row.users,
      share: toNumber(row.share),
      inflow: toNumber(row.inflow),
      obligations: toNumber(row.obligations),
      referralShare: toNumber(row.referralShare),
      repeatRate: toNumber(row.repeatRate),
      claimPressure: toNumber(row.claimPressure),
      avgDeposit: toNumber(row.avgDeposit),
      netContribution: toNumber(row.netContribution),
      activeUsers: row.activeUsers,
      sleepingUsers: row.sleepingUsers,
      newUsers: row.newUsers,
      repeatUsers: row.repeatUsers,
      payingUsers: row.payingUsers,
      nonPayingUsers: row.nonPayingUsers,
      claimUsers: row.claimUsers,
      noClaimUsers: row.noClaimUsers,
      referralIncomeUsers: row.referralIncomeUsers,
      noReferralIncomeUsers: row.noReferralIncomeUsers,
      reinvestUsers: row.reinvestUsers,
      reinvestRate: toNumber(row.reinvestRate),
      reactivatedUsers: row.reactivatedUsers,
      reactivatedRate: toNumber(row.reactivatedRate),
      churnedUsers: row.churnedUsers,
      churnRate: toNumber(row.churnRate),
      dormantUsers: row.dormantUsers,
      dormantRate: toNumber(row.dormantRate),
      largeUsers: row.largeUsers,
      mediumUsers: row.mediumUsers,
      smallUsers: row.smallUsers,
      largeInflow: toNumber(row.largeInflow),
      mediumInflow: toNumber(row.mediumInflow),
      smallInflow: toNumber(row.smallInflow),
      mixedRoleConversion: toNumber(row.mixedRoleConversion),
    })),
  }, query);
}

const analyticsDatabaseRepository = {
  getOverview,
  getCashPosition,
  getObligations,
  getPlanFact,
  getOrders,
  getWallets,
  getPartnerStructure,
  getReinvest,
  getLeaders,
  getGeography,
  getTraffic,
  getBaseComposition,
};

module.exports = {
  analyticsDatabaseRepository,
};
