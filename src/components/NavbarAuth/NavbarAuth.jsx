import React, { useEffect, useRef, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  useUser,
  SignOutButton,
} from "@clerk/react";
import styles from "./NavbarAuth.module.css";

export default function NavbarAuth() {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();

  const { isSignedIn, user, isLoaded } = useUser();

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // Wait until Clerk has loaded
  if (!isLoaded) {
    return null;
  }

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

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

  // =====================================================
  // LOGGED IN
  // =====================================================

  // IMPORTANT:
  // We use ONLY the first name entered by the user.
  const firstName =
    user.firstName || "Account";

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
      {/* ACCOUNT BUTTON */}

      <button
        type="button"
        className={styles.accountButton}
        onClick={() =>
          setIsOpen((previous) => !previous)
        }
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>
          Hi, {firstName}
        </span>

        <span
          className={`${styles.chevron} ${
            isOpen ? styles.chevronOpen : ""
          }`}
        >
          ▾
        </span>
      </button>

      {/* DROPDOWN */}

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

          {/* CLERK SIGN OUT */}

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