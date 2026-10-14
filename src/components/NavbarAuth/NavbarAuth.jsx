import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import { useUser, SignOutButton } from "@clerk/react";

import { SupabaseContext } from "@site/src/lib/supabaseClient";

import styles from "./NavbarAuth.module.css";

export default function NavbarAuth() {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();

  const { isSignedIn, user, isLoaded } = useUser();

  const supabase = useContext(SupabaseContext);

  const [isOpen, setIsOpen] = useState(false);
  const [joinedClassroom, setJoinedClassroom] = useState(null);

  const containerRef = useRef(null);

  // Close the dropdown when clicking outside it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Load the student's joined classroom
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || !supabase) {
      setJoinedClassroom(null);
      return;
    }

    let cancelled = false;

    const loadJoinedClassroom = async () => {
      const { data, error } = await supabase
        .from("classroom_members")
        .select(`
          classroom_id,
          classrooms (
            name,
            code
          )
        `)
        .eq("student_id", user.id)
        .limit(1);

      if (error) {
        console.error(
          "Unable to load joined classroom:",
          error
        );
        return;
      }

      if (cancelled) return;

      const membership = data?.[0];

      if (membership?.classrooms) {
        setJoinedClassroom(membership.classrooms);
      } else {
        setJoinedClassroom(null);
      }
    };

    loadJoinedClassroom();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, user, supabase]);

  // Wait until Clerk finishes loading
  if (!isLoaded) {
    return null;
  }

  // Signed out
  if (!isSignedIn || !user) {
    const currentUrl =
      typeof window !== "undefined"
        ? window.location.pathname +
          window.location.search +
          window.location.hash
        : "/";

    return (
      <a
        href={`${baseUrl}account/?redirect=${encodeURIComponent(
          currentUrl
        )}`}
        className={styles.loginButton}
      >
        Log in
      </a>
    );
  }

  // Use the user's first name
  const firstName = user.firstName || "Account";

  // Account creation date
  const learningSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        undefined,
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      )
    : "—";

  // Current page for logout redirect
  const currentPage =
    typeof window !== "undefined"
      ? window.location.pathname +
        window.location.search +
        window.location.hash
      : baseUrl;

  return (
    <div
      ref={containerRef}
      className={styles.accountContainer}
    >
      {/* Account button */}
      <button
        type="button"
        className={styles.accountButton}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Hi, {firstName}</span>

        <span
          className={`${styles.chevron} ${
            isOpen ? styles.chevronOpen : ""
          }`}
        >
          ▾
        </span>
      </button>

      {/* Account dropdown */}
      {isOpen && (
        <div className={styles.accountMenu}>
          <div className={styles.accountHeader}>
            <div className={styles.accountGreeting}>
              Hi, {firstName}
            </div>
          </div>

          <div className={styles.accountInfo}>
            <div className={styles.infoLabel}>
              Learning since
            </div>

            <div className={styles.infoValue}>
              {learningSince}
            </div>
          </div>

          <div className={styles.menuDivider} />

          {/* Classroom status */}
          {joinedClassroom ? (
            <div className={styles.classroomJoined}>
              <div>Classroom joined</div>

              <div className={styles.classroomCode}>
                #{joinedClassroom.code}
              </div>
            </div>
          ) : (
            <a
              href={`${baseUrl}account/`}
              className={styles.logoutButton}
              onClick={() => setIsOpen(false)}
            >
              Join a Classroom
            </a>
          )}

          <div className={styles.menuDivider} />

          {/* Logout */}
          <SignOutButton
            signOutOptions={{
              redirectUrl: currentPage,
            }}
          >
            <button
              type="button"
              className={styles.logoutButton}
              onClick={() => setIsOpen(false)}
            >
              Log out
            </button>
          </SignOutButton>
        </div>
      )}
    </div>
  );
}