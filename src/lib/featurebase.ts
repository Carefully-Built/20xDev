export const FEATUREBASE_ORG = process.env.NEXT_PUBLIC_FEATUREBASE_ORG ?? "";

export interface FeaturebaseWidgetConfig {
  organization: string;
  theme: "light" | "dark";
  placement?: "right" | "left";
  email?: string;
  defaultBoard?: string;
  locale?: string;
  metadata?: Record<string, string>;
}

export interface FeaturebaseIdentifyConfig {
  organization: string;
  email: string;
  name: string;
  userId?: string;
  profilePicture?: string;
}

export interface FeaturebaseFunction {
  (
    action: "initialize_feedback_widget",
    config: FeaturebaseWidgetConfig,
  ): void;
  (
    action: "identify",
    config: FeaturebaseIdentifyConfig,
    callback?: (err: unknown) => void,
  ): void;
  q?: unknown[][];
}

declare global {
  interface Window {
    Featurebase: FeaturebaseFunction;
  }
}

export function ensureFeaturebase(): void {
  if (typeof window === "undefined") return;
  if (typeof window.Featurebase !== "function") {
    window.Featurebase = function featurebaseQueue(...args: unknown[]) {
      (window.Featurebase.q = window.Featurebase.q ?? []).push(args);
    } as FeaturebaseFunction;
  }
}
