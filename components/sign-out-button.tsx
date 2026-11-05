'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth');
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="font-sans text-label text-ink-muted hover:text-ink-strong min-h-[44px] inline-flex items-center"
    >
      Sign out
    </button>
  );
}
