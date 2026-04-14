import { rulesService } from "@lifecoding/domain-rules";

export const recommendationsService = {
  async listForUser() {
    return rulesService.listRecommendedRules();
  }
};
