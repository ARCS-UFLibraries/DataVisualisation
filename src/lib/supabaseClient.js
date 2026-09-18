import { createClient } from "@supabase/supabase-js";
import {
  useSession,
} from "@clerk/react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import React, { useMemo } from "react";

export const SupabaseContext =
  React.createContext(null);

export function SupabaseProvider({ children }) {
  const { session } = useSession();

  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  const supabase = useMemo(() => {
    if (
      !customFields.supabaseUrl ||
      !customFields.supabasePublishableKey
    ) {
      return null;
    }

    return createClient(
      customFields.supabaseUrl,
      customFields.supabasePublishableKey,
      {
        accessToken: async () => {
          if (!session) {
            return null;
          }

          return await session.getToken();
        },
      }
    );
  }, [
    customFields.supabaseUrl,
    customFields.supabasePublishableKey,
    session,
  ]);

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}