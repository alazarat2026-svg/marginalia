'use client'

import React from 'react'
import { SectionLabel } from '@/components/ui'
import { FormField } from '@/components/ui'
import { PrimaryButton } from '@/components/ui'
import { ModeToggle } from '@/components/ui'
import { QuietAside } from '@/components/ui'
import { EmptyState } from '@/components/ui'

export default function AuthPage() {
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
          {/* STATE 1: SIGNUP IDLE */}
          <div className="w-full max-w-md mx-auto">
            <p className="font-sans text-micro uppercase tracking-wider text-ink-muted font-medium mb-6">
              ACCOUNT
            </p>
            <div className="w-full max-w-full sm:bg-surface-raised sm:border sm:border-line sm:rounded-md sm:shadow-[0_1px_2px_rgba(28,27,25,0.05)] sm:p-8 md:p-10">
              <h1 className="font-serif text-headline text-ink-strong">
                Create your account
              </h1>
              <p className="font-sans text-body-ui text-ink-muted mt-2">
                One account. Your documents, your questions, your history — private to you.
              </p>
              <div className="mt-6 space-y-5">
                <FormField
                  id="signup-email"
                  label="Email"
                  type="email"
                  placeholder="name@institution.org"
                  value=""
                  onChange={() => {}}
                  helperText="We'll send a verification link to this address."
                />
                <FormField
                  id="signup-password"
                  label="Password"
                  type="password"
                  value=""
                  onChange={() => {}}
                  helperText="At least 8 characters."
                />
                <FormField
                  id="signup-confirm"
                  label="Confirm password"
                  type="password"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div className="mt-6">
                <PrimaryButton type="button" fullWidth onClick={() => {}}>
                  Create account
                </PrimaryButton>
              </div>
              <p className="font-sans text-caption text-ink-faint mt-3 text-center">
                By creating an account you agree to our{' '}
                <a href="#" className="text-accent underline">
                  Terms
                </a>
                .
              </p>
            </div>
            <div className="mt-6">
              <ModeToggle
                promptText="Already have an account?"
                linkText="Sign in"
                onLinkClick={() => {}}
              />
            </div>
            <div className="mt-8">
              <QuietAside>
                Your documents are private to your account. We never train on your data.
              </QuietAside>
            </div>
          </div>

          <div className="my-14 pt-8 border-t border-line" />
          <p className="font-sans text-micro uppercase tracking-wider text-ink-faint font-medium mb-6">
            ALTERNATE: LOGIN (IDLE)
          </p>

          {/* STATE 2: LOGIN IDLE */}
          <div className="w-full max-w-md mx-auto">
            <div className="w-full max-w-full sm:bg-surface-raised sm:border sm:border-line sm:rounded-md sm:shadow-[0_1px_2px_rgba(28,27,25,0.05)] sm:p-8 md:p-10">
              <h1 className="font-serif text-headline text-ink-strong">Sign in</h1>
              <p className="font-sans text-body-ui text-ink-muted mt-2">
                Welcome back. Your documents and questions are exactly where you left them.
              </p>
              <div className="mt-6 space-y-5">
                <FormField
                  id="login-email"
                  label="Email"
                  type="email"
                  placeholder="name@institution.org"
                  value=""
                  onChange={() => {}}
                />
                <FormField
                  id="login-password"
                  label="Password"
                  type="password"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div className="mt-6">
                <PrimaryButton type="button" fullWidth onClick={() => {}}>
                  Sign in
                </PrimaryButton>
              </div>
            </div>
            <div className="mt-6">
              <ModeToggle
                promptText="Don't have an account?"
                linkText="Sign up"
                onLinkClick={() => {}}
              />
            </div>
            <div className="mt-8">
              <QuietAside>
                Your documents are private to your account. We never train on your data.
              </QuietAside>
            </div>
          </div>

          <div className="my-14 pt-8 border-t border-line" />
          <p className="font-sans text-micro uppercase tracking-wider text-ink-faint font-medium mb-6">
            ALTERNATE: SIGNUP SUBMITTING
          </p>

          {/* STATE 3: SIGNUP SUBMITTING */}
          <div className="w-full max-w-md mx-auto">
            <div className="w-full max-w-full sm:bg-surface-raised sm:border sm:border-line sm:rounded-md sm:shadow-[0_1px_2px_rgba(28,27,25,0.05)] sm:p-8 md:p-10">
              <h1 className="font-serif text-headline text-ink-strong">
                Create your account
              </h1>
              <p className="font-sans text-body-ui text-ink-muted mt-2">
                One account. Your documents, your questions, your history — private to you.
              </p>
              <div className="mt-6 space-y-5">
                <FormField
                  id="signup-email-submitting"
                  label="Email"
                  type="email"
                  placeholder="name@institution.org"
                  value=""
                  onChange={() => {}}
                  disabled={true}
                  helperText="We'll send a verification link to this address."
                />
                <FormField
                  id="signup-password-submitting"
                  label="Password"
                  type="password"
                  value=""
                  onChange={() => {}}
                  disabled={true}
                  helperText="At least 8 characters."
                />
                <FormField
                  id="signup-confirm-submitting"
                  label="Confirm password"
                  type="password"
                  value=""
                  onChange={() => {}}
                  disabled={true}
                />
              </div>
              <div className="mt-6">
                <PrimaryButton
                  type="button"
                  fullWidth
                  onClick={() => {}}
                  disabled={true}
                >
                  Creating account…
                </PrimaryButton>
              </div>
              <p className="font-sans text-caption text-ink-faint mt-3 text-center">
                By creating an account you agree to our{' '}
                <a href="#" className="text-accent underline">
                  Terms
                </a>
                .
              </p>
            </div>
            <div className="mt-6">
              <ModeToggle
                promptText="Already have an account?"
                linkText="Sign in"
                onLinkClick={() => {}}
              />
            </div>
            <div className="mt-8">
              <QuietAside>
                Your documents are private to your account. We never train on your data.
              </QuietAside>
            </div>
          </div>

          <div className="my-14 pt-8 border-t border-line" />
          <p className="font-sans text-micro uppercase tracking-wider text-ink-faint font-medium mb-6">
            ALTERNATE: SIGNUP WITH FIELD ERRORS
          </p>

          {/* STATE 4: SIGNUP WITH FIELD ERRORS */}
          <div className="w-full max-w-md mx-auto">
            <div className="w-full max-w-full sm:bg-surface-raised sm:border sm:border-line sm:rounded-md sm:shadow-[0_1px_2px_rgba(28,27,25,0.05)] sm:p-8 md:p-10">
              <h1 className="font-serif text-headline text-ink-strong">
                Create your account
              </h1>
              <p className="font-sans text-body-ui text-ink-muted mt-2">
                One account. Your documents, your questions, your history — private to you.
              </p>
              <div className="mt-6 space-y-5">
                <FormField
                  id="signup-email-error"
                  label="Email"
                  type="email"
                  placeholder="name@institution.org"
                  value="maya.at.northwind"
                  onChange={() => {}}
                  errorMessage="Enter a valid email address."
                />
                <FormField
                  id="signup-password-error"
                  label="Password"
                  type="password"
                  value="mypass"
                  onChange={() => {}}
                  errorMessage="Password must be at least 8 characters."
                />
                <FormField
                  id="signup-confirm-error"
                  label="Confirm password"
                  type="password"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div className="mt-6">
                <PrimaryButton type="button" fullWidth onClick={() => {}}>
                  Create account
                </PrimaryButton>
              </div>
              <p className="font-sans text-caption text-ink-faint mt-3 text-center">
                By creating an account you agree to our{' '}
                <a href="#" className="text-accent underline">
                  Terms
                </a>
                .
              </p>
            </div>
            <div className="mt-6">
              <ModeToggle
                promptText="Already have an account?"
                linkText="Sign in"
                onLinkClick={() => {}}
              />
            </div>
            <div className="mt-8">
              <QuietAside>
                Your documents are private to your account. We never train on your data.
              </QuietAside>
            </div>
          </div>

          <div className="my-14 pt-8 border-t border-line" />
          <p className="font-sans text-micro uppercase tracking-wider text-ink-faint font-medium mb-6">
            ALTERNATE: SIGNUP SUCCESS — CHECK YOUR EMAIL
          </p>

          {/* STATE 5: SIGNUP SUCCESS */}
          <div className="w-full max-w-md mx-auto">
            <EmptyState
              title="Check your email"
              body="We sent a verification link to maya.okonkwo@northwindresearch.org. Click the link to activate your account."
              ctaLabel="Resend verification email"
              onCta={() => {}}
              steps={[]}
            />
            <p className="font-sans text-label text-ink-muted text-center mt-4">
              Wrong email?{' '}
              <a href="#" className="text-accent underline">
                Sign up again
              </a>
            </p>
            <div className="mt-8">
              <QuietAside>
                Your documents are private to your account. We never train on your data.
              </QuietAside>
            </div>
          </div>

          <div className="my-14 pt-8 border-t border-line" />
          <p className="font-sans text-micro uppercase tracking-wider text-ink-faint font-medium mb-6">
            ALTERNATE: LOGIN WITH WRONG CREDENTIALS
          </p>

          {/* STATE 6: LOGIN WITH WRONG CREDENTIALS */}
          <div className="w-full max-w-md mx-auto">
            <div className="w-full max-w-full sm:bg-surface-raised sm:border sm:border-line sm:rounded-md sm:shadow-[0_1px_2px_rgba(28,27,25,0.05)] sm:p-8 md:p-10">
              <p className="font-serif text-body-reading text-ink-body leading-relaxed mb-6">
                That email and password don&apos;t match an account. Try again, or{' '}
                <a
                  href="#"
                  className="text-accent underline hover:text-accent-hover"
                >
                  reset your password
                </a>
                .
              </p>
              <h1 className="font-serif text-headline text-ink-strong">Sign in</h1>
              <p className="font-sans text-body-ui text-ink-muted mt-2">
                Welcome back. Your documents and questions are exactly where you left them.
              </p>
              <div className="mt-6 space-y-5">
                <FormField
                  id="login-email-wrong"
                  label="Email"
                  type="email"
                  placeholder="name@institution.org"
                  value="maya.okonkwo@northwindresearch.org"
                  onChange={() => {}}
                />
                <FormField
                  id="login-password-wrong"
                  label="Password"
                  type="password"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div className="mt-6">
                <PrimaryButton type="button" fullWidth onClick={() => {}}>
                  Sign in
                </PrimaryButton>
              </div>
            </div>
            <div className="mt-6">
              <ModeToggle
                promptText="Don't have an account?"
                linkText="Sign up"
                onLinkClick={() => {}}
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
  )
}
