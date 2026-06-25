// Tiny event-logging Worker for dplane2720.github.io
// Receives POST /log { "event": "<name>" }, validates, and inserts into D1.
// No read endpoint — query the DB via the Cloudflare dashboard or `wrangler d1 execute`.

const ALLOWED_ORIGINS = new Set([
  'https://dplane2720.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
]);

const ALLOWED_EVENTS = new Set([
  'resume',
  'thesis',
  'github',
  'linkedin',
  'email',
  'project-ds625',
  'project-ee505',
  'project-ma506',
  'project-me595',
  'project-me622',
]);

// Constant, baked-in salt. Not a secret — its only job is to make the IP
// hash non-reversible against generic rainbow tables. Rotating it invalidates
// historical unique-visitor counts.
const IP_SALT = 'dplane-portfolio-2026';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== 'POST' || url.pathname !== '/log') {
      return new Response('Not found', { status: 404 });
    }

    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.has(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    let payload;
    try {
      payload = JSON.parse(await request.text());
    } catch {
      return new Response('Bad request', { status: 400 });
    }

    if (!payload || !ALLOWED_EVENTS.has(payload.event)) {
      return new Response('Bad event', { status: 400 });
    }

    const ip = request.headers.get('CF-Connecting-IP') || '';
    const ipHash = await sha256(ip + IP_SALT);

    await env.DB.prepare(
      'INSERT INTO events (ts, event, country, referrer, user_agent, ip_hash) VALUES (?, ?, ?, ?, ?, ?)'
    )
      .bind(
        new Date().toISOString(),
        payload.event,
        request.headers.get('CF-IPCountry') || null,
        request.headers.get('Referer') || null,
        request.headers.get('User-Agent') || null,
        ipHash,
      )
      .run();

    return new Response(null, {
      status: 204,
      headers: { 'Access-Control-Allow-Origin': origin },
    });
  },
};

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
