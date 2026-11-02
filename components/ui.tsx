'use client'

import React, { forwardRef, useRef, useState } from 'react'
import { Check, Upload, Plus, ArrowLeft, ChevronRight, ChevronDown } from 'lucide-react'

export interface StatusChipProps {
  state: 'ready' | 'processing' | 'failed'
  label?: string
  className?: string
}

export const StatusChip: React.FC<StatusChipProps> = ({ state, label, className = '' }) => {
  const defaultLabel = state === 'ready' ? 'Ready' : state === 'processing' ? 'Processing' : 'Failed'
  const displayLabel = label || defaultLabel

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm h-[22px] text-caption ${className}`}>
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          state === 'processing' ? 'animate-pulse' : ''
        } bg-status-${state}`}
      />
      <span className={`text-status-${state}`}>{displayLabel}</span>
    </div>
  )
}

export interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  fullWidth?: boolean
  size?: 'default' | 'lg'
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ children, onClick, type = 'button', disabled = false, className = '', fullWidth = false, size = 'default' }, ref) => {
    const padding = size === 'lg' ? 'px-5 py-2.5' : 'px-4 py-2'
    const inlineStyle = disabled ? undefined : { backgroundColor: '#2F6B4F', color: '#FFFFFF' }

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={inlineStyle}
        className={`${padding} text-label font-medium rounded-btn bg-accent text-white min-h-[44px] sm:min-h-[40px] hover:bg-accent-hover active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-150 ${
          disabled ? 'opacity-70 cursor-not-allowed' : ''
        } ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {children}
      </button>
    )
  }
)
PrimaryButton.displayName = 'PrimaryButton'

export interface GhostButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

export const GhostButton = forwardRef<HTMLButtonElement, GhostButtonProps>(
  ({ children, onClick, type = 'button', disabled = false, className = '' }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`px-5 py-2.5 text-label font-medium rounded-btn border border-line text-ink-muted min-h-[44px] hover:text-ink-strong active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-150 ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        } ${className}`}
      >
        {children}
      </button>
    )
  }
)
GhostButton.displayName = 'GhostButton'

export interface CitationLinkProps {
  children: React.ReactNode
  href: string
  pageNumber: number
  className?: string
}

export const CitationLink: React.FC<CitationLinkProps> = ({ children, href, pageNumber, className = '' }) => {
  return (
    <a
      href={href}
      aria-label={`Go to citation page ${pageNumber}`}
      className={`text-accent font-serif underline underline-offset-[3px] decoration-1 hover:bg-accent-soft hover:rounded-sm px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-accent/40 min-h-[44px] sm:min-h-0 inline-flex items-center transition-colors duration-120 ${className}`}
    >
      {children}
    </a>
  )
}

export interface SectionLabelProps {
  children: string
  className?: string
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children, className = '' }) => {
  return (
    <p className={`font-sans text-micro uppercase tracking-wider text-ink-muted font-medium ${className}`}>
      {children}
    </p>
  )
}

export interface QuietAsideProps {
  children: React.ReactNode
  className?: string
}

export const QuietAside: React.FC<QuietAsideProps> = ({ children, className = '' }) => {
  return (
    <div className={`border-l-2 border-accent-soft pl-4 py-1 ${className}`}>
      <div className="font-serif text-body-reading text-ink-body leading-relaxed">{children}</div>
    </div>
  )
}

export interface DocumentRowProps {
  title: string
  author: string
  pages: number
  status: 'ready' | 'processing' | 'failed'
  href?: string
  onReUpload?: () => void
  className?: string
}

export const DocumentRow: React.FC<DocumentRowProps> = ({
  title,
  author,
  pages,
  status,
  href,
  onReUpload,
  className = '',
}) => {
  const isReady = status === 'ready' && href
  const bgColor = status === 'processing' ? 'bg-reading-surface' : 'bg-surface-raised'
  const titleColor = status === 'processing' ? 'text-ink-muted' : 'text-ink-strong'

  const content = (
    <div
      className={`${bgColor} border border-line rounded-md shadow-elevation-1 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 transition-colors duration-150 ${
        isReady
          ? 'hover:bg-reading-surface hover:border-accent/40 cursor-pointer'
          : ''
      } ${className}`}
      {...(isReady
        ? {
            role: 'link',
            onClick: (e: React.MouseEvent) => {
              if (isReady && href) {
                e.preventDefault()
                window.location.href = href
              }
            },
            onKeyDown: (e: React.KeyboardEvent) => {
              if ((e.key === 'Enter' || e.key === ' ') && isReady && href) {
                e.preventDefault()
                window.location.href = href
              }
            },
            tabIndex: 0,
          }
        : {})}
    >
      <div className="flex-1 min-w-0">
        <h3 className={`font-serif text-headline ${titleColor} truncate`}>{title}</h3>
        <div className="font-sans text-label text-ink-muted mt-1.5 flex flex-wrap gap-x-1.5 gap-y-0.5">
          <span>{author}</span>
          <span>·</span>
          <span>{pages} pages</span>
          <span>·</span>
          <span className="font-micro uppercase tracking-wider">PDF</span>
        </div>
        {status === 'processing' && (
          <p className="mt-1 font-sans text-label text-status-processing font-medium">
            Processing — extracting text
          </p>
        )}
        {status === 'failed' && (
          <p className="mt-1 font-sans text-label text-ink-muted">
            Couldn't process this file.{' '}
            <button
              onClick={onReUpload}
              className="text-accent underline hover:text-accent-hover min-h-[44px] inline-flex items-center focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              Re-upload
            </button>
          </p>
        )}
      </div>
      <div className="mt-2 sm:mt-0 shrink-0">
        <StatusChip state={status} />
      </div>
    </div>
  )

  if (isReady && href) {
    return <a href={href}>{content}</a>
  }
  return <article>{content}</article>
}

export interface EmptyStateProps {
  title: string
  body: string
  ctaLabel: string
  onCta: () => void
  steps?: string[]
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  body,
  ctaLabel,
  onCta,
  steps,
  className = '',
}) => {
  return (
    <div className={`py-16 sm:py-20 ${className}`}>
      <h2 className="font-serif text-headline text-ink-strong">{title}</h2>
      <p className="font-serif text-body-reading text-ink-body mt-2 max-w-xl">{body}</p>
      <PrimaryButton onClick={onCta} className="mt-6">
        {ctaLabel}
      </PrimaryButton>
      {steps && steps.length === 3 && (
        <div className="mt-10">
          <div className="hidden md:flex items-center justify-between gap-3">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-soft text-accent text-caption font-semibold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <span className="font-sans text-body-ui text-ink-muted">{step}</span>
                </div>
                {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-ink-faint" />}
              </React.Fragment>
            ))}
          </div>
          <ol className="md:hidden space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent-soft text-accent text-caption font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="font-sans text-body-ui text-ink-muted">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export interface PageHeaderBandProps {
  title: string
  subtitle: string
  primaryAction?: { label: string; onClick: () => void; icon?: React.ReactNode }
  backLink?: { label: string; href: string }
  className?: string
}

export const PageHeaderBand: React.FC<PageHeaderBandProps> = ({
  title,
  subtitle,
  primaryAction,
  backLink,
  className = '',
}) => {
  return (
    <section className={`pt-10 pb-8 border-b border-line ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {backLink && (
          <a
            href={backLink.href}
            className="text-accent hover:text-accent-hover font-sans text-label font-medium min-h-[44px] inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLink.label}
          </a>
        )}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mt-4">
          <div className="flex-1">
            <h1 className="font-serif text-display text-ink-strong">{title}</h1>
            <p className="font-sans text-body-ui text-ink-muted mt-2 max-w-2xl">{subtitle}</p>
          </div>
          {primaryAction && (
            <div className="md:mt-0">
              <PrimaryButton onClick={primaryAction.onClick} className="flex items-center gap-2">
                {primaryAction.icon}
                {primaryAction.label}
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export interface TopAppBarProps {
  currentPage?: string
  breadcrumbRoot?: string
  user?: { name: string; initials: string } | null
  className?: string
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentPage,
  breadcrumbRoot = 'Documents',
  user,
  className = '',
}) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-14 bg-canvas/95 backdrop-blur-md border-b border-line ${className}`}>
      <div className="h-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <span className="font-sans text-body-ui font-semibold text-ink-strong tracking-tight shrink-0">
            Marginalia
          </span>
          {(breadcrumbRoot || currentPage) && (
            <>
              <span className="font-micro text-ink-faint shrink-0">/</span>
              {breadcrumbRoot && (
                <>
                  <span className="font-sans text-body-ui font-medium text-ink-strong shrink-0">
                    {breadcrumbRoot}
                  </span>
                  {currentPage && <span className="font-micro text-ink-faint shrink-0">/</span>}
                </>
              )}
              {currentPage && (
                <span className="font-sans text-body-ui font-medium text-ink-strong truncate max-w-[140px] sm:max-w-none">
                  {currentPage}
                </span>
              )}
            </>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block font-sans text-label text-ink-muted">
              {user.name}
            </span>
            <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center font-sans text-caption font-semibold text-accent">
              {user.initials}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export interface TopAppBarReducedProps {
  className?: string
}

export const TopAppBarReduced: React.FC<TopAppBarReducedProps> = ({ className = '' }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-14 bg-canvas/95 backdrop-blur-md border-b border-line ${className}`}>
      <div className="h-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <span className="font-sans text-body-ui font-semibold text-ink-strong tracking-tight">
          Marginalia
        </span>
      </div>
    </header>
  )
}

export interface DropZoneProps {
  onFileSelect: (file: File) => void
  onDragOver?: () => void
  onDragLeave?: () => void
  isDragging?: boolean
  className?: string
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFileSelect,
  onDragOver,
  onDragLeave,
  isDragging = false,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (onDragLeave) onDragLeave()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      onFileSelect(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        if (onDragOver) onDragOver()
      }}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      className={`bg-reading-surface border-2 border-dashed border-line rounded-lg py-12 sm:py-16 px-6 sm:px-8 text-center flex flex-col items-center justify-center min-h-[220px] md:min-h-[340px] transition-colors duration-150 ${
        isDragging ? 'bg-accent-soft border-accent border-solid' : ''
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      <h2 className="hidden md:block font-serif text-headline text-ink-strong mb-2">
        Drop your PDF here
      </h2>
      <h2 className="block md:hidden font-serif text-headline text-ink-strong mb-4">
        Choose a PDF
      </h2>
      <p className="hidden md:block font-sans text-body-ui text-ink-muted mb-4">or</p>
      <PrimaryButton
        onClick={() => fileInputRef.current?.click()}
        className="w-full md:w-auto flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Choose file
      </PrimaryButton>
      <p className="font-sans text-caption text-ink-faint mt-3">PDF only · up to 50 MB</p>
    </div>
  )
}

export interface PipelineStep {
  label: string
  subtitle: string
  state: 'pending' | 'active' | 'done' | 'failed'
  failureDetail?: string
}

export interface ProcessingPanelProps {
  filename: string
  status: 'processing' | 'failed' | 'success'
  steps: PipelineStep[]
  failureMessage?: string
  successMessage?: string
  actions?: React.ReactNode
  className?: string
}

export const ProcessingPanel: React.FC<ProcessingPanelProps> = ({
  filename,
  status,
  steps,
  failureMessage,
  successMessage,
  actions,
  className = '',
}) => {
  const statusChipState = status === 'processing' ? 'processing' : status === 'failed' ? 'failed' : 'ready'
  const metaText =
    status === 'processing' ? 'PDF · uploading' : status === 'failed' ? 'PDF' : 'PDF · 24 pages'

  return (
    <div className={`bg-surface-raised border border-line rounded-md shadow-elevation-1 p-6 sm:p-8 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-headline text-ink-strong truncate">{filename}</h3>
          <p className="font-sans text-label text-ink-muted mt-1">{metaText}</p>
        </div>
        <StatusChip state={statusChipState} />
      </div>
      {(status === 'processing' || status === 'failed') && (
        <>
          <SectionLabel className="mt-6">INGESTION PIPELINE</SectionLabel>
          <div className="mt-4 space-y-3">
            {steps.map((step, i) => (
              <PipelineStep key={i} {...step} />
            ))}
          </div>
        </>
      )}
      {status === 'failed' && failureMessage && (
        <p className="font-serif text-body-reading text-ink-body mt-6">{failureMessage}</p>
      )}
      {status === 'success' && successMessage && (
        <p className="font-serif text-body-reading text-ink-body mt-4">{successMessage}</p>
      )}
      {actions && <div className="mt-8 flex flex-col sm:flex-row gap-3">{actions}</div>}
    </div>
  )
}

export interface PipelineStepProps {
  label: string
  subtitle: string
  state: 'pending' | 'active' | 'done' | 'failed'
  failureDetail?: string
  className?: string
}

export const PipelineStep: React.FC<PipelineStepProps> = ({
  label,
  subtitle,
  state,
  failureDetail,
  className = '',
}) => {
  const glyph = (() => {
    switch (state) {
      case 'pending':
        return (
          <div className="w-[18px] h-[18px] rounded-full border border-line shrink-0 mt-0.5" />
        )
      case 'active':
        return (
          <div className="w-[18px] h-[18px] rounded-full bg-accent-soft flex items-center justify-center shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
        )
      case 'done':
        return (
          <div className="w-[18px] h-[18px] rounded-full bg-accent-soft flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3 h-3 text-accent" strokeWidth={2.5} />
          </div>
        )
      case 'failed':
        return (
          <div className="w-[18px] h-[18px] rounded-full bg-status-failed-bg flex items-center justify-center shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-status-failed" />
          </div>
        )
    }
  })()

  const labelColor = state === 'pending' ? 'text-ink-muted' : 'text-ink-strong'
  const subtitleColor =
    state === 'failed' && failureDetail
      ? 'text-status-failed'
      : state === 'pending'
      ? 'text-ink-faint'
      : 'text-ink-muted'
  const subtitleText = state === 'failed' && failureDetail ? failureDetail : subtitle

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {glyph}
      <div className="flex-1">
        <p className={`font-sans text-label font-medium ${labelColor}`}>{label}</p>
        <p className={`font-sans text-caption mt-0.5 ${subtitleColor}`}>{subtitleText}</p>
      </div>
    </div>
  )
}

export interface NotAnswerStateProps {
  headline: string
  bridge: string
  suggestions: string
  onAskAgain?: () => void
  className?: string
}

export const NotAnswerState: React.FC<NotAnswerStateProps> = ({
  headline,
  bridge,
  suggestions,
  onAskAgain,
  className = '',
}) => {
  return (
    <div className={`border-l-2 border-accent-soft pl-4 sm:pl-5 py-2 ${className}`}>
      <h3 className="font-serif text-headline text-ink-strong leading-tight">{headline}</h3>
      <p className="font-serif text-body-reading text-ink-body leading-relaxed mt-3">{bridge}</p>
      <p className="font-sans text-body-ui text-ink-muted mt-3">{suggestions}</p>
      {onAskAgain && (
        <button
          onClick={onAskAgain}
          className="text-accent hover:underline font-sans text-body-ui font-medium inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 mt-3 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          Ask a different question <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export interface FormFieldProps {
  id: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  helperText?: string
  errorMessage?: string
  disabled?: boolean
  required?: boolean
  className?: string
  helperRight?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      id,
      label,
      type = 'text',
      placeholder,
      value,
      onChange,
      helperText,
      errorMessage,
      disabled = false,
      required = false,
      className = '',
      helperRight,
    },
    ref
  ) => {
    if (helperRight) {
      console.warn('FormField: helperRight prop is ignored in v1 (deferred to v2)')
    }

    const hasError = !!errorMessage
    const inputStyle = hasError ? { borderColor: 'rgba(168,80,60,0.4)' } : undefined
    const helperStyle = hasError ? { color: '#A8503C' } : undefined
    const helperContent = hasError ? errorMessage : helperText
    const helperClassName = hasError ? '' : 'text-ink-muted'

    return (
      <div className={className}>
        <label htmlFor={id} className="font-sans text-label text-ink-strong mb-1.5 block">
          {label}
          {required && <span className="text-status-failed ml-1">*</span>}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={inputStyle}
          className="block w-full rounded-btn border border-line bg-surface-raised px-3 py-2.5 text-body-ui text-ink-strong placeholder:text-ink-faint min-h-[44px] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
        />
        {helperContent && (
          <p
            className={`font-sans text-caption mt-1 ${helperClassName}`}
            style={helperStyle}
          >
            {helperContent}
          </p>
        )}
      </div>
    )
  }
)
FormField.displayName = 'FormField'

export interface ModeToggleProps {
  promptText: string
  linkText: string
  onLinkClick: () => void
  className?: string
}

export interface SourceBlockProps {
  sources: Array<{ title: string; page: number; snippet: string }>
  defaultExpanded?: boolean
  highlightPage?: number
  className?: string
}

export const SourceBlock: React.FC<SourceBlockProps> = ({
  sources,
  defaultExpanded = false,
  highlightPage,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="font-sans text-label text-ink-muted hover:text-ink-strong py-2 px-3 rounded-sm hover:bg-reading-surface border border-transparent hover:border-line transition-colors min-h-[44px] sm:min-h-0 inline-flex items-center gap-2"
      >
        <span>{sources.length} source{sources.length !== 1 ? 's' : ''} (click to preview)</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="bg-surface-raised border border-line rounded-md shadow-elevation-1 p-4 mt-3 space-y-3">
          <p className="font-sans text-caption text-ink-faint uppercase tracking-wider">
            {sources.length} reference{sources.length !== 1 ? 's' : ''}
          </p>
          {sources.map((source, i) => {
            const isHighlighted = highlightPage === source.page
            return (
              <div
                key={i}
                className={`p-3 rounded-md space-y-1 border ${
                  isHighlighted
                    ? 'bg-accent-soft border-[#2F6B4F]/20'
                    : 'bg-surface-raised border-line'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-semibold text-ink-strong text-label">
                    {source.title}
                  </span>
                  <span className="font-serif text-accent font-medium text-label">
                    p. {source.page}
                  </span>
                </div>
                <p className="font-serif text-body-ui text-ink-body italic">
                  "{source.snippet}"
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  promptText,
  linkText,
  onLinkClick,
  className = '',
}) => {
  return (
    <p className={`font-sans text-label text-ink-muted text-center ${className}`}>
      {promptText}{' '}
      <button
        type="button"
        onClick={onLinkClick}
        className="text-accent hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 min-h-[44px] sm:min-h-0 inline-flex items-center"
      >
        {linkText}
      </button>
    </p>
  )
}

export const ui = {
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
  SourceBlock,
}
