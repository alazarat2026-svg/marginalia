'use client'

import React from 'react'
import { TopAppBar } from '@/components/ui'
import { PageHeaderBand } from '@/components/ui'
import { SectionLabel } from '@/components/ui'
import { DropZone } from '@/components/ui'
import { ProcessingPanel } from '@/components/ui'
import { PipelineStep } from '@/components/ui'
import { PrimaryButton } from '@/components/ui'
import { GhostButton } from '@/components/ui'
import { QuietAside } from '@/components/ui'
import { Plus } from 'lucide-react'

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* SECTION 1 — Top app bar */}
      <TopAppBar
        currentPage="Upload"
        breadcrumbRoot="Documents"
        user={{ name: 'Maya Okonkwo', initials: 'MO' }}
      />

      {/* SECTION 2 — Page header band */}
      <PageHeaderBand
        backLink={{ label: 'Back to documents', href: '/documents' }}
        title='Upload a PDF'
        subtitle="Add a document to your library. We'll extract the text, index it, and make it ready to ask questions about."
      />

      {/* SECTION 3 — Idle state (primary composition) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionLabel>UPLOAD</SectionLabel>

        <div className="max-w-3xl mx-auto py-8">
          <DropZone onFileSelect={() => {}} isDragging={false} />
        </div>

        <QuietAside>
          PDF files up to 50 MB. We extract the text, split it into sections, and generate embeddings so you can ask questions and get cited answers.
        </QuietAside>
      </div>

      {/* SECTION 4 — Labeled alternate: Drag-over state (desktop only) */}
      <div className="my-14 pt-8 border-t border-line max-w-3xl mx-auto hidden md:block">
        <p className="font-sans text-micro uppercase tracking-wider text-ink-faint font-medium mb-6">
          ALTERNATE: DRAG-OVER STATE (DESKTOP ONLY)
        </p>
        <DropZone onFileSelect={() => {}} isDragging={true} />
      </div>

      {/* SECTION 5 — Labeled alternate: Processing */}
      <div className="my-14 border-t border-line max-w-2xl mx-auto py-8">
        <p className="font-sans text-micro uppercase tracking-wider text-ink-faint font-medium mb-6">
          ALTERNATE: PROCESSING
        </p>
        <ProcessingPanel
          filename="Field Reliability Report Q3.pdf"
          status="processing"
          steps={[
            { label: 'Extracting text', subtitle: 'Reading the PDF pages', state: 'done' },
            { label: 'Chunking', subtitle: 'Splitting into sentence-aware sections', state: 'done' },
            { label: 'Embedding', subtitle: 'Generating vectors for retrieval', state: 'active' },
            { label: 'Ready', subtitle: 'Your document is searchable', state: 'pending' }
          ]}
          actions={<GhostButton onClick={() => {}}>Cancel upload</GhostButton>}
        />
      </div>

      {/* SECTION 6 — Labeled alternate: Failed */}
      <div className="my-14 border-t border-line max-w-2xl mx-auto py-8">
        <p className="font-sans text-micro uppercase tracking-wider text-ink-faint font-medium mb-6">
          ALTERNATE: FAILED
        </p>
        <ProcessingPanel
          filename="Field Reliability Report Q3.pdf"
          status="failed"
          steps={[
            { label: 'Extracting text', subtitle: 'Reading the PDF pages', state: 'done' },
            { label: 'Chunking', subtitle: 'Splitting into sentence-aware sections', state: 'done' },
            { label: 'Embedding', subtitle: 'Generating vectors for retrieval', state: 'failed', failureDetail: "Can't generate embeddings" }
          ]}
          failureMessage="We couldn't finish processing this file. This is usually a temporary issue with the embedding service."
          actions={
            <>
              <PrimaryButton onClick={() => {}}>Try again</PrimaryButton>
              <GhostButton onClick={() => {}}>Back to documents</GhostButton>
            </>
          }
        />
      </div>

      {/* SECTION 7 — Labeled alternate: Success */}
      <div className="my-14 border-t border-line max-w-2xl mx-auto py-8">
        <p className="font-sans text-micro uppercase tracking-wider text-ink-faint font-medium mb-6">
          ALTERNATE: SUCCESS
        </p>
        <ProcessingPanel
          filename="Field Reliability Report Q3.pdf"
          status="success"
          steps={[]}
          successMessage="Your document is ready to ask questions about."
          actions={
            <>
              <PrimaryButton onClick={() => {}}>Open document</PrimaryButton>
              <GhostButton onClick={() => {}}>Upload another</GhostButton>
            </>
          }
        />
      </div>
    </div>
  )
}