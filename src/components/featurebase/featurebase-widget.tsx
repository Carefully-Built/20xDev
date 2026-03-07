"use client";

import Script from "next/script";
import { useEffect, useCallback } from "react";
import { useTheme } from "next-themes";

import { FEATUREBASE_ORG, ensureFeaturebase } from "@/lib/featurebase";

interface FeaturebaseWidgetProps {
  readonly email?: string;
  readonly name?: string;
  readonly userId?: string;
  readonly profilePicture?: string;
}

export function FeaturebaseWidget({
  email,
  name,
  userId,
  profilePicture,
}: FeaturebaseWidgetProps): React.ReactElement | null {
  const { resolvedTheme } = useTheme();

  const initWidget = useCallback(() => {
    ensureFeaturebase();

    // Identify user if email is available
    if (email) {
      window.Featurebase(
        "identify",
        {
          organization: FEATUREBASE_ORG,
          email,
          name: name ?? email,
          userId,
          profilePicture,
        },
        (err: unknown) => {
          if (err) {
            console.error("Featurebase identification failed:", err);
          }
        },
      );
    }

    // Initialize feedback widget without placement (no floating button)
    // Widget is triggered via data-featurebase-feedback attribute on sidebar nav
    window.Featurebase("initialize_feedback_widget", {
      organization: FEATUREBASE_ORG,
      theme: resolvedTheme === "dark" ? "dark" : "light",
      locale: "en",
      email,
    });
  }, [email, name, userId, profilePicture, resolvedTheme]);

  useEffect(() => {
    // If script is already loaded, initialize immediately
    if (
      typeof window !== "undefined" &&
      document.getElementById("featurebase-sdk")
    ) {
      initWidget();
    }
  }, [initWidget]);

  if (!FEATUREBASE_ORG) {
    return null;
  }

  return (
    <Script
      id="featurebase-sdk"
      src="https://do.featurebase.app/js/sdk.js"
      strategy="lazyOnload"
      onLoad={initWidget}
    />
  );
}
