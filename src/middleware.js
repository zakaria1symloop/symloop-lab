// Markdown for Agents — content negotiation per Cloudflare's
// "Markdown for Agents" pattern. When a request includes
// `Accept: text/markdown` (and does NOT prefer text/html), serve a markdown
// representation. Otherwise pass through HTML with a Vary: Accept header.
//
// Spec: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
//
// For Symloop AI, the markdown source is /llms.txt — the canonical
// agent-readable identity. All HTML routes that have a markdown variant
// alias to that file.

import { NextResponse } from 'next/server';

function homepageTarget(pathname) {
  // Apex + locale roots all alias to /llms.txt
  if (pathname === '/' || pathname === '') return '/llms.txt';
  if (/^\/(en|fr|ar)\/?$/.test(pathname)) return '/llms.txt';
  return null;
}

export async function middleware(req) {
  const accept = req.headers.get('accept') || '';
  const acceptsMarkdown = /text\/markdown/i.test(accept);
  const acceptsHtml = /text\/html/i.test(accept);
  // Serve markdown only when the client explicitly asks for it without
  // preferring HTML. Browsers send `text/html, ...` — they keep HTML.
  const wantsMarkdown = acceptsMarkdown && !acceptsHtml;

  if (!wantsMarkdown) {
    const res = NextResponse.next();
    res.headers.append('Vary', 'Accept');
    res.headers.set('X-Middleware-Ran', 'true');
    return res;
  }

  const target = homepageTarget(req.nextUrl.pathname);
  if (!target) {
    // Markdown requested but no variant available — pass HTML.
    const res = NextResponse.next();
    res.headers.append('Vary', 'Accept');
    return res;
  }

  // Internally rewrite to /api/markdown/ — that endpoint reads llms.txt
  // and returns it with the correct Content-Type: text/markdown header.
  // We use rewrite() (not a custom NextResponse) because Vercel's edge
  // strips Content-Type from middleware-constructed bodies in some
  // configurations. The api route's headers are preserved cleanly.
  const url = req.nextUrl.clone();
  url.pathname = '/api/markdown/';
  url.search = '';
  const res = NextResponse.rewrite(url);
  res.headers.set('Vary', 'Accept');
  res.headers.set('X-Middleware-Ran', 'markdown');
  return res;
}

// Match all paths except API routes, Next.js internals, static assets,
// and the markdown source itself (to avoid recursion). Two explicit
// matchers because the negative-lookahead glob doesn't always catch
// the apex `/` reliably.
export const config = {
  matcher: [
    '/',
    '/((?!api|_next|_vercel|llms\\.txt|llms-full\\.txt|\\.well-known|favicon|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|svg|webp|ico|woff2?|ttf|eot|css|js|map|xml)).*)',
  ],
};
