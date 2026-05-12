const { analyticsReadModel } = require("./analytics.read-model");

function getAnalyticsDataMode() {
  return process.env.ANALYTICS_DATA_MODE === "database" ? "database" : "stub";
}

function createAnalyticsRepository() {
  if (getAnalyticsDataMode() === "database") {
    const { analyticsDatabaseRepository } = require("./analytics.database-repository");
    return analyticsDatabaseRepository;
  }

  return analyticsReadModel;
}

module.exports = {
  createAnalyticsRepository,
  getAnalyticsDataMode,
};
