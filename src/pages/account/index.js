import React, { useState, useEffect } from "react";
import {
  useAuth,
  useSignIn,
  useSignUp,
} from "@clerk/react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

export default function AccountPage() {
  const [mode, setMode] = useState("login");
  const [redirectUrl, setRedirectUrl] = useState(null);

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [classroomCode, setClassroomCode] = useState("");

  const [signupVerification, setSignupVerification] =
    useState(false);
  const [verificationCode, setVerificationCode] =
    useState("");

  const [loginVerification, setLoginVerification] =
    useState(false);
  const [loginCode, setLoginCode] = useState("");

  const [forgotPassword, setForgotPassword] =
    useState(false);
  const [resetCodeSent, setResetCodeSent] =
    useState(false);
  const [resetCodeVerified, setResetCodeVerified] =
    useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const { isSignedIn } = useAuth();

  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();

  const siteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${baseUrl}`
      : baseUrl;

  // =====================================================
  // CAPTURE REDIRECT URL ON MOUNT
  // =====================================================

  useEffect(() => {
    if (typeof window === "undefined")
      return;

    // Check for redirect URL in query params
    const params = new URLSearchParams(
      window.location.search
    );
    const redirectParam =
      params.get("redirect");

    if (redirectParam) {
      setRedirectUrl(redirectParam);
      return;
    }

    // Try to get from sessionStorage
    const storedRedirect =
      sessionStorage.getItem(
        "loginRedirectUrl"
      );

    if (storedRedirect) {
      setRedirectUrl(storedRedirect);
      return;
    }

    // Use referrer if it's from the same site
    const referrer = document.referrer;
    if (
      referrer &&
      referrer.startsWith(
        window.location.origin
      )
    ) {
      setRedirectUrl(referrer);
    }
  }, []);

  const callbackUrl =
    `${siteUrl}account/sso-callback`;

  const goHome = () => {
    // Clear the stored redirect URL
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(
        "loginRedirectUrl"
      );
    }

    // Redirect to the previous page or home
    const destination =
      redirectUrl || siteUrl;
    window.location.assign(destination);
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = async () => {
    setMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await signIn.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: callbackUrl,
        redirectUrl:
          redirectUrl || siteUrl,
      });

      if (error) {
        setMessage(
          error.message ||
            "Unable to continue with Google."
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      setMessage(
        error?.message ||
          "Unable to continue with Google."
      );

      setIsSubmitting(false);
    }
  };

  // =====================================================
  // GOOGLE SIGN UP
  // =====================================================

  const handleGoogleSignup = async () => {
    setMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await signUp.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: callbackUrl,
        redirectUrl:
          redirectUrl || siteUrl,
        ...(classroomCode.trim()
          ? {
              unsafeMetadata: {
                classroomCode:
                  classroomCode
                    .trim()
                    .toUpperCase(),
              },
            }
          : {}),
      });

      if (error) {
        setMessage(
          error.message ||
            "Unable to continue with Google."
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(
        "Google signup error:",
        error
      );

      setMessage(
        error?.message ||
          "Unable to continue with Google."
      );

      setIsSubmitting(false);
    }
  };

  // =====================================================
  // EMAIL / PASSWORD SIGN UP
  // =====================================================

  const handleSignUp = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    try {
      if (!name.trim()) {
        setMessage("Please enter your name.");
        setIsSubmitting(false);
        return;
      }

      if (!emailAddress.trim()) {
        setMessage(
          "Please enter your email address."
        );
        setIsSubmitting(false);
        return;
      }

      if (!password) {
        setMessage(
          "Please enter a password."
        );
        setIsSubmitting(false);
        return;
      }

      const { error } =
        await signUp.password({
          emailAddress:
            emailAddress.trim(),
          password,
          firstName: name.trim(),
          ...(classroomCode.trim()
            ? {
                unsafeMetadata: {
                  classroomCode:
                    classroomCode
                      .trim()
                      .toUpperCase(),
                },
              }
            : {}),
        });

      if (error) {
        setMessage(
          error.message ||
            "Unable to create your account."
        );
        setIsSubmitting(false);
        return;
      }

      const {
        error: verificationError,
      } =
        await signUp.verifications.sendEmailCode();

      if (verificationError) {
        setMessage(
          verificationError.message ||
            "We could not send the verification code."
        );
        setIsSubmitting(false);
        return;
      }

      setSignupVerification(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      setMessage(
        error?.message ||
          "Something went wrong while creating your account."
      );

      setIsSubmitting(false);
    }
  };

  // =====================================================
  // VERIFY SIGN UP
  // =====================================================

  const handleVerifySignup = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    try {
      const { error } =
        await signUp.verifications.verifyEmailCode({
          code: verificationCode.trim(),
        });

      if (error) {
        setMessage(
          error.message ||
            "The verification code is incorrect."
        );
        setIsSubmitting(false);
        return;
      }

      if (signUp.status !== "complete") {
        setMessage(
          "Your email was verified, but additional information is required."
        );
        setIsSubmitting(false);
        return;
      }

      const { error: finalizeError } =
        await signUp.finalize();

      if (finalizeError) {
        setMessage(
          finalizeError.message ||
            "Unable to complete account creation."
        );
        setIsSubmitting(false);
        return;
      }

      goHome();
    } catch (error) {
      console.error(
        "Signup verification error:",
        error
      );

      setMessage(
        error?.message ||
          "Something went wrong while verifying your email."
      );

      setIsSubmitting(false);
    }
  };

  // =====================================================
  // EMAIL / PASSWORD LOGIN
  // =====================================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    try {
      if (!emailAddress.trim()) {
        setMessage(
          "Please enter your email address."
        );
        setIsSubmitting(false);
        return;
      }

      if (!password) {
        setMessage(
          "Please enter your password."
        );
        setIsSubmitting(false);
        return;
      }

      const { error } =
        await signIn.password({
          emailAddress:
            emailAddress.trim(),
          password,
        });

      if (error) {
        setMessage(
          error.message ||
            "Unable to sign you in."
        );
        setIsSubmitting(false);
        return;
      }

      if (signIn.status === "complete") {
        const { error: finalizeError } =
          await signIn.finalize();

        if (finalizeError) {
          setMessage(
            finalizeError.message ||
              "Unable to complete sign in."
          );
          setIsSubmitting(false);
          return;
        }

        goHome();
        return;
      }

      setMessage(
        `Login requires another step: ${signIn.status}`
      );

      setIsSubmitting(false);
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setMessage(
        error?.message ||
          "Something went wrong while signing in."
      );

      setIsSubmitting(false);
    }
  };

  // =====================================================
  // EMAIL CODE LOGIN
  // =====================================================

  const handleSendLoginCode = async () => {
    setMessage("");
    setIsSubmitting(true);

    try {
      if (!emailAddress.trim()) {
        setMessage(
          "Please enter your email address first."
        );
        setIsSubmitting(false);
        return;
      }

      const { error: createError } =
        await signIn.create({
          identifier:
            emailAddress.trim(),
        });

      if (createError) {
        setMessage(
          createError.message ||
            "Unable to start email-code login."
        );
        setIsSubmitting(false);
        return;
      }

      const { error } =
        await signIn.emailCode.sendCode();

      if (error) {
        setMessage(
          error.message ||
            "Unable to send the verification code."
        );
        setIsSubmitting(false);
        return;
      }

      setLoginVerification(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error(
        "Email code login error:",
        error
      );

      setMessage(
        error?.message ||
          "Something went wrong while sending the email code."
      );

      setIsSubmitting(false);
    }
  };

  // =====================================================
  // VERIFY EMAIL CODE LOGIN
  // =====================================================

  const handleVerifyLoginCode = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    try {
      const { error } =
        await signIn.emailCode.verifyCode({
          code: loginCode.trim(),
        });

      if (error) {
        setMessage(
          error.message ||
            "The verification code is incorrect."
        );
        setIsSubmitting(false);
        return;
      }

      if (signIn.status !== "complete") {
        setMessage(
          `Login requires another step: ${signIn.status}`
        );
        setIsSubmitting(false);
        return;
      }

      const { error: finalizeError } =
        await signIn.finalize();

      if (finalizeError) {
        setMessage(
          finalizeError.message ||
            "Unable to complete sign in."
        );
        setIsSubmitting(false);
        return;
      }

      goHome();
    } catch (error) {
      console.error(
        "Email code verification error:",
        error
      );

      setMessage(
        error?.message ||
          "Something went wrong while verifying the code."
      );

      setIsSubmitting(false);
    }
  };

  // =====================================================
  // FORGOT PASSWORD — SEND CODE
  // =====================================================

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    try {
      if (!emailAddress.trim()) {
        setMessage(
          "Enter the email address associated with your account."
        );
        setIsSubmitting(false);
        return;
      }

      const { error: createError } =
        await signIn.create({
          identifier:
            emailAddress.trim(),
        });

      if (createError) {
        setMessage(
          createError.message ||
            "Unable to start password reset."
        );
        setIsSubmitting(false);
        return;
      }

      const { error } =
        await signIn.resetPasswordEmailCode.sendCode();

      if (error) {
        setMessage(
          error.message ||
            "Unable to send the password reset code."
        );
        setIsSubmitting(false);
        return;
      }

      setResetCodeSent(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      setMessage(
        error?.message ||
          "Something went wrong while starting password reset."
      );

      setIsSubmitting(false);
    }
  };

  // =====================================================
  // VERIFY PASSWORD RESET CODE
  // =====================================================

  const handleVerifyResetCode = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    try {
      const { error } =
        await signIn.resetPasswordEmailCode.verifyCode({
          code: resetCode.trim(),
        });

      if (error) {
        setMessage(
          error.message ||
            "The password reset code is incorrect."
        );
        setIsSubmitting(false);
        return;
      }

      setResetCodeVerified(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error(
        "Reset code verification error:",
        error
      );

      setMessage(
        error?.message ||
          "Something went wrong while verifying the reset code."
      );

      setIsSubmitting(false);
    }
  };

  // =====================================================
  // SET NEW PASSWORD
  // =====================================================

  const handleNewPassword = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    try {
      if (!newPassword) {
        setMessage(
          "Please enter a new password."
        );
        setIsSubmitting(false);
        return;
      }

      const { error } =
        await signIn.resetPasswordEmailCode.submitPassword({
          password: newPassword,
          signOutOfOtherSessions: true,
        });

      if (error) {
        setMessage(
          error.message ||
            "Unable to update your password."
        );
        setIsSubmitting(false);
        return;
      }

      if (signIn.status === "complete") {
        const { error: finalizeError } =
          await signIn.finalize();

        if (finalizeError) {
          setMessage(
            finalizeError.message ||
              "Password changed, but we could not finish signing you in."
          );
          setIsSubmitting(false);
          return;
        }

        goHome();
      }
    } catch (error) {
      console.error(
        "New password error:",
        error
      );

      setMessage(
        error?.message ||
          "Something went wrong while updating your password."
      );

      setIsSubmitting(false);
    }
  };

  // =====================================================
  // SIGNED IN
  // =====================================================

  if (isSignedIn) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.icon}>
              ✅
            </div>

            <h1>You are signed in</h1>

            <p>Your account is active.</p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // FORGOT PASSWORD — EMAIL
  // =====================================================

  if (
    forgotPassword &&
    !resetCodeSent
  ) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.icon}>
              🔑
            </div>

            <h1>
              Forgot your password?
            </h1>

            <p>
              Enter your registered email address
              and we'll send you a password reset
              code.
            </p>
          </div>

          <div className={styles.formArea}>
            <form
              className={styles.customForm}
              onSubmit={handleForgotPassword}
            >
              <div className={styles.field}>
                <label htmlFor="reset-email">
                  Email
                </label>

                <input
                  id="reset-email"
                  type="email"
                  value={emailAddress}
                  onChange={(event) =>
                    setEmailAddress(
                      event.target.value
                    )
                  }
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  className={styles.input}
                />
              </div>

              {message && (
                <p
                  className={
                    styles.errorMessage
                  }
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                className={
                  styles.submitButton
                }
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Sending..."
                  : "Send Reset Code"}
              </button>

              <button
                type="button"
                className={
                  styles.secondaryButton
                }
                onClick={() => {
                  setForgotPassword(false);
                  setResetCodeSent(false);
                  setResetCodeVerified(false);
                  setMessage("");
                }}
              >
                Back to Log In
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // FORGOT PASSWORD — VERIFY CODE
  // =====================================================

  if (
    forgotPassword &&
    resetCodeSent &&
    !resetCodeVerified
  ) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.icon}>
              ✉️
            </div>

            <h1>Check your email</h1>

            <p>
              Enter the password reset code sent
              to {emailAddress}.
            </p>
          </div>

          <div className={styles.formArea}>
            <form
              className={styles.customForm}
              onSubmit={handleVerifyResetCode}
            >
              <div className={styles.field}>
                <label htmlFor="reset-code">
                  Verification Code
                </label>

                <input
                  id="reset-code"
                  type="text"
                  value={resetCode}
                  onChange={(event) =>
                    setResetCode(
                      event.target.value
                    )
                  }
                  placeholder="Enter the code"
                  autoComplete="one-time-code"
                  className={styles.input}
                />
              </div>

              {message && (
                <p
                  className={
                    styles.errorMessage
                  }
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                className={
                  styles.submitButton
                }
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Verifying..."
                  : "Verify Code"}
              </button>

              <button
                type="button"
                className={
                  styles.secondaryButton
                }
                onClick={async () => {
                  setMessage("");
                  setIsSubmitting(true);

                  try {
                    const { error } =
                      await signIn
                        .resetPasswordEmailCode
                        .sendCode();

                    if (error) {
                      setMessage(
                        error.message ||
                          "Unable to resend the code."
                      );
                    } else {
                      setMessage(
                        "A new reset code was sent."
                      );
                    }
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
              >
                Resend Code
              </button>

              <button
                type="button"
                className={
                  styles.secondaryButton
                }
                onClick={() => {
                  setForgotPassword(false);
                  setResetCodeSent(false);
                  setResetCodeVerified(false);
                  setResetCode("");
                  setMessage("");
                }}
              >
                Back to Log In
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // FORGOT PASSWORD — NEW PASSWORD
  // =====================================================

  if (
    forgotPassword &&
    resetCodeSent &&
    resetCodeVerified
  ) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.icon}>
              🔒
            </div>

            <h1>
              Create a new password
            </h1>

            <p>
              Enter a new password for your
              account.
            </p>
          </div>

          <div className={styles.formArea}>
            <form
              className={styles.customForm}
              onSubmit={handleNewPassword}
            >
              <div className={styles.field}>
                <label htmlFor="new-password">
                  New Password
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  placeholder="Create a new password"
                  autoComplete="new-password"
                  className={styles.input}
                />
              </div>

              {message && (
                <p
                  className={
                    styles.errorMessage
                  }
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                className={
                  styles.submitButton
                }
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Updating..."
                  : "Set New Password"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN ACCOUNT PAGE
  // =====================================================

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

        {/* TABS */}
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

          {/* LOGIN */}
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

                <button
                  type="button"
                  className={
                    styles.forgotPassword
                  }
                  onClick={() => {
                    setForgotPassword(true);
                    setMessage("");
                  }}
                >
                  Forgot password?
                </button>

                {message && (
                  <p
                    className={
                      styles.errorMessage
                    }
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className={
                    styles.submitButton
                  }
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Signing In..."
                    : "Log In"}
                </button>

                <div className={styles.divider}>
                  <span>or</span>
                </div>

                <button
                  type="button"
                  className={
                    styles.googleButton
                  }
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                >
                  <span
                    className={
                      styles.googleIcon
                    }
                  >
                    G
                  </span>

                  Continue with Google
                </button>

                <button
                  type="button"
                  className={
                    styles.secondaryButton
                  }
                  onClick={
                    handleSendLoginCode
                  }
                  disabled={isSubmitting}
                >
                  Sign in with Email Code
                </button>
              </form>
            )}

          {/* LOGIN EMAIL CODE */}
          {loginVerification &&
            !signupVerification && (
              <form
                className={styles.customForm}
                onSubmit={
                  handleVerifyLoginCode
                }
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
                  <p
                    className={
                      styles.errorMessage
                    }
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className={
                    styles.submitButton
                  }
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Verifying..."
                    : "Verify & Log In"}
                </button>
              </form>
            )}

          {/* SIGN UP */}
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

                <div
                  className={
                    styles.classroomSection
                  }
                >
                  <label htmlFor="classroom-code">
                    Classroom Code{" "}
                    <span>
                      (Optional)
                    </span>
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
                  <p
                    className={
                      styles.errorMessage
                    }
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className={
                    styles.submitButton
                  }
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

                <div className={styles.divider}>
                  <span>or</span>
                </div>

                <button
                  type="button"
                  className={
                    styles.googleButton
                  }
                  onClick={
                    handleGoogleSignup
                  }
                  disabled={isSubmitting}
                >
                  <span
                    className={
                      styles.googleIcon
                    }
                  >
                    G
                  </span>

                  Continue with Google
                </button>
              </form>
            )}

          {/* SIGNUP VERIFICATION */}
          {signupVerification && (
            <SignupVerificationForm
              styles={styles}
              verificationCode={
                verificationCode
              }
              setVerificationCode={
                setVerificationCode
              }
              message={message}
              isSubmitting={isSubmitting}
              onSubmit={
                handleVerifySignup
              }
              onResend={async () => {
                setMessage("");
                setIsSubmitting(true);

                try {
                  const { error } =
                    await signUp
                      .verifications
                      .sendEmailCode();

                  if (error) {
                    setMessage(
                      error.message ||
                        "Unable to resend the code."
                    );
                  } else {
                    setMessage(
                      "A new verification code was sent."
                    );
                  }
                } finally {
                  setIsSubmitting(false);
                }
              }}
            />
          )}
        </div>

        {!signupVerification &&
          !loginVerification && (
            <div
              className={
                styles.switchText
              }
            >
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

        <div id="clerk-captcha" />
      </div>
    </main>
  );
}

function SignupVerificationForm({
  styles,
  verificationCode,
  setVerificationCode,
  message,
  isSubmitting,
  onSubmit,
  onResend,
}) {
  return (
    <form
      className={styles.customForm}
      onSubmit={onSubmit}
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
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Verifying..."
          : "Verify Email"}
      </button>

      <button
        type="button"
        className={styles.secondaryButton}
        onClick={onResend}
        disabled={isSubmitting}
      >
        Resend Code
      </button>
    </form>
  );
}