import { appConfig, type FeatureKey } from "@lifecoding/config";

type FeatureFlagMap = Record<FeatureKey, boolean>;

const activeFlags: FeatureFlagMap = { ...appConfig.featureDefaults };

export function isFeatureEnabled(feature: FeatureKey) {
  return activeFlags[feature];
}

export function setFeatureFlag(feature: FeatureKey, enabled: boolean) {
  activeFlags[feature] = enabled;
}

export function getFeatureFlags() {
  return { ...activeFlags };
}
