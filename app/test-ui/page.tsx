'use client'

import React, { useState } from 'react'
import {
  StatusChip,
  PrimaryButton,
  GhostButton,
  CitationLink,
  SectionLabel,
  QuietAside,
  DocumentRow,
  EmptyState,
  PageHeaderBand,
  TopAppBar,
  TopAppBarReduced,
  DropZone,
  ProcessingPanel,
  PipelineStep,
  NotAnswerState,
  FormField,
  ModeToggle,
} from '../../components/ui'
import { Plus } from 'lucide-react'

export default function TestPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [emailValue, setEmailValue] = useState('maya.at.northwind')
  const [validEmailValue, setValidEmailValue] = useState('name@institution.org')

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <SectionLabel>TOKENS & COMPONENTS — PHASE B TEST</SectionLabel>

        {/* Status Chips */}
        <section>
          <SectionLabel className="mb-4">Status Chips</SectionLabel>
          <div className="flex flex-wrap gap-3">
            <StatusChip state="ready" />
            <StatusChip state="processing" />
            <StatusChip state="failed" />
          </div>
        </section>

        {/* Buttons */}
        <section>
          <SectionLabel className="mb-4">Buttons</SectionLabel>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton>Default Primary</PrimaryButton>
            <PrimaryButton disabled>Disabled Primary</PrimaryButton>
            <PrimaryButton fullWidth>Full Width (mobile only)</PrimaryButton>
            <GhostButton>Ghost Button</GhostButton>
          </div>
        </section>

        {/* Citation Links */}
        <section>
          <SectionLabel className="mb-4">Citation Links</SectionLabel>
          <p className="font-serif text-body-reading text-ink-body">
            See <CitationLink href="#" pageNumber={14}>[p. 14]</CitationLink> and{' '}
            <CitationLink href="#" pageNumber={22}>[p. 22]</CitationLink> for details.
          </p>
        </section>

        {/* Quiet Aside */}
        <section>
          <SectionLabel className="mb-4">Quiet Aside</SectionLabel>
          <QuietAside>
            Your documents are private to your account. We never train on your data.
          </QuietAside>
        </section>

        {/* Document Rows */}
        <section>
          <SectionLabel className="mb-4">Document Rows</SectionLabel>
          <div className="space-y-4">
            <DocumentRow
              title="Master Services Agreement — Northwind / Halcyon Systems"
              author="Halcyon Legal"
              pages={24}
              status="ready"
              href="#"
            />
            <DocumentRow
              title="Field Reliability Report: Model XR-200, Q3"
              author="Northwind Engineering"
              pages={42}
              status="processing"
            />
            <DocumentRow
              title="Q4 Vendor Consolidation Proposal"
              author="J. Park"
              pages={9}
              status="failed"
              onReUpload={() => console.log('Re-upload clicked')}
            />
          </div>
        </section>

        {/* Empty State */}
        <section>
          <SectionLabel className="mb-4">Empty State</SectionLabel>
          <EmptyState
            title="No documents yet."
            body="Upload a PDF and we'll index it so you can ask questions and get cited answers."
            ctaLabel="Upload your first PDF"
            onCta={() => console.log('Upload clicked')}
            steps={[
              'Upload a PDF',
              'We extract and index it',
              'Ask questions, get citations',
            ]}
          />
        </section>

        {/* Page Header Band */}
        <section>
          <SectionLabel className="mb-4">Page Header Band</SectionLabel>
          <PageHeaderBand
            title="Documents"
            subtitle="Your uploaded PDFs. Open one to ask questions."
            primaryAction={{
              label: 'Upload PDF',
              onClick: () => console.log('Upload clicked'),
              icon: <Plus className="w-4 h-4" />,
            }}
            backLink={{
              label: 'Back to documents',
              href: '#',
            }}
          />
        </section>

        {/* Top App Bar (Full) */}
        <section>
          <SectionLabel className="mb-4">Top App Bar (Full)</SectionLabel>
          <TopAppBar
            breadcrumbRoot="Documents"
            currentPage="Upload"
            user={{ name: 'Maya Okonkwo', initials: 'MO' }}
          />
        </section>

        {/* Top App Bar Reduced */}
        <section>
          <SectionLabel className="mb-4">Top App Bar Reduced (Auth)</SectionLabel>
          <TopAppBarReduced />
        </section>

        {/* Drop Zone */}
        <section>
          <SectionLabel className="mb-4">Drop Zone</SectionLabel>
          <div className="mb-3">
            <button
              onClick={() => setIsDragging(!isDragging)}
              className="text-accent hover:underline font-sans text-label"
            >
              Toggle drag state: {isDragging ? 'ON' : 'OFF'}
            </button>
          </div>
          <DropZone
            onFileSelect={(file) => console.log('File selected:', file.name)}
            onDragOver={() => console.log('Drag over')}
            onDragLeave={() => console.log('Drag leave')}
            isDragging={isDragging}
          />
        </section>

        {/* Processing Panel - Processing */}
        <section>
          <SectionLabel className="mb-4">Processing Panel (Processing)</SectionLabel>
          <ProcessingPanel
            filename="Master Services Agreement.pdf"
            status="processing"
            steps={[
              { label: 'Extracting text', subtitle: 'Reading the PDF pages', state: 'done' },
              { label: 'Chunking', subtitle: 'Splitting into sentence-aware sections', state: 'done' },
              { label: 'Embedding', subtitle: 'Generating vectors for retrieval', state: 'active' },
              { label: 'Ready', subtitle: 'Your document is searchable', state: 'pending' },
            ]}
            actions={<GhostButton>Cancel upload</GhostButton>}
          />
        </section>

        {/* Processing Panel - Failed */}
        <section>
          <SectionLabel className="mb-4">Processing Panel (Failed)</SectionLabel>
          <ProcessingPanel
            filename="Q4 Vendor Consolidation Proposal.pdf"
            status="failed"
            steps={[
              { label: 'Extracting text', subtitle: 'Reading the PDF pages', state: 'done' },
              { label: 'Chunking', subtitle: 'Splitting into sentence-aware sections', state: 'done' },
              {
                label: 'Embedding',
                subtitle: 'Generating vectors for retrieval',
                state: 'failed',
                failureDetail: 'Out of memory during vector generation',
              },
            ]}
            failureMessage="We couldn't finish processing this file. The embedding step failed due to insufficient memory. Please try again with a smaller file."
            actions={
              <>
                <PrimaryButton>Try again</PrimaryButton>
                <GhostButton>Back to documents</GhostButton>
              </>
            }
          />
        </section>

        {/* Processing Panel - Success */}
        <section>
          <SectionLabel className="mb-4">Processing Panel (Success)</SectionLabel>
          <ProcessingPanel
            filename="Master Services Agreement.pdf"
            status="success"
            steps={[
              { label: 'Extracting text', subtitle: 'Reading the PDF pages', state: 'done' },
              { label: 'Chunking', subtitle: 'Splitting into sentence-aware sections', state: 'done' },
              { label: 'Embedding', subtitle: 'Generating vectors for retrieval', state: 'done' },
              { label: 'Ready', subtitle: 'Your document is searchable', state: 'done' },
            ]}
            successMessage="Your document is ready to ask questions about."
            actions={
              <>
                <PrimaryButton>Open document</PrimaryButton>
                <GhostButton>Upload another</GhostButton>
              </>
            }
          />
        </section>

        {/* Not Answer State */}
        <section>
          <SectionLabel className="mb-4">Not Answer State (Not Found)</SectionLabel>
          <NotAnswerState
            headline="The document doesn't appear to contain an answer to this question."
            bridge="This document covers termination, liability, warranties, and payment terms."
            suggestions="Try asking about termination notice requirements or the liability cap."
            onAskAgain={() => console.log('Ask again clicked')}
          />
        </section>

        {/* Form Fields */}
        <section>
          <SectionLabel className="mb-4">Form Fields</SectionLabel>
          <div className="space-y-6 max-w-md">
            <FormField
              id="email-valid"
              label="Email"
              type="email"
              placeholder="name@institution.org"
              value={validEmailValue}
              onChange={(e) => setValidEmailValue(e.target.value)}
              helperText="We'll send a verification link to this address."
            />
            <FormField
              id="email-error"
              label="Email"
              type="email"
              placeholder="name@institution.org"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              errorMessage="Enter a valid email address."
            />
          </div>
        </section>

        {/* Mode Toggle */}
        <section>
          <SectionLabel className="mb-4">Mode Toggle</SectionLabel>
          <ModeToggle
            promptText="Already have an account?"
            linkText="Sign in"
            onLinkClick={() => console.log('Sign in clicked')}
          />
        </section>
      </div>
    </div>
  )
}
