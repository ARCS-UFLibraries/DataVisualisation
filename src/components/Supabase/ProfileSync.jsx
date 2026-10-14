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

    const syncUser = async () => {
      // ---------------------------------------------
      // 1. Create the student's profile
      // ---------------------------------------------
      const { error: profileError } = await supabase
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

      if (profileError) {
        console.error(
          "Profile sync failed:",
          profileError
        );
        return;
      }

      // ---------------------------------------------
      // 2. Check whether a classroom code was
      //    entered during signup
      // ---------------------------------------------
      const classroomCode =
        user.unsafeMetadata?.classroomCode;

      if (classroomCode) {
        const { data, error: classroomError } =
          await supabase.rpc(
            "join_classroom_by_code",
            {
              p_code: String(classroomCode)
                .trim()
                .toUpperCase(),
            }
          );

        if (classroomError) {
          console.error(
            "Automatic classroom join failed:",
            classroomError
          );
        } else {
          const classroom = data?.[0];

          if (classroom) {
            console.log(
              `Automatically joined classroom: ${classroom.classroom_name}`
            );
          }
        }
      }

      if (!cancelled) {
        syncedUserId.current = user.id;
        console.log("Profile sync completed.");
      }
    };

    syncUser();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, user, supabase]);

  return null;
}