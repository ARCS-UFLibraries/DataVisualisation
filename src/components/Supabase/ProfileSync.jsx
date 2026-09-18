import React, { useContext, useEffect, useRef } from "react";
import { useUser } from "@clerk/react";
import { SupabaseContext } from "@site/src/lib/supabaseClient";

export default function ProfileSync() {
  const supabase = useContext(SupabaseContext);
  const { isLoaded, isSignedIn, user } = useUser();
  const syncedUserId = useRef(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user || !supabase) {
      syncedUserId.current = null;
      return;
    }

    if (syncedUserId.current === user.id) return;

    let cancelled = false;

    const createProfile = async () => {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            clerk_user_id: user.id,
            first_name: user.firstName || "Student",
            last_name: user.lastName || null,
            role: "student",
          },
          {
            onConflict: "clerk_user_id",
            ignoreDuplicates: true,
          }
        );

      if (error) {
        console.error("Profile sync failed:", error);
        return;
      }

      if (!cancelled) {
        syncedUserId.current = user.id;
        console.log("Profile synced successfully.");
      }
    };

    createProfile();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, user, supabase]);

  return null;
}