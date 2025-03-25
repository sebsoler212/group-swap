// middleware.ts (in project root)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Optional: if you want edge runtime. If you don't specify, it's nodejs by default.
// export const runtime = 'edge'

export async function middleware(req: NextRequest) {
  // console.log('Middleware triggered for:', req.nextUrl.pathname)
  
  // Create the supabase client using the request/response
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Retrieve session
  const { data: { session } } = await supabase.auth.getSession()
  // console.log('Session in middleware:', session)
  
  // If user not logged in, redirect to /login
  if (!session) {
    console.log('No session, redirecting to /login')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Otherwise, allow the request
  console.log('Session found, continuing')
  return res
}

export const config = {
  // This ensures the middleware only runs on /create, /profile, or subpaths
  matcher: ['/create/:path*', '/profile/:path*'],
}
