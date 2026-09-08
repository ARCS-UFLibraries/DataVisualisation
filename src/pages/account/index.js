import React, { useState } from "react";
import {
  useAuth,
  useSignIn,
  useSignUp,
} from "@clerk/react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

export default function AccountPage() {
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [classroomCode, setClassroomCode] = useState("");

  const [verificationCode, setVerificationCode] = useState("");
  const [loginCode, setLoginCode] = useState("");

  const [signupVerification, setSignupVerification] =
    useState(false);
  const [loginVerification, setLoginVerification] =
    useState(false);

  const [message, setMessage] = useState("");

  const { isSignedIn } = useAuth();

  const {
    signIn,
    errors: signInErrors,
    fetchStatus: signInStatus,
  } = useSignIn();

  const {
    signUp,
    errors: signUpErrors,
    fetchStatus: signUpStatus,
  } = useSignUp();

  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();

  const isLoading =
    signInStatus === "fetching" ||
    signUpStatus === "fetching";

  // --------------------------------
  // GOOGLE LOGIN
  // --------------------------------

  const handleGoogleLogin = async () => {
    setMessage("");

    const { error } = await signIn.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: `${baseUrl}account/sso-callback/`,
      redirectUrl: baseUrl,
    });

    if (error) {
      setMessage(
        error.message || "Unable to continue with Google."
      );
    }
  };

  // --------------------------------
  // GOOGLE SIGN UP
  // --------------------------------

  const handleGoogleSignup = async () => {
    setMessage("");

    const { error } = await signUp.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: `${baseUrl}account/sso-callback/`,
      redirectUrl: baseUrl,
    });

    if (error) {
      setMessage(
        error.message || "Unable to continue with Google."
      );
    }
  };
  // --------------------------------
  // EMAIL / PASSWORD SIGN UP
  // --------------------------------

  const handleSignUp = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!emailAddress.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setMessage("Please enter a password.");
      return;
    }

    const result = await signUp.password({
      emailAddress: emailAddress.trim(),
      password,
      firstName: name.trim(),
      ...(classroomCode.trim()
        ? {
            unsafeMetadata: {
              classroomCode:
                classroomCode.trim().toUpperCase(),
            },
          }
        : {}),
    });

    if (result.error) {
      setMessage(
        result.error.message ||
          "Unable to create your account."
      );
      return;
    }

    const verificationResult =
      await signUp.verifications.sendEmailCode();

    if (verificationResult.error) {
      setMessage(
        verificationResult.error.message ||
          "We could not send the verification code."
      );
      return;
    }

    setSignupVerification(true);
    setMessage("");
  };

  // --------------------------------
  // SIGN UP EMAIL VERIFICATION
  // --------------------------------

  const handleVerifySignup = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!verificationCode.trim()) {
      setMessage("Please enter the verification code.");
      return;
    }

    const result =
      await signUp.verifications.verifyEmailCode({
        code: verificationCode.trim(),
      });

    if (result.error) {
      setMessage(
        result.error.message ||
          "The verification code is incorrect."
      );
      return;
    }

    if (signUp.status !== "complete") {
      setMessage(
        "Your email was verified, but your account is not ready yet."
      );
      return;
    }

    const finalizeResult = await signUp.finalize({
      navigate: ({ decorateUrl }) => {
        window.location.href = decorateUrl(baseUrl);
      },
    });

    if (finalizeResult.error) {
      setMessage(
        finalizeResult.error.message ||
          "Your account was created, but we could not finish signing you in."
      );
    }
  };

  // --------------------------------
  // EMAIL / PASSWORD LOGIN
  // --------------------------------

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!emailAddress.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setMessage("Please enter your password.");
      return;
    }

    const result = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (result.error) {
      setMessage(
        result.error.message ||
          "Unable to sign you in."
      );
      return;
    }

    if (signIn.status === "complete") {
      const finalizeResult = await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          window.location.href =
            decorateUrl(baseUrl);
        },
      });

      if (finalizeResult.error) {
        setMessage(
          finalizeResult.error.message ||
            "Login succeeded, but we could not finish your session."
        );
      }

      return;
    }

    if (signIn.status === "needs_second_factor") {
      setMessage(
        "Additional verification is required for this account."
      );
      return;
    }

    if (signIn.status !== "complete") {
      setMessage(
        "Your account requires another authentication step."
      );
    }
  };

  // --------------------------------
  // EMAIL CODE LOGIN
  // --------------------------------

  const handleSendLoginCode = async () => {
    setMessage("");

    if (!emailAddress.trim()) {
      setMessage(
        "Please enter your email address first."
      );
      return;
    }

    const result =
      await signIn.emailCode.sendCode();

    if (result.error) {
      setMessage(
        result.error.message ||
          "Unable to send a verification code."
      );
      return;
    }

    setLoginVerification(true);
  };

  // --------------------------------
  // EMAIL CODE VERIFICATION
  // --------------------------------

  const handleVerifyLoginCode = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!loginCode.trim()) {
      setMessage("Please enter the verification code.");
      return;
    }

    const result =
      await signIn.emailCode.verifyCode({
        code: loginCode.trim(),
      });

    if (result.error) {
      setMessage(
        result.error.message ||
          "The verification code is incorrect."
      );
      return;
    }

    if (signIn.status !== "complete") {
      setMessage(
        "Additional verification is required."
      );
      return;
    }

    const finalizeResult = await signIn.finalize({
      navigate: ({ decorateUrl }) => {
        window.location.href =
          decorateUrl(baseUrl);
      },
    });

    if (finalizeResult.error) {
      setMessage(
        finalizeResult.error.message ||
          "We could not finish signing you in."
      );
    }
  };

  // --------------------------------
  // ALREADY SIGNED IN
  // --------------------------------

  if (isSignedIn) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.icon}>✅</div>

            <h1>You are signed in</h1>

            <p>
              Your account is active.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.icon}>
            {mode === "login"
              ? "👋"
              : signupVerification
              ? "✉️"
              : "✨"}
          </div>

          <h1>
            {mode === "login"
              ? "Welcome back"
              : signupVerification
              ? "Verify your email"
              : "Create your account"}
          </h1>

          <p>
            {mode === "login"
              ? "Sign in to continue your learning journey."
              : signupVerification
              ? `Enter the verification code sent to ${emailAddress}.`
              : "Create an account to save your progress and join a classroom."}
          </p>
        </div>

        {/* LOGIN / SIGNUP TABS */}
        {!signupVerification &&
          !loginVerification && (
            <div className={styles.tabs}>
              <button
                type="button"
                className={`${styles.tab} ${
                  mode === "login"
                    ? styles.activeTab
                    : ""
                }`}
                onClick={() => {
                  setMode("login");
                  setMessage("");
                  setPassword("");
                }}
              >
                Log In
              </button>

              <button
                type="button"
                className={`${styles.tab} ${
                  mode === "signup"
                    ? styles.activeTab
                    : ""
                }`}
                onClick={() => {
                  setMode("signup");
                  setMessage("");
                  setPassword("");
                }}
              >
                Create Account
              </button>
            </div>
          )}

        <div className={styles.formArea}>

          {/* ==============================
              LOGIN
          ============================== */}

          {mode === "login" &&
            !loginVerification &&
            !signupVerification && (
              <form
                className={styles.customForm}
                onSubmit={handleLogin}
              >

                <div className={styles.field}>
                  <label htmlFor="login-email">
                    Email
                  </label>

                  <input
                    id="login-email"
                    type="email"
                    value={emailAddress}
                    onChange={(event) =>
                      setEmailAddress(
                        event.target.value
                      )
                    }
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="login-password">
                    Password
                  </label>

                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={styles.input}
                  />
                </div>

                {message && (
                  <p className={styles.errorMessage}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Signing In..."
                    : "Log In"}
                </button>

                <div className={styles.divider}>
                  <span>or</span>
                </div>

                <button
                  type="button"
                  className={styles.googleButton}
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <span
                    className={styles.googleIcon}
                  >
                    G
                  </span>
                  Continue with Google
                </button>

                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleSendLoginCode}
                  disabled={isLoading}
                >
                  Sign in with Email Code
                </button>
              </form>
            )}

          {/* ==============================
              LOGIN EMAIL CODE
          ============================== */}

          {loginVerification &&
            !signupVerification && (
              <form
                className={styles.customForm}
                onSubmit={handleVerifyLoginCode}
              >
                <div className={styles.field}>
                  <label htmlFor="login-code">
                    Verification Code
                  </label>

                  <input
                    id="login-code"
                    type="text"
                    value={loginCode}
                    onChange={(event) =>
                      setLoginCode(
                        event.target.value
                      )
                    }
                    placeholder="Enter the code from your email"
                    autoComplete="one-time-code"
                    className={styles.input}
                  />
                </div>

                {message && (
                  <p className={styles.errorMessage}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Verifying..."
                    : "Verify & Log In"}
                </button>

                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={async () => {
                    setMessage("");

                    const result =
                      await signIn.emailCode.sendCode();

                    if (result.error) {
                      setMessage(
                        result.error.message ||
                          "Unable to resend the code."
                      );
                    } else {
                      setMessage(
                        "A new verification code was sent."
                      );
                    }
                  }}
                  disabled={isLoading}
                >
                  Resend Code
                </button>
              </form>
            )}

          {/* ==============================
              SIGN UP
          ============================== */}

          {mode === "signup" &&
            !signupVerification &&
            !loginVerification && (
              <form
                className={styles.customForm}
                onSubmit={handleSignUp}
              >

                <div className={styles.field}>
                  <label htmlFor="signup-name">
                    Name
                  </label>

                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Enter your name"
                    autoComplete="name"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="signup-email">
                    Email
                  </label>

                  <input
                    id="signup-email"
                    type="email"
                    value={emailAddress}
                    onChange={(event) =>
                      setEmailAddress(
                        event.target.value
                      )
                    }
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="signup-password">
                    Password
                  </label>

                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className={styles.input}
                  />
                </div>

                <div className={styles.classroomSection}>
                  <label htmlFor="classroom-code">
                    Classroom Code{" "}
                    <span>(Optional)</span>
                  </label>

                  <input
                    id="classroom-code"
                    type="text"
                    value={classroomCode}
                    onChange={(event) =>
                      setClassroomCode(
                        event.target.value.toUpperCase()
                      )
                    }
                    placeholder="e.g. DATA2026"
                    className={styles.input}
                  />

                  <p>
                    Have a classroom code from your
                    professor? Enter it here to join
                    your class.
                  </p>
                </div>

                {message && (
                  <p className={styles.errorMessage}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

                <div className={styles.divider}>
                  <span>or</span>
                </div>

                <button
                  type="button"
                  className={styles.googleButton}
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                >
                  <span
                    className={styles.googleIcon}
                  >
                    G
                  </span>
                  Continue with Google
                </button>
              </form>
            )}

          {/* ==============================
              SIGN UP VERIFICATION
          ============================== */}

          {signupVerification &&
            !loginVerification && (
              <form
                className={styles.customForm}
                onSubmit={handleVerifySignup}
              >

                <div className={styles.field}>
                  <label htmlFor="signup-code">
                    Verification Code
                  </label>

                  <input
                    id="signup-code"
                    type="text"
                    value={verificationCode}
                    onChange={(event) =>
                      setVerificationCode(
                        event.target.value
                      )
                    }
                    placeholder="Enter the code from your email"
                    autoComplete="one-time-code"
                    className={styles.input}
                  />
                </div>

                {message && (
                  <p className={styles.errorMessage}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Verifying..."
                    : "Verify Email"}
                </button>

                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={async () => {
                    setMessage("");

                    const result =
                      await signUp.verifications.sendEmailCode();

                    if (result.error) {
                      setMessage(
                        result.error.message ||
                          "Unable to resend the code."
                      );
                    } else {
                      setMessage(
                        "A new verification code was sent."
                      );
                    }
                  }}
                  disabled={isLoading}
                >
                  Resend Code
                </button>
              </form>
            )}

        </div>

        {/* BOTTOM SWITCH */}
        {!signupVerification &&
          !loginVerification && (
            <div className={styles.switchText}>
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setMessage("");
                      setPassword("");
                    }}
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setMessage("");
                      setPassword("");
                    }}
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          )}

        {/* Clerk CAPTCHA container */}
        <div id="clerk-captcha" />
      </div>
    </main>
  );
}