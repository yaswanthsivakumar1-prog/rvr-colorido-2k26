import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * High-performance middleware that guards /admin routes.
 * Public routes (home, events, schedule, etc.) bypass auth checks completely
 * to guarantee near-instantaneous page loads (<50ms).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. FAST PATH: If not an admin route or is the login page, bypass completely
  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  // 2. ADMIN ROUTE GUARD
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is unconfigured / placeholder, redirect to login
  const isConfigured =
    supabaseUrl &&
    (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) &&
    !supabaseUrl.includes('your-project') &&
    !supabaseUrl.includes('placeholder') &&
    supabaseKey &&
    !supabaseKey.includes('placeholder') &&
    !supabaseKey.includes('your_supabase');

  if (!isConfigured) {
    // In unconfigured development mode, redirect to admin login
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
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
    });

    // Check authenticated user with a timeout to avoid hangs
    const timeoutPromise = new Promise<{ data: { user: null } }>((resolve) =>
      setTimeout(() => resolve({ data: { user: null } }), 3000)
    );
    const userPromise = supabase.auth.getUser();

    const {
      data: { user },
    } = await Promise.race([userPromise, timeoutPromise]);

    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error('Admin route auth check error:', error);
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match only routes that require middleware checks
     * Skips static assets, public images, icons, and API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
