function getValue(searchParams, key, fallback) {
  const value = searchParams.get(key);
  return value && value.trim() ? value.trim() : fallback;
}

function normalizeAnalyticsQuery(searchParams) {
  return {
    dateRange: getValue(searchParams, "dateRange", "30d"),
    dateFrom: getValue(searchParams, "dateFrom", null),
    dateTo: getValue(searchParams, "dateTo", null),
    segment: getValue(searchParams, "segment", "all"),
    product: getValue(searchParams, "product", "all"),
    country: getValue(searchParams, "country", "all"),
    network: getValue(searchParams, "network", "all"),
  };
}

module.exports = {
  normalizeAnalyticsQuery,
};
