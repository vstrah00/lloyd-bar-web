import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'hr'], // Define available languages (English & Croatian)
  defaultLocale: 'en', // Default to English
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], // Ignore API, Next.js internals, and static files
};