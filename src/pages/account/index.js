import React, { useState } from "react";
import { SignIn, SignUp } from "@clerk/react";
import styles from "./styles.module.css";

export default function AccountPage() {
  const [mode, setMode] = useState("login");
  const [classroomCode, setClassroomCode] = useState("");

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.icon}>
            {mode === "login" ? "👋" : "✨"}
          </div>

          <h1>
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h1>

          <p>
            {mode === "login"
              ? "Sign in to continue your learning journey."
              : "Create an account to save your course progress."}
          </p>
        </div>

        {/* Login / Signup tabs */}
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${
              mode === "login" ? styles.activeTab : ""
            }`}
            onClick={() => setMode("login")}
          >
            Log In
          </button>

          <button
            type="button"
            className={`${styles.tab} ${
              mode === "signup" ? styles.activeTab : ""
            }`}
            onClick={() => setMode("signup")}
          >
            Create Account
          </button>
        </div>

        {/* Authentication */}
        <div className={styles.formArea}>
          {mode === "login" ? (
            <SignIn routing="hash" />
          ) : (
            <>
              <SignUp routing="hash" />

              <div className={styles.classroomSection}>
                <label htmlFor="classroom-code">
                  Classroom Code <span>(Optional)</span>
                </label>

                <input
                  id="classroom-code"
                  type="text"
                  value={classroomCode}
                  onChange={(event) =>
                    setClassroomCode(event.target.value.toUpperCase())
                  }
                  placeholder="e.g. DATA2026"
                  className={styles.classroomInput}
                  maxLength={20}
                />

                <p>
                  Have a classroom code from your professor?
                  Enter it here to join your class.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}