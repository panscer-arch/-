import http from "node:http";
import { config } from "./config.js";

export class HttpServer {
  private server?: http.Server;

  constructor(
    private readonly handlers: {
      onTelegramWebhook: (body: string) => Promise<{ status: number; body: string }>;
      onHealthcheck: () => { status: number; body: string };
    }
  ) {}

  async start() {
    if (this.server) {
      return;
    }

    this.server = http.createServer(async (req, res) => {
      if (req.method === "GET" && req.url === "/health") {
        const result = this.handlers.onHealthcheck();
        res.writeHead(result.status, { "Content-Type": "application/json" });
        res.end(result.body);
        return;
      }

      if (req.method === "POST" && req.url === config.telegramWebhookPath) {
        const body = await readBody(req);
        const result = await this.handlers.onTelegramWebhook(body);
        res.writeHead(result.status, { "Content-Type": "application/json" });
        res.end(result.body);
        return;
      }

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
    });

    await new Promise<void>((resolve, reject) => {
      this.server?.listen(config.webhookPort, "0.0.0.0", () => resolve());
      this.server?.on("error", reject);
    });
  }

  async stop() {
    if (!this.server) {
      return;
    }
    await new Promise<void>((resolve, reject) => {
      this.server?.close((error) => (error ? reject(error) : resolve()));
    });
    this.server = undefined;
  }
}

async function readBody(req: http.IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}
