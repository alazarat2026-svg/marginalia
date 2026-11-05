'use client';

import React from 'react'
import { TopAppBar } from '@/components/ui'
import { PageHeaderBand } from '@/components/ui'
import { SectionLabel } from '@/components/ui'
import { DocumentRow } from '@/components/ui'
import { EmptyState } from '@/components/ui'
import { PrimaryButton } from '@/components/ui'
import { Plus } from 'lucide-react'
import { SignOutButton } from '@/components/sign-out-button'

export default function DocumentsListPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* SECTION 1 ' Top app bar */}
      <TopAppBar
        user={{ name: 'Maya Okonkwo', initials: 'MO' }}
      />

      {/* SECTION 2 ' Page header band */}
      <div className="pt-10 pb-8 border-b border-line max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mt-4">
          <div className="flex-1">
            <h1 className="font-serif text-display text-ink-strong">Documents</h1>
            <p className="font-sans text-body-ui text-ink-muted mt-2 max-w-2xl">
              Your uploaded PDFs. Open one to ask questions.
            </p>
          </div>
          <div className="md:mt-0 flex items-center gap-2">
            <PrimaryButton onClick={() => {}} className="flex items-center gap-2">
              <Plus className='w-4 h-4' />
              Upload PDF
            </PrimaryButton>
            <SignOutButton />
          </div>
        </div>
      </div>

      {/* SECTION 3 ' Populated documents list */}
      <section className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <SectionLabel>All documents</SectionLabel>
        <div className='space-y-3.5'>
          <DocumentRow
            title='Master Services Agreement — Northwind / Halcyon Systems'
            author='Halcyon Legal'
            pages={24}
            status='ready'
            href='#'
          />
          <DocumentRow
            title='Adaptive Thermal Regulation in Low-Power Sensor Networks'
            author='R. Ferreira et al.'
            pages={18}
            status='ready'
            href='#'
          />
          <DocumentRow
            title='Field Reliability Report: Model XR-200, Q3'
            author='Northwind Engineering'
            pages={42}
            status='processing'
          />
          <DocumentRow
            title='Q4 Vendor Consolidation Proposal'
            author='J. Park'
            pages={9}
            status='failed'
            onReUpload={() => {}}
          />
          <DocumentRow
            title='Chapter 6 — Distributed Consensus'
            author='K. Adeyemi'
            pages={31}
            status='ready'
            href='#'
          />
        </div>
      </section>

      {/* SECTION 4 ' Labeled alternate: Empty state */}
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

      {/* SECTION 5 ' Labeled alternate: Upload-in-progress */}
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
            title='Master Services Agreement \u2014 Northwind / Halcyon Systems'
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

