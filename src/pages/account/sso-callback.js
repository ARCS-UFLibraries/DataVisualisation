import React, { useEffect, useRef, useState } from "react";
import {
  useClerk,
  useSignIn,
  useSignUp,
} from "@clerk/react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function AccountSSOCallback() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();

  const [message, setMessage] = useState(
    "Completing Google authentication..."
  );

  const hasRun = useRef(false);

  useEffect(() => {
    if (!clerk.loaded || hasRun.current) {
      return;
    }

    hasRun.current = true;

    const finish = async () => {
      try {
        /*
         * Normal Google sign-in
         */
        if (signIn.status === "complete") {
          const { error } = await signIn.finalize();

          if (error) {
            throw error;
          }

          window.location.assign(
            `${window.location.origin}${baseUrl}`
          );

          return;
        }

        /*
         * Normal Google sign-up
         */
        if (signUp.status === "complete") {
          const { error } = await signUp.finalize();

          if (error) {
            throw error;
          }

          window.location.assign(
            `${window.location.origin}${baseUrl}`
          );

          return;
        }

        /*
         * Transfer an existing sign-up into sign-in
         */
        if (signUp.isTransferable) {
          await signIn.create({
            transfer: true,
          });

          if (signIn.status === "complete") {
            const { error } = await signIn.finalize();

            if (error) {
              throw error;
            }

            window.location.assign(
              `${window.location.origin}${baseUrl}`
            );

            return;
          }
        }

        /*
         * Transfer an existing sign-in into sign-up
         */
        if (signIn.isTransferable) {
          await signUp.create({
            transfer: true,
          });

          if (signUp.status === "complete") {
            const { error } = await signUp.finalize();

            if (error) {
              throw error;
            }

            window.location.assign(
              `${window.location.origin}${baseUrl}`
            );

            return;
          }
        }

        setMessage(
          `Google authentication needs another step. Sign-in status: ${signIn.status}; sign-up status: ${signUp.status}.`
        );
      } catch (error) {
        console.error(
          "Google OAuth callback error:",
          error
        );

        setMessage(
          error?.message ||
            "We could not complete Google authentication."
        );
      }
    };

    finish();
  }, [clerk, signIn, signUp, baseUrl]);

  return (
    <main
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <p>{message}</p>
    </main>
  );
}