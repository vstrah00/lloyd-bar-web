import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server'; // Import NextRequest for typing

const nextIntlMiddleware = createMiddleware({
  locales: ['en', 'hr'], // Define available languages (English & Croatian)
  defaultLocale: 'en', // Default to English
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass i18n for /studio and its subpaths
  if (pathname.startsWith('/studio')) {
    // Skip next-intl middleware for /studio
    return;
  }

  // Apply next-intl middleware for all other routes
  return nextIntlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], // Ignore API, Next.js internals, and static files
};