'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  TopAppBar,
  PageHeaderBand,
  SectionLabel,
  DocumentRow,
  EmptyState,
  PrimaryButton,
} from '@/components/ui';
import { SignOutButton } from '@/components/sign-out-button';
import { Plus } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  author: string;
  page_count: number;
  status: 'processing' | 'ready' | 'failed';
  created_at: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from('documents')
      .select('id, title, author, page_count, status, created_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setDocuments(data as Document[]);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    fetchDocuments();
    // Refetch on window focus to pick up status changes from uploads
    const handleFocus = () => {
      fetchDocuments();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchDocuments]);

  return (
    <div className="min-h-screen bg-canvas">
      <TopAppBar
        user={{ name: 'Maya Okonkwo', initials: 'MO' }}
      />

      <div className="h-14" aria-hidden="true" />

      <PageHeaderBand
        backLink={{ label: 'Back to upload', href: '/upload' }}
        title="Documents"
        subtitle="Your uploaded PDFs. Open one to ask questions and get cited answers."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionLabel>All documents</SectionLabel>

        <div className="space-y-3.5">
          {loading && (
            <div className="animate-pulse rounded-md h-64 w-full mb-4">
              Skeleton
            </div>
          )}

          {loading && !error && (
            <EmptyState
              title="Loading documents…"
              body="We're fetching your documents. This should only take a moment."
              ctaLabel="Refresh"
              onCta={() => fetchDocuments()}
              steps={[]}
            />
          )}

          {error && (
            <div className="rounded-md bg-status-failed p-4 mb-4">
              <p className="text-status-failed">{error}</p>
            </div>
          )}

          {documents.length === 0 && !loading && !error && (
            <EmptyState
              title="No documents yet."
              body="Upload a PDF and we'll index it so you can ask questions and get cited answers."
              ctaLabel="Upload your first PDF"
              onCta={() => router.push('/upload')}
              steps={['Upload a PDF', 'We extract and index it', 'Ask questions, get citations']}
            />
          )}

          {!loading && !error && documents.length > 0 && (
            <div className="space-y-3.5">
              {documents.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  title={doc.title}
                  author={doc.author || 'Unknown'}
                  pages={doc.page_count}
                  status={doc.status}
                  href={doc.status === 'ready' ? `/documents/${doc.id}` : undefined}
                  onReUpload={
                    doc.status === 'failed'
                      ? () => router.push('/upload')
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}