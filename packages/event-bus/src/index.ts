import type { DomainEvent } from "@lifecoding/shared-types";

type EventHandler<TPayload> = (event: DomainEvent<TPayload>) => void | Promise<void>;

export class InMemoryEventBus {
  private handlers = new Map<string, EventHandler<unknown>[]>();

  subscribe<TPayload>(name: string, handler: EventHandler<TPayload>) {
    const current = this.handlers.get(name) ?? [];
    current.push(handler as EventHandler<unknown>);
    this.handlers.set(name, current);
  }

  async publish<TPayload>(event: DomainEvent<TPayload>) {
    const handlers = this.handlers.get(event.name) ?? [];
    await Promise.all(handlers.map((handler) => handler(event)));
  }
}

export const domainEvents = {
  userRegistered: "user_registered",
  onboardingCompleted: "onboarding_completed",
  ruleStarted: "rule_started",
  ruleLearned: "rule_learned",
  ruleApplied: "rule_applied",
  diaryEntryCreated: "diary_entry_created",
  feedPostPublished: "feed_post_published",
  achievementEarned: "achievement_earned"
} as const;
