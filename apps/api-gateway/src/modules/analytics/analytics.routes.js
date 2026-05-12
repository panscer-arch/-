const { analyticsController } = require("./analytics.controller");

const analyticsRoutes = [
  {
    path: "/api/admin/analytics/overview",
    handler: analyticsController.getOverview,
  },
  {
    path: "/api/admin/analytics/cash-position",
    handler: analyticsController.getCashPosition,
  },
  {
    path: "/api/admin/analytics/obligations",
    handler: analyticsController.getObligations,
  },
  {
    path: "/api/admin/analytics/plan-fact",
    handler: analyticsController.getPlanFact,
  },
  {
    path: "/api/admin/analytics/orders",
    handler: analyticsController.getOrders,
  },
  {
    path: "/api/admin/analytics/wallets",
    handler: analyticsController.getWallets,
  },
  {
    path: "/api/admin/analytics/partner-structure",
    handler: analyticsController.getPartnerStructure,
  },
  {
    path: "/api/admin/analytics/reinvest",
    handler: analyticsController.getReinvest,
  },
  {
    path: "/api/admin/analytics/leaders",
    handler: analyticsController.getLeaders,
  },
  {
    path: "/api/admin/analytics/geography",
    handler: analyticsController.getGeography,
  },
  {
    path: "/api/admin/analytics/traffic",
    handler: analyticsController.getTraffic,
  },
  {
    path: "/api/admin/analytics/base-composition",
    handler: analyticsController.getBaseComposition,
  },
];

module.exports = {
  analyticsRoutes,
};
