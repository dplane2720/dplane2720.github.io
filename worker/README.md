# dplane-portfolio-events

Click-event logger for the portfolio site. Receives `POST /log {event}` from
`index.html`, validates origin + event name, hashes the visitor IP, and inserts
a row into D1. No read endpoint — query the data via the Cloudflare dashboard
or `wrangler d1 execute`.

## First-time setup

```sh
# 1. Install Wrangler globally (or use `npx wrangler` for everything below)
npm install -g wrangler

# 2. Log in
wrangler login

# 3. Create the D1 database — copy the returned database_id into wrangler.toml
wrangler d1 create dplane-portfolio-events

# 4. Apply schema (remote = production D1, not local emulator)
wrangler d1 execute dplane-portfolio-events --remote --file=schema.sql

# 5. Deploy
wrangler deploy
```

After `wrangler deploy`, copy the printed worker URL (e.g.
`https://dplane-portfolio-events.<subdomain>.workers.dev`) and paste it into
the `WORKER_URL` constant in `../index.html`.

## Viewing the log

**Cloudflare dashboard:** Workers & Pages → D1 → `dplane-portfolio-events`
→ Console. Run SQL like:

```sql
-- Latest 50 events, timestamps converted to Eastern
SELECT
  datetime(ts, '-5 hours') AS ts_et,   -- swap to '-4 hours' during EDT
  event, country, referrer
FROM events
ORDER BY ts DESC
LIMIT 50;

-- Counts by event, last 30 days
SELECT event, COUNT(*) AS n
FROM events
WHERE ts >= datetime('now', '-30 days')
GROUP BY event ORDER BY n DESC;

-- Unique visitors (by ip_hash) per event
SELECT event, COUNT(DISTINCT ip_hash) AS unique_visitors
FROM events
GROUP BY event ORDER BY unique_visitors DESC;
```

**Terminal:**

```sh
wrangler d1 execute dplane-portfolio-events --remote \
  --command "SELECT ts, event, country FROM events ORDER BY ts DESC LIMIT 20;"
```

## Adding a new tracked link

1. Add the event name to `ALLOWED_EVENTS` in `src/index.js`.
2. Add the classification rule in the `classifyLink` function in `index.html`.
3. `wrangler deploy`.
