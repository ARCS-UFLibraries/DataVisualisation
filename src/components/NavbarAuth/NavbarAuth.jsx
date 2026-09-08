import React from "react";
import Link from "@docusaurus/Link";
import styles from "./NavbarAuth.module.css";

export default function NavbarAuth() {
  return (
    <Link to="/account/" className={styles.loginButton}>
      Log in
    </Link>
  );
}