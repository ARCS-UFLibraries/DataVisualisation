import React from "react";
import { ClerkProvider } from "@clerk/react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { ProgressProvider } from "@site/src/context/ProgressContext";

export default function Root({ children }) {
  const {
    siteConfig: { customFields, baseUrl },
  } = useDocusaurusContext();

  const siteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${baseUrl}`
      : baseUrl;

  return (
    <ClerkProvider
      publishableKey={customFields.clerkPublishableKey}
      signInUrl={`${baseUrl}account/`}
      signUpUrl={`${baseUrl}account/`}
      signInFallbackRedirectUrl={siteUrl}
      signUpFallbackRedirectUrl={siteUrl}
    >
      <ProgressProvider>
        {children}
      </ProgressProvider>
    </ClerkProvider>
  );
}