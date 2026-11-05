'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopAppBar } from '@/components/ui';
import { PageHeaderBand } from '@/components/ui';
import { SectionLabel } from '@/components/ui';
import { DropZone } from '@/components/ui';
import { ProcessingPanel } from '@/components/ui';
import { PrimaryButton } from '@/components/ui';
import { GhostButton } from '@/components/ui';
import { QuietAside } from '@/components/ui';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'failed';

export default function UploadPage() {
  const router = useRouter();
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ documentId: string; pageCount: number; chunkCount: number } | null>(null);

  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('File must be a PDF.');
      setStatus('failed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10 MB.');
      setStatus('failed');
      return;
    }

    setStatus('uploading');
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace(/\.pdf$/i, ''));

    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ingestion failed. Please try again.');
        setStatus('failed');
        return;
      }

      setResult({
        documentId: data.documentId,
        pageCount: data.pageCount,
        chunkCount: data.chunkCount,
      });
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
      setStatus('failed');
    }
  };

  const reset = () => {
    setStatus('idle');
    setError(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <TopAppBar
        currentPage="Upload"
        breadcrumbRoot="Documents"
        user={{ name: 'Maya Okonkwo', initials: 'MO' }}
      />

      <div className="h-14" aria-hidden="true" />

      <PageHeaderBand
        backLink={{ label: 'Back to documents', href: '/documents' }}
        title="Upload a PDF"
        subtitle="Add a document to your library. We'll extract the text, index it, and make it ready to ask questions about."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {status === 'idle' && (
            <>
              <SectionLabel>UPLOAD</SectionLabel>
              <DropZone onFileSelect={handleFileSelect} />
              <div className="mt-10">
                <QuietAside>
                  PDF files up to 10 MB. We extract the text, split it into sections, and generate embeddings so you can ask questions and get cited answers.
                </QuietAside>
              </div>
            </>
          )}

          {status === 'uploading' && (
            <div className="max-w-2xl mx-auto">
              <ProcessingPanel
                filename="Processing PDF..."
                status="processing"
                steps={[
                  { label: 'Extracting text', subtitle: 'Reading the PDF pages', state: 'active' },
                  { label: 'Chunking', subtitle: 'Splitting into sentence-aware sections', state: 'pending' },
                  { label: 'Embedding', subtitle: 'Generating vectors for retrieval', state: 'pending' },
                  { label: 'Ready', subtitle: 'Your document is searchable', state: 'pending' },
                ]}
                actions={null}
              />
            </div>
          )}

          {status === 'success' && result && (
            <div className="max-w-2xl mx-auto">
              <ProcessingPanel
                filename="Document ready"
                status="success"
                steps={[]}
                successMessage={`Your document is ready. ${result.pageCount} pages processed, ${result.chunkCount} chunks indexed.`}
                actions={
                  <>
                    <PrimaryButton onClick={() => router.push(`/documents/${result.documentId}`)}>
                      Open document
                    </PrimaryButton>
                    <GhostButton onClick={reset}>Upload another</GhostButton>
                  </>
                }
              />
            </div>
          )}

          {status === 'failed' && (
            <div className="max-w-2xl mx-auto">
              <ProcessingPanel
                filename="Upload failed"
                status="failed"
                steps={[]}
                failureMessage={error || 'Something went wrong. Please try again.'}
                actions={
                  <>
                    <PrimaryButton onClick={reset}>Try again</PrimaryButton>
                    <GhostButton onClick={() => router.push('/documents')}>Back to documents</GhostButton>
                  </>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}