'use client'

import React from 'react'
import { TopAppBar } from '@/components/ui'
import { PageHeaderBand } from '@/components/ui'
import { SectionLabel } from '@/components/ui'
import { DocumentRow } from '@/components/ui'
import { EmptyState } from '@/components/ui'
import { Plus } from 'lucide-react'

export default function DocumentsListPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* SECTION 1 — Top app bar */}
      <TopAppBar
        user={{ name: 'Maya Okonkwo', initials: 'MO' }}
      />

      {/* SECTION 2 — Page header band */}
      <PageHeaderBand
        title="Documents"
        subtitle="Your uploaded PDFs. Open one to ask questions."
        primaryAction={{ label: 'Upload PDF', onClick: () => {}, icon: <Plus className='w-4 h-4' />}}
      />

      {/* SECTION 3 — Populated documents list */}
      <section className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <SectionLabel>All documents</SectionLabel>
        <div className='space-y-3.5'>
          {/* DocumentRow #1: Master Services Agreement */}
          <DocumentRow
            title='Master Services Agreement — Northwind / Halcyon Systems'
            author='Halcyon Legal'
            pages={24}
            status='ready'
            href='#'
          />

          {/* DocumentRow #2: Adaptive Thermal Regulation */}
          <DocumentRow
            title='Adaptive Thermal Regulation in Low-Power Sensor Networks'
            author='R. Ferreira et al.'
            pages={18}
            status='ready'
            href='#'
          />

          {/* DocumentRow #3: Field Reliability Report (processing) */}
          <DocumentRow
            title='Field Reliability Report: Model XR-200, Q3'
            author='Northwind Engineering'
            pages={42}
            status='processing'
          />

          {/* DocumentRow #4: Q4 Vendor Consolidation (failed, with Re-upload) */}
          <DocumentRow
            title='Q4 Vendor Consolidation Proposal'
            author='J. Park'
            pages={9}
            status='failed'
            onReUpload={() => {}}
          />

          {/* DocumentRow #5: Chapter 6 — Distributed Consensus */}
          <DocumentRow
            title='Chapter 6 — Distributed Consensus'
            author='K. Adeyemi'
            pages={31}
            status='ready'
            href='#'
          />
        </div>
      </section>

      {/* SECTION 4 — Labeled alternate: Empty state */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-t border-line w-full my-14" />
        <p className='font-sans text-micro uppercase tracking-wider text-ink-faint font-medium mb-3'>
          ALTERNATE: EMPTY STATE
        </p>
        <EmptyState
          title='No documents yet.'
          body="Upload a PDF and we'll index it so you can ask questions and get cited answers."
          ctaLabel='Upload your first PDF'
          onCta={() => {}}
          steps={['Upload a PDF', 'We extract and index it', 'Ask questions, get citations']}
        />
      </div>

      {/* SECTION 5 — Labeled alternate: Upload-in-progress */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-t border-line w-full my-14" />
        <p className='font-sans text-micro uppercase tracking-wider text-ink-faint font-medium mb-3'>
          ALTERNATE: UPLOAD-IN-PROGRESS (TOP OF LIST)
        </p>
        <div className='space-y-3.5'>
          <DocumentRow
            title='Q4 Budget Review FY26.pdf'
            author='Uploading now'
            pages={0}
            status='processing'
          />
          <DocumentRow
            title='Master Services Agreement — Northwind / Halcyon Systems'
            author='Halcyon Legal'
            pages={24}
            status='ready'
            href='#'
          />
        </div>
      </div>
    </div>
  )
}