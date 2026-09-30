import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * High-performance middleware that guards /admin routes.
 * Public routes (home, events, schedule, etc.) bypass auth checks completely
 * to guarantee near-instantaneous page loads (<50ms).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStudentRoute = pathname.startsWith('/student');
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  // FAST PATH: If neither student route nor guarded admin route, bypass completely
  if (!isStudentRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isConfigured =
    supabaseUrl &&
    (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) &&
    !supabaseUrl.includes('your-project') &&
    !supabaseUrl.includes('placeholder') &&
    supabaseKey &&
    !supabaseKey.includes('placeholder') &&
    !supabaseKey.includes('your_supabase');

  if (!isConfigured) {
    // In unconfigured development mode
    if (isAdminRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
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

    const timeoutPromise = new Promise<{ data: { user: null } }>((resolve) =>
      setTimeout(() => resolve({ data: { user: null } }), 3000)
    );
    const userPromise = supabase.auth.getUser();

    const {
      data: { user },
    } = await Promise.race([userPromise, timeoutPromise]);

    // 1. Guard Student Routes
    if (isStudentRoute) {
      const hasRegId = request.nextUrl.searchParams.has('regId');
      if (!user && !hasRegId) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return supabaseResponse;
    }

    // 2. Guard Admin Routes
    if (isAdminRoute) {
      if (!user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/admin/login';
        return NextResponse.redirect(loginUrl);
      }

      // Check role in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const userRole = profile?.role || 'student';
      if (userRole !== 'admin' && userRole !== 'organizer') {
        // Authenticated student trying to access admin route -> redirect to student dashboard
        const studentUrl = request.nextUrl.clone();
        studentUrl.pathname = '/student/dashboard';
        return NextResponse.redirect(studentUrl);
      }
    }
  } catch (error) {
    console.error('Route auth check error:', error);
    if (isAdminRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
    if (isStudentRoute) {
      if (request.nextUrl.searchParams.has('regId')) {
        return supabaseResponse;
      }
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }
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
