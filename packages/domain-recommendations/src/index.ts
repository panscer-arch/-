import { mockRules } from "@lifecoding/domain-rules";

export const recommendationsService = {
  async listForUser() {
    return [mockRules[1], mockRules[2]];
  }
};
