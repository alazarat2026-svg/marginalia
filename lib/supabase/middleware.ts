import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public routes: /auth, /auth/callback
  const isAuthRoute = pathname === '/auth' || pathname.startsWith('/auth/callback');
  const isProtectedRoute =
    pathname.startsWith('/documents') ||
    pathname.startsWith('/upload') ||
    pathname === '/';

  // Redirect unauthenticated users to /auth
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Redirect authenticated users away from /auth
  if (user && pathname === '/auth') {
    return NextResponse.redirect(new URL('/documents', request.url));
  }

  // Redirect root to /documents (for authenticated users) or /auth (for unauthenticated)
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(user ? '/documents' : '/auth', request.url)
    );
  }

  return supabaseResponse;
}
