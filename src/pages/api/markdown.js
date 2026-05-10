// Markdown for Agents — serves llms.txt as text/markdown.
//
// This API route is the destination of beforeFiles rewrites in
// next.config.js. When an agent requests `/` (or `/en`, `/fr`, `/ar`)
// with Accept: text/markdown, Vercel rewrites the request to here
// BEFORE its static-file CDN can serve the prerendered HTML. We read
// the same /llms.txt content and return it with proper Content-Type.
//
// Spec: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/

import fs from 'fs';
import path from 'path';

// Resolve once at cold start.
const LLMS_PATH = path.join(process.cwd(), 'public', 'llms.txt');

export default function handler(req, res) {
  let body;
  try {
    body = fs.readFileSync(LLMS_PATH, 'utf-8');
  } catch (err) {
    res.status(500).setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('llms.txt unavailable');
  }

  const tokens = Math.ceil(body.length / 4);

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Vary', 'Accept');
  res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
  res.setHeader('X-Markdown-Source', '/llms.txt');
  res.setHeader('X-Markdown-Tokens', String(tokens));
  res.status(200).send(body);
}
