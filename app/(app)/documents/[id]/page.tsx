'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import {
  TopAppBar,
  StatusChip,
  PrimaryButton,
  CitationLink,
  SectionLabel,
  NotAnswerState,
  SourceBlock,
} from '@/components/ui'

export default function DocumentDetailPage() {
  const [expandedTurnId, setExpandedTurnId] = useState<string | null>(null)
  const [expandedPage, setExpandedPage] = useState<number | null>(null)
  const askInputRef = useRef<HTMLInputElement>(null)
  const sourceBlockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const setSourceBlockRef = (turnId: string) => (el: HTMLDivElement | null) => {
    sourceBlockRefs.current[turnId] = el
  }

  const handleCitationClick = (turnId: string, pageNumber: number) => {
    if (expandedTurnId === turnId && expandedPage === pageNumber) {
      setExpandedTurnId(null)
      setExpandedPage(null)
    } else {
      setExpandedTurnId(turnId)
      setExpandedPage(pageNumber)
    }
  }

  // Scroll source block into view when expanded (no-op if already visible)
  useEffect(() => {
    if (expandedTurnId) {
      const ref = sourceBlockRefs.current[expandedTurnId]
      if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [expandedTurnId])

  const handleAskAgain = () => {
    if (askInputRef.current) {
      askInputRef.current.focus()
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <TopAppBar
        currentPage="Master Services Agreement"
        breadcrumbRoot="Documents"
        user={{ name: 'Maya Okonkwo', initials: 'MO' }}
      />

      {/* ZONE 1: Context Band */}
      <section className="bg-reading-surface border-b border-line pt-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <h1 className="font-serif text-display text-ink-strong tracking-[-0.02em] leading-tight mb-2 sm:mb-3">
            Master Services Agreement — Northwind / Halcyon Systems
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-3 text-label text-ink-muted">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <span>Halcyon Legal</span>
              <span>·</span>
              <span>24 pages</span>
              <span>·</span>
              <span className="font-micro uppercase tracking-wider">PDF</span>
            </div>
            <StatusChip state="ready" label="Ready" />
          </div>
        </div>
      </section>

      {/* ZONE 2: Conversation Column + ZONE 3: Utility Rail */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ZONE 2: Conversation Column */}
        <div className="lg:col-span-8 max-w-[68ch] space-y-4">
          {/* FIRST QA TURN */}
          <div ref={setSourceBlockRef('turn-1')}>
            <p className="font-sans text-label text-ink-muted">You</p>
            <p className="font-sans text-body-ui text-ink-strong font-medium mt-1">
              How does the termination clause interact with the liability cap?
            </p>
            <div className="mt-4">
              <p className="font-serif text-body-reading text-ink-body leading-relaxed">
                Termination for cause (Clause 8.2) does not override the liability cap in Clause 11.1. Even on termination, each party's aggregate liability stays capped at fees paid in the prior 12 months — the cap survives termination. The only carve-out is Clause 11.3, which excludes indemnification obligations from the cap.{' '}
                <button
                  type="button"
                  onClick={() => handleCitationClick('turn-1', 14)}
                  className="inline-flex items-center"
                >
                  <CitationLink href="#" pageNumber={14} className="py-2 sm:py-0 px-1">
                    [p. 14]
                  </CitationLink>
                </button>{' '}
                <button
                  type="button"
                  onClick={() => handleCitationClick('turn-1', 22)}
                  className="inline-flex items-center"
                >
                  <CitationLink href="#" pageNumber={22} className="py-2 sm:py-0 px-1">
                    [p. 22]
                  </CitationLink>
                </button>
              </p>
            </div>
            <SourceBlock
              sources={[
                {
                  title: 'Clause 8.2 — Termination for Cause',
                  page: 14,
                  snippet:
                    '...neither expiration nor termination of this Agreement shall relieve either party of any obligation arising prior to such termination, nor modify the limitations set forth in Section 11.',
                },
                {
                  title: 'Clause 11.1 — Limitation of Liability',
                  page: 22,
                  snippet:
                    'Aggregate liability shall in no event exceed total fees paid or payable by Northwind in the twelve (12) month period immediately preceding the event giving rise to liability.',
                },
              ]}
              key={expandedTurnId === 'turn-1' ? `open-${expandedPage}` : 'closed'}
              defaultExpanded={expandedTurnId === 'turn-1'}
              highlightPage={
                expandedTurnId === 'turn-1' && expandedPage !== null
                  ? expandedPage
                  : undefined
              }
              className="mt-3"
            />
          </div>

          <hr className="border-t border-line/70 my-2" />

          {/* SECOND QA TURN */}
          <div ref={setSourceBlockRef('turn-2')}>
            <p className="font-sans text-label text-ink-muted">You</p>
            <p className="font-sans text-body-ui text-ink-strong font-medium mt-1">
              What are the notice requirements for termination?
            </p>
            <div className="mt-4">
              <p className="font-serif text-body-reading text-ink-body leading-relaxed">
                Termination for cause requires written notice to the other party and a 30-day cure period. Notice must be delivered per Clause 15.3 — email to the designated legal contact counts.{' '}
                <button
                  type="button"
                  onClick={() => handleCitationClick('turn-2', 16)}
                  className="inline-flex items-center"
                >
                  <CitationLink href="#" pageNumber={16} className="py-2 sm:py-0 px-1">
                    [p. 16]
                  </CitationLink>
                </button>
              </p>
            </div>
            <SourceBlock
              sources={[
                {
                  title: 'Clause 9.1 — Notice and Cure',
                  page: 16,
                  snippet:
                    '30-day written cure requirement delivered via designated legal email contacts.',
                },
              ]}
              key={expandedTurnId === 'turn-2' ? `open-${expandedPage}` : 'closed'}
              defaultExpanded={expandedTurnId === 'turn-2'}
              highlightPage={
                expandedTurnId === 'turn-2' && expandedPage !== null
                  ? expandedPage
                  : undefined
              }
              className="mt-3"
            />
          </div>

          <hr className="border-t border-line/70 my-2" />

          {/* THIRD QA TURN - NOT FOUND */}
          <div>
            <p className="font-sans text-label text-ink-muted">You</p>
            <p className="font-sans text-body-ui text-ink-strong font-medium mt-1">
              Does the agreement specify non-solicitation periods for key personnel?
            </p>
            <NotAnswerState
              headline="The document doesn't appear to contain an answer to this question."
              bridge="This document covers termination, liability, warranties, and payment terms."
              suggestions="Try asking about termination notice requirements or the liability cap."
              onAskAgain={handleAskAgain}
              className="mt-4"
            />
          </div>

          {/* ASK INPUT BAR */}
          <div className="sticky bottom-4 z-30 pt-4 pb-2">
            <div className="bg-surface-raised border border-line rounded-md shadow-elevation-2 p-2 sm:p-2.5 flex items-center gap-2 focus-within:border-accent transition-colors">
              <input
                ref={askInputRef}
                type="text"
                placeholder="Ask a question about this document…"
                className="flex-1 bg-transparent px-3 py-2 text-body-ui text-ink-strong placeholder:text-ink-faint focus:outline-none"
              />
              <PrimaryButton type="button">
                Send <ArrowRight className="w-3.5 h-3.5" />
              </PrimaryButton>
            </div>
            <p className="font-sans text-caption text-ink-faint text-center mt-1.5 hidden sm:block">
              Answers grounded in page-level citations
            </p>
          </div>
        </div>

        {/* ZONE 3: Utility Rail */}
        <aside className="lg:col-span-4 w-full lg:sticky lg:top-20 space-y-6 pt-6 lg:pt-0 border-t lg:border-t-0 border-line">
          {/* Mobile Disclosure */}
          <details className="md:hidden">
            <summary className="flex items-center justify-between py-3 cursor-pointer list-none">
              <SectionLabel>SOURCES & CONTEXT</SectionLabel>
              <span className="font-sans text-caption text-ink-faint flex items-center gap-2">
                3 references found
                <ChevronDown className="w-4 h-4" />
              </span>
            </summary>
            <div className="space-y-3 mt-3">
              <div className="p-3.5 bg-surface-raised border border-line rounded-md shadow-elevation-1 hover:border-accent/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="block font-sans font-semibold text-ink-strong text-label truncate">
                      Clause 8.2 — Termination for Cause
                    </span>
                  </div>
                  <CitationLink href="#" pageNumber={14} className="whitespace-nowrap shrink-0">
                    p. 14
                  </CitationLink>
                </div>
                <p className="font-serif text-body-ui text-ink-muted line-clamp-2 leading-relaxed mt-1">
                  Survival of liability limitations upon contract termination for cause.
                </p>
              </div>
              <div className="p-3.5 bg-surface-raised border border-line rounded-md shadow-elevation-1 hover:border-accent/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="block font-sans font-semibold text-ink-strong text-label truncate">
                      Clause 11.1 — Limitation of Liability
                    </span>
                  </div>
                  <CitationLink href="#" pageNumber={22} className="whitespace-nowrap shrink-0">
                    p. 22
                  </CitationLink>
                </div>
                <p className="font-serif text-body-ui text-ink-muted line-clamp-2 leading-relaxed mt-1">
                  12-month trailing fee limit; indemnification exclusions under Clause 11.3.
                </p>
              </div>
              <div className="p-3.5 bg-surface-raised border border-line rounded-md shadow-elevation-1 hover:border-accent/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="block font-sans font-semibold text-ink-strong text-label truncate">
                      Clause 9.1 — Notice and Cure
                    </span>
                  </div>
                  <CitationLink href="#" pageNumber={16} className="whitespace-nowrap shrink-0">
                    p. 16
                  </CitationLink>
                </div>
                <p className="font-serif text-body-ui text-ink-muted line-clamp-2 leading-relaxed mt-1">
                  30-day written cure requirement delivered via designated legal email contacts.
                </p>
              </div>
            </div>
          </details>

          {/* Desktop Rail */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <SectionLabel>SOURCES & CONTEXT</SectionLabel>
              <span className="font-sans text-caption text-ink-faint">
                3 references found
              </span>
            </div>
            <div className="space-y-3 mt-3">
              <div className="p-3.5 bg-surface-raised border border-line rounded-md shadow-elevation-1 hover:border-accent/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="block font-sans font-semibold text-ink-strong text-label truncate">
                      Clause 8.2 — Termination for Cause
                    </span>
                  </div>
                  <CitationLink href="#" pageNumber={14} className="whitespace-nowrap shrink-0">
                    p. 14
                  </CitationLink>
                </div>
                <p className="font-serif text-body-ui text-ink-muted line-clamp-2 leading-relaxed mt-1">
                  Survival of liability limitations upon contract termination for cause.
                </p>
              </div>
              <div className="p-3.5 bg-surface-raised border border-line rounded-md shadow-elevation-1 hover:border-accent/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="block font-sans font-semibold text-ink-strong text-label truncate">
                      Clause 11.1 — Limitation of Liability
                    </span>
                  </div>
                  <CitationLink href="#" pageNumber={22} className="whitespace-nowrap shrink-0">
                    p. 22
                  </CitationLink>
                </div>
                <p className="font-serif text-body-ui text-ink-muted line-clamp-2 leading-relaxed mt-1">
                  12-month trailing fee limit; indemnification exclusions under Clause 11.3.
                </p>
              </div>
              <div className="p-3.5 bg-surface-raised border border-line rounded-md shadow-elevation-1 hover:border-accent/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="block font-sans font-semibold text-ink-strong text-label truncate">
                      Clause 9.1 — Notice and Cure
                    </span>
                  </div>
                  <CitationLink href="#" pageNumber={16} className="whitespace-nowrap shrink-0">
                    p. 16
                  </CitationLink>
                </div>
                <p className="font-serif text-body-ui text-ink-muted line-clamp-2 leading-relaxed mt-1">
                  30-day written cure requirement delivered via designated legal email contacts.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
