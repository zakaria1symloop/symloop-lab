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

  // Fetch markdown source from same origin and return as fresh response
  // with explicit Content-Type. The matcher excludes /llms.txt and
  // /.well-known/ so this fetch doesn't re-trigger middleware.
  try {
    const targetUrl = new URL(target, req.nextUrl.origin);
    const upstream = await fetch(targetUrl.toString(), {
      headers: { 'User-Agent': 'symloop-ai-markdown-negotiation/1.0' },
    });
    if (!upstream.ok) {
      const res = NextResponse.next();
      res.headers.append('Vary', 'Accept');
      return res;
    }
    const text = await upstream.text();
    // Rough token estimate (~4 chars per token for English+code mix).
    // Saves agents from re-tokenizing to budget context window usage.
    const approxTokens = Math.ceil(text.length / 4);
    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept',
        'Cache-Control': 'public, max-age=300, must-revalidate',
        'X-Markdown-Source': target,
        'X-Markdown-Tokens': String(approxTokens),
      },
    });
  } catch {
    const res = NextResponse.next();
    res.headers.append('Vary', 'Accept');
    return res;
  }
}

// Match all paths except API routes, Next.js internals, static assets,
// and the markdown source itself (to avoid recursion).
export const config = {
  matcher: [
    '/((?!api/|_next/|_vercel/|llms\\.txt|llms-full\\.txt|\\.well-known/|favicon|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|svg|webp|ico|woff2?|ttf|eot|css|js|map|xml)).*)',
  ],
};
