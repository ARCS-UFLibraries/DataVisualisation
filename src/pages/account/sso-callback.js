import React from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/react";

export default function AccountSSOCallback() {
  return (
    <main
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <AuthenticateWithRedirectCallback />
    </main>
  );
}