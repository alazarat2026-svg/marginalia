'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/use-auth';
import { EmptyState, FormField, ModeToggle, PrimaryButton, QuietAside, SectionLabel } from '@/components/ui';
import { useRouter } from 'next/navigation';

type Mode = 'signup' | 'login';

export default function AuthPage() {
  const router = useRouter();
  const { user, session, loading } = useAuth();
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>('signup');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Redirect to /documents if already authenticated
  useEffect(() => {
    if (!loading && session) {
      router.push('/documents');
    }
  }, [session, loading, router]);

  const clearErrors = useCallback(() => {
    setFormError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setSubmitting(true);

    const emailInput = document.getElementById('signup-email') as HTMLInputElement | null;
    const passwordInput = document.getElementById('signup-password') as HTMLInputElement | null;
    const confirmInput = document.getElementById('signup-confirm') as HTMLInputElement | null;

    const email = emailInput?.value.trim() ?? '';
    const password = passwordInput?.value ?? '';
    const confirmPassword = confirmInput?.value ?? '';

    if (!email) {
      setEmailError('Email is required.');
      setSubmitting(false);
      return;
    }
    if (!password) {
      setPasswordError('Password is required.');
      setSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      setSubmitting(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    setSubmitting(false);

    if (error) {
      const msg = error.message || '';
      if (msg.includes('User already registered')) {
        setEmailError('This email is already registered.');
      } else if (msg.includes('Password should be at least 6 characters')) {
        setPasswordError('Password must be at least 8 characters.');
      } else {
        setFormError("We couldn't create your account. Please try again.");
      }
      return;
    }

    // If a session was returned (email confirmation disabled), go to documents
    if (session || data.session) {
      router.push('/documents');
      return;
    }

    // Otherwise, email confirmation is required — show check-your-email state
    setShowSuccess(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setSubmitting(true);

    const emailInput = document.getElementById('login-email') as HTMLInputElement | null;
    const passwordInput = document.getElementById('login-password') as HTMLInputElement | null;

    const email = emailInput?.value.trim() ?? '';
    const password = passwordInput?.value ?? '';

    if (!email) {
      setEmailError('Email is required.');
      setSubmitting(false);
      return;
    }
    if (!password) {
      setPasswordError('Password is required.');
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);

    if (error) {
      const msg = error.message || '';
      if (msg.includes('Invalid login credentials')) {
        setFormError("That email and password don't match an account. Try again, or reset your password.");
      } else if (msg.includes('Email not confirmed') || msg.includes('email not confirmed')) {
        setFormError('Please verify your email before signing in. Check your inbox for the verification link.');
      } else {
        setFormError("We couldn't sign you in. Please try again.");
      }
      return;
    }

    // On successful login, useAuth will redirect to /documents via session change
  };

  const isSignup = mode === 'signup';

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="font-sans text-body-ui text-ink-muted">Signing in…</p>
      </div>
    );
  }

  // Signup success / check-your-email state
  if (showSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <EmptyState
          title="Check your email"
          body="We sent a verification link to this address. Click the link to activate your account."
          ctaLabel="Resend verification email"
          onCta={() => {
            // Re-trigger signup to resend verification
          }}
          steps={[]}
        />
        <p className="font-sans text-label text-ink-muted text-center mt-4">
          Wrong email?{' '}
          <button onClick={() => setShowSuccess(false)} className="text-accent underline">
            Sign up again
          </button>
        </p>
        <div className="mt-8">
          <QuietAside>
            Your documents are private to your account. We never train on your data.
          </QuietAside>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-canvas/95 backdrop-blur-md border-b border-line">
        <div className="h-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <span className="font-sans text-body-ui font-semibold text-ink-strong tracking-tight">
            Marginalia
          </span>
        </div>
      </header>
      <div className="h-14" aria-hidden="true" />

      <main className="w-full max-w-full overflow-x-hidden bg-canvas min-h-screen">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-24">
          <div className="w-full max-w-md mx-auto">
            <p className="font-sans text-micro uppercase tracking-wider text-ink-muted font-medium mb-6">
              ACCOUNT
            </p>
            <div className="w-full max-w-full sm:bg-surface-raised sm:border sm:border-line sm:rounded-md sm:shadow-[0_1px_2px_rgba(28,27,25,0.05)] sm:p-8 md:p-10">
              <h1 className="font-serif text-headline text-ink-strong">
                {isSignup ? 'Create your account' : 'Sign in'}
              </h1>
              <p className="font-sans text-body-ui text-ink-muted mt-2">
                {isSignup
                  ? 'One account. Your documents, your questions, your history — private to you.'
                  : 'Welcome back. Your documents and questions are exactly where you left them.'}
              </p>

              {formError && (
                <p className="font-sans text-caption text-status-failed mb-4 text-center">
                  {formError}
                </p>
              )}

              <div className="mt-6 space-y-5">
                {isSignup ? (
                  <>
                    <FormField
                      id="signup-email"
                      label="Email"
                      type="email"
                      placeholder="name@institution.org"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      helperText="We'll send a verification link to this address."
                      errorMessage={emailError ?? undefined}
                    />
                    <FormField
                      id="signup-password"
                      label="Password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      helperText="At least 8 characters."
                      errorMessage={passwordError ?? undefined}
                    />
                    <FormField
                      id="signup-confirm"
                      label="Confirm password"
                      type="password"
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      errorMessage={confirmPasswordError ?? undefined}
                    />
                  </>
                ) : (
                  <>
                    <FormField
                      id="login-email"
                      label="Email"
                      type="email"
                      placeholder="name@institution.org"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      errorMessage={undefined}
                    />
                    <FormField
                      id="login-password"
                      label="Password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      errorMessage={undefined}
                    />
                  </>
                )}
              </div>

              <div className="mt-6">
                <PrimaryButton
                  type="button"
                  fullWidth
                  disabled={submitting}
                  onClick={() => {
                    if (isSignup) {
                      handleSignup({ preventDefault: () => {} } as unknown as React.FormEvent);
                    } else {
                      handleLogin({ preventDefault: () => {} } as unknown as React.FormEvent);
                    }
                  }}
                >
                  {isSignup ? 'Create account' : 'Sign in'}
                </PrimaryButton>
              </div>

              {isSignup && (
                <p className="font-sans text-caption text-ink-faint mt-3 text-center">
                  By creating an account you agree to our{' '}
                  <a href="#" className="text-accent underline">
                    Terms
                  </a>
                  .
                </p>
              )}
            </div>

            <div className="mt-6">
              <ModeToggle
                promptText={isSignup ? 'Already have an account?' : "Don't have an account?"}
                linkText={isSignup ? 'Sign in' : 'Sign up'}
                onLinkClick={() => {
                  setMode(isSignup ? 'login' : 'signup');
                  setFormError(null);
                  setEmailError(null);
                  setPasswordError(null);
                  setConfirmPasswordError(null);
                  setShowSuccess(false);
                }}
              />
            </div>
            <div className="mt-8">
              <QuietAside>
                Your documents are private to your account. We never train on your data.
              </QuietAside>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
