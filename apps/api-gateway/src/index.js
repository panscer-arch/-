const http = require("node:http");
const { URL } = require("node:url");
const { loadLocalEnv } = require("./load-env");
const { analyticsRoutes } = require("./modules/analytics");
const { getAnalyticsDataMode } = require("./modules/analytics/analytics.repository");

loadLocalEnv();

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(body);
}

function handleOptions(response) {
  response.writeHead(204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end();
}

function buildNotFoundPayload(pathname) {
  return {
    ok: false,
    error: "Not Found",
    message: `Route ${pathname} is not registered in api-gateway.`,
  };
}

function buildRouteMap() {
  return new Map([
    ["/health", () => ({ ok: true, service: "api-gateway", status: "up", analyticsDataMode: getAnalyticsDataMode() })],
    ...analyticsRoutes.map((route) => [route.path, route.handler]),
  ]);
}

const routeMap = buildRouteMap();

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    handleOptions(response);
    return;
  }

  if (request.method !== "GET") {
    sendJson(response, 405, {
      ok: false,
      error: "Method Not Allowed",
      message: `Method ${request.method} is not supported.`,
    });
    return;
  }

  const currentUrl = new URL(request.url, "http://127.0.0.1");
  const routeHandler = routeMap.get(currentUrl.pathname);

  if (!routeHandler) {
    sendJson(response, 404, buildNotFoundPayload(currentUrl.pathname));
    return;
  }

  try {
    const payload = await routeHandler({
      pathname: currentUrl.pathname,
      searchParams: currentUrl.searchParams,
    });
    sendJson(response, 200, payload);
  } catch (error) {
    console.error("API gateway route failed", error);
    sendJson(response, 500, {
      ok: false,
      error: "Internal Server Error",
      message: error.message || "Unexpected error",
    });
  }
});

const PORT = Number(process.env.PORT || 3100);

server.listen(PORT, "127.0.0.1", () => {
  console.log(`API gateway running on http://127.0.0.1:${PORT}`);
});
