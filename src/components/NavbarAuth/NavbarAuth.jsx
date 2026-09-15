import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./NavbarAuth.module.css";

export default function NavbarAuth() {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();

  const getAccountUrl = () => {
    if (typeof window === "undefined") {
      return `${baseUrl}account/`;
    }

    const currentUrl =
      window.location.pathname +
      window.location.search +
      window.location.hash;

    return `${baseUrl}account/?redirect=${encodeURIComponent(
      currentUrl
    )}`;
  };

  return (
    <a
      href={getAccountUrl()}
      className={styles.loginButton}
    >
      Log in
    </a>
  );
}