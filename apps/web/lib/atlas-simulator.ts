export interface SegmentModel {
  id: string;
  label: string;
  status: string;
  share: number;
  depositMultiplier: number;
  referralDepth: number;
}

export interface TariffModel {
  id: string;
  label: string;
  cycle: string;
  yieldPct: number;
  share: number;
  pressure: "low" | "medium" | "high";
}

export interface SimulatorInputs {
  activeUsers: number;
  dailyNewUsers: number;
  monthlyGrowthRate: number;
  avgDeposit: number;
  avgDepositGrowthRate: number;
  reinvestShare: number;
  partnerShareFromProfit: number;
  longTariffShare: number;
}

export interface SimulatorSummary {
  inflow: number;
  grossProfit: number;
  partnerPayouts: number;
  reinvest: number;
  withdrawals: number;
  shortVolume: number;
  midVolume: number;
  longVolume: number;
  payoutLoadPct: number;
  longPressurePct: number;
  topConcentrationPct: number;
  partnerEfficiencyPct: number;
  liabilities: number;
}

export const segmentModels: SegmentModel[] = [
  {
    id: "explorer",
    label: "Новички",
    status: "Explorer",
    share: 0.52,
    depositMultiplier: 0.7,
    referralDepth: 3
  },
  {
    id: "builder",
    label: "Средние",
    status: "Builder / Connector",
    share: 0.26,
    depositMultiplier: 1.35,
    referralDepth: 10
  },
  {
    id: "leaders",
    label: "Активные лидеры",
    status: "Leader",
    share: 0.16,
    depositMultiplier: 2.8,
    referralDepth: 15
  },
  {
    id: "atlas-partner",
    label: "Топ-лидеры",
    status: "Atlas Partner",
    share: 0.06,
    depositMultiplier: 6.2,
    referralDepth: 20
  }
];

export const referralLevelPercents = [
  10, 6, 4, 3, 2.5, 2, 1.8, 1.6, 1.4, 1.2, 1, 0.8, 0.7, 0.6, 0.5, 0.4, 0.35, 0.3, 0.25, 0.2
];

export function buildTariffs(longTariffShare: number): TariffModel[] {
  const longShare = longTariffShare / 100;
  const shortShare = Math.max(0.18, 0.52 - longShare / 2);
  const midShare = Math.max(0.18, 1 - shortShare - longShare);

  return [
    {
      id: "short",
      label: "Короткие",
      cycle: "1-10 дней",
      yieldPct: 0.12,
      share: shortShare,
      pressure: "low"
    },
    {
      id: "mid",
      label: "Средние",
      cycle: "20-30 дней",
      yieldPct: 0.28,
      share: midShare,
      pressure: "medium"
    },
    {
      id: "long",
      label: "Длинные",
      cycle: "200+ дней",
      yieldPct: 1.75,
      share: longShare,
      pressure: "high"
    }
  ];
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPct(value: number) {
  return `${value.toFixed(1)}%`;
}

export function buildSimulatorState(inputs: SimulatorInputs) {
  const tariffs = buildTariffs(inputs.longTariffShare);
  const segmentRows = segmentModels.map((segment) => {
    const users = Math.round(inputs.activeUsers * segment.share);
    const deposits = users * inputs.avgDeposit * segment.depositMultiplier;
    return {
      ...segment,
      users,
      deposits
    };
  });

  const inflow = segmentRows.reduce((sum, row) => sum + row.deposits, 0);
  const tariffRows = tariffs.map((tariff) => {
    const volume = inflow * tariff.share;
    const profit = volume * tariff.yieldPct;
    return {
      ...tariff,
      volume,
      profit
    };
  });

  const grossProfit = tariffRows.reduce((sum, tariff) => sum + tariff.profit, 0);
  const partnerPayouts = grossProfit * (inputs.partnerShareFromProfit / 100);
  const reinvest = grossProfit * (inputs.reinvestShare / 100);
  const withdrawals = Math.max(0, grossProfit - partnerPayouts - reinvest);
  const liabilities =
    tariffRows.find((tariff) => tariff.id === "long")!.volume * 1.18 +
    tariffRows.find((tariff) => tariff.id === "mid")!.profit * 0.55;
  const payoutLoadPct = grossProfit === 0 ? 0 : ((partnerPayouts + withdrawals) / grossProfit) * 100;
  const longPressurePct = inflow === 0 ? 0 : (tariffRows.find((tariff) => tariff.id === "long")!.volume / inflow) * 100;
  const topConcentrationPct = inflow === 0 ? 0 : (segmentRows[3].deposits / inflow) * 100;
  const partnerEfficiencyPct = grossProfit === 0 ? 0 : (partnerPayouts / grossProfit) * 100;

  const months = [1, 2, 3].map((month) => {
    const growthFactor = 1 + (inputs.monthlyGrowthRate / 100) * month;
    const depositGrowthFactor = 1 + (inputs.avgDepositGrowthRate / 100) * month;
    const users = Math.round(inputs.activeUsers * growthFactor + inputs.dailyNewUsers * 30 * month);
    const avgDeposit = inputs.avgDeposit * depositGrowthFactor;
    const monthInflow = users * avgDeposit * 1.4;
    const monthProfit = monthInflow * 0.33;
    const monthLiabilities = liabilities * (0.72 + month * 0.36);

    return {
      label: `Month ${month}`,
      users,
      avgDeposit,
      liabilities: monthLiabilities,
      inflow: monthInflow,
      profit: monthProfit
    };
  });

  const summary: SimulatorSummary = {
    inflow,
    grossProfit,
    partnerPayouts,
    reinvest,
    withdrawals,
    shortVolume: tariffRows.find((tariff) => tariff.id === "short")!.volume,
    midVolume: tariffRows.find((tariff) => tariff.id === "mid")!.volume,
    longVolume: tariffRows.find((tariff) => tariff.id === "long")!.volume,
    payoutLoadPct,
    longPressurePct,
    topConcentrationPct,
    partnerEfficiencyPct,
    liabilities
  };

  return {
    segmentRows,
    tariffRows,
    summary,
    months
  };
}
