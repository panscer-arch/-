const {
  generatedAt,
  overviewPayload,
  cashPositionPayload,
  obligationsPayload,
  planFactPayload,
  ordersPayload,
  walletsPayload,
  partnerStructurePayload,
  reinvestPayload,
  leadersPayload,
  geographyPayload,
  trafficPayload,
  baseCompositionPayload,
} = require("./analytics.stub-data");

function attachMeta(payload, query) {
  return {
    ...payload,
    meta: {
      generatedAt,
      query,
      source: "analytics-read-model-stub",
    },
  };
}

const analyticsReadModel = {
  getOverview(query) {
    return attachMeta(overviewPayload, query);
  },

  getCashPosition(query) {
    return attachMeta(cashPositionPayload, query);
  },

  getObligations(query) {
    return attachMeta(obligationsPayload, query);
  },

  getPlanFact(query) {
    return attachMeta(planFactPayload, query);
  },

  getOrders(query) {
    return attachMeta(ordersPayload, query);
  },

  getWallets(query) {
    return attachMeta(walletsPayload, query);
  },

  getPartnerStructure(query) {
    return attachMeta(partnerStructurePayload, query);
  },

  getReinvest(query) {
    return attachMeta(reinvestPayload, query);
  },

  getLeaders(query) {
    return attachMeta(leadersPayload, query);
  },

  getGeography(query) {
    return attachMeta(geographyPayload, query);
  },

  getTraffic(query) {
    return attachMeta(trafficPayload, query);
  },

  getBaseComposition(query) {
    return attachMeta(baseCompositionPayload, query);
  },
};

module.exports = {
  analyticsReadModel,
};
