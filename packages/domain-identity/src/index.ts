import type { User } from "@lifecoding/shared-types";

export interface IdentityContract {
  getCurrentUser(): Promise<User | null>;
}

const currentUser: User = {
  id: "user_1",
  email: "hello@lifecoding.app",
  role: "user",
  createdAt: "2026-04-11T12:00:00.000Z"
};

export const identityService: IdentityContract = {
  async getCurrentUser() {
    return currentUser;
  }
};
