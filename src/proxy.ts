import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Protected routes - require authentication
const protectedRoutes = ['/admin']

// Public routes that should redirect authenticated users
const authRoutes = ['/auth/signin', '/auth/signup']

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const path = req.nextUrl.pathname

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route))

  // Redirect to login if trying to access protected route without authentication
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Redirect to admin if already logged in and trying to access auth routes
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
})

// Routes that proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
