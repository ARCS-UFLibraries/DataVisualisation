import React, { useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  useSession,
} from "@clerk/react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function SupabaseProvider({
  children,
}) {
  const { session } = useSession();

  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  const supabase = useMemo(() => {
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
    <SupabaseContext.Provider
      value={supabase}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

export const SupabaseContext =
  React.createContext(null);