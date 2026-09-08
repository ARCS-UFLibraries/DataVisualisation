import React from 'react';
import { ClerkProvider } from '@clerk/react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ProgressProvider } from '@site/src/context/ProgressContext';

export default function Root({ children }) {
  const {
    siteConfig: { customFields, baseUrl },
  } = useDocusaurusContext();

  return (
    <ClerkProvider
      publishableKey={customFields.clerkPublishableKey}
      signInUrl={`${baseUrl}sign-in`}
      signUpUrl={`${baseUrl}sign-up`}
      signInFallbackRedirectUrl={baseUrl}
      signUpFallbackRedirectUrl={baseUrl}
    >
      <ProgressProvider>
        {children}
      </ProgressProvider>
    </ClerkProvider>
  );
}