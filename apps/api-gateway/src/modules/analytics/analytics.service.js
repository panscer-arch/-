const { createAnalyticsRepository } = require("./analytics.repository");

const analyticsService = {
  getOverview(query) {
    return createAnalyticsRepository().getOverview(query);
  },

  getCashPosition(query) {
    return createAnalyticsRepository().getCashPosition(query);
  },

  getObligations(query) {
    return createAnalyticsRepository().getObligations(query);
  },

  getPlanFact(query) {
    return createAnalyticsRepository().getPlanFact(query);
  },

  getOrders(query) {
    return createAnalyticsRepository().getOrders(query);
  },

  getWallets(query) {
    return createAnalyticsRepository().getWallets(query);
  },

  getPartnerStructure(query) {
    return createAnalyticsRepository().getPartnerStructure(query);
  },

  getReinvest(query) {
    return createAnalyticsRepository().getReinvest(query);
  },

  getLeaders(query) {
    return createAnalyticsRepository().getLeaders(query);
  },

  getGeography(query) {
    return createAnalyticsRepository().getGeography(query);
  },

  getTraffic(query) {
    return createAnalyticsRepository().getTraffic(query);
  },

  getBaseComposition(query) {
    return createAnalyticsRepository().getBaseComposition(query);
  },
};

module.exports = {
  analyticsService,
};
