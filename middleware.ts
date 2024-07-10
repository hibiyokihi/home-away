import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/bookings(.*)',
  '/checkout(.*)',
  '/favorites(.*)',
  '/profile(.*)',
  '/rentals(.*)',
  '/reviews(.*)',
]);
// properties以外のrouteはclerkでprotectする

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
// isProtectedRouteは、requestされたurlを引数に受けて、それがprotect-listに含まれていればTrueを返す
// auth().protect()は、request.userのis_authenticatedがFalseなら、サインインpagenにredirectする

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};