const { normalizeAnalyticsQuery } = require("./analytics.query");
const { analyticsService } = require("./analytics.service");

const analyticsController = {
  getOverview(context) {
    return analyticsService.getOverview(normalizeAnalyticsQuery(context.searchParams));
  },

  getCashPosition(context) {
    return analyticsService.getCashPosition(normalizeAnalyticsQuery(context.searchParams));
  },

  getObligations(context) {
    return analyticsService.getObligations(normalizeAnalyticsQuery(context.searchParams));
  },

  getPlanFact(context) {
    return analyticsService.getPlanFact(normalizeAnalyticsQuery(context.searchParams));
  },

  getOrders(context) {
    return analyticsService.getOrders(normalizeAnalyticsQuery(context.searchParams));
  },

  getWallets(context) {
    return analyticsService.getWallets(normalizeAnalyticsQuery(context.searchParams));
  },

  getPartnerStructure(context) {
    return analyticsService.getPartnerStructure(normalizeAnalyticsQuery(context.searchParams));
  },

  getReinvest(context) {
    return analyticsService.getReinvest(normalizeAnalyticsQuery(context.searchParams));
  },

  getLeaders(context) {
    return analyticsService.getLeaders(normalizeAnalyticsQuery(context.searchParams));
  },

  getGeography(context) {
    return analyticsService.getGeography(normalizeAnalyticsQuery(context.searchParams));
  },

  getTraffic(context) {
    return analyticsService.getTraffic(normalizeAnalyticsQuery(context.searchParams));
  },

  getBaseComposition(context) {
    return analyticsService.getBaseComposition(normalizeAnalyticsQuery(context.searchParams));
  },
};

module.exports = {
  analyticsController,
};
