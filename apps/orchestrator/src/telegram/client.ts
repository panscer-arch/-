import { config } from "../config.js";
import type { MessageContext } from "../types.js";

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id?: number;
    date: number;
    text?: string;
    chat: { id: number };
    from?: { id: number; username?: string; is_bot?: boolean };
  };
}

export class TelegramClient {
  private baseUrl() {
    return `https://api.telegram.org/bot${config.telegram.token}`;
  }

  async getUpdates(offset?: number): Promise<TelegramUpdate[]> {
    const url = new URL(`${this.baseUrl()}/getUpdates`);
    if (offset) {
      url.searchParams.set("offset", String(offset));
    }
    url.searchParams.set("timeout", "10");

    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Telegram getUpdates failed: ${response.status} ${text}`);
    }

    const json = (await response.json()) as { ok: boolean; result: TelegramUpdate[] };
    return json.result;
  }

  async sendMessage(chatId: number, text: string) {
    const response = await fetch(`${this.baseUrl()}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Telegram sendMessage failed: ${response.status} ${body}`);
    }
  }

  normalizeMessage(update: TelegramUpdate): MessageContext | null {
    if (!update.message?.text) {
      return null;
    }

    if (update.message.from?.is_bot) {
      return null;
    }

    const chatId = update.message.chat.id;
    if (config.telegram.allowedChatId && chatId !== config.telegram.allowedChatId) {
      return null;
    }

    return {
      updateId: update.update_id,
      messageId: update.message.message_id,
      chatId,
      userId: update.message.from?.id ?? 0,
      username: update.message.from?.username,
      text: update.message.text.trim(),
      receivedAt: new Date(update.message.date * 1000).toISOString()
    };
  }

  parseWebhookBody(rawBody: string) {
    return JSON.parse(rawBody) as TelegramUpdate;
  }
}
