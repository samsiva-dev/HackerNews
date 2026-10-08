// Server-only: builds a short plain-text description for a story.
//
// 1. If HN itself has body text (Ask/Show/Job posts), use that.
// 2. Otherwise fetch the linked page's <head> and read its
//    og:description / twitter:description / meta description.
//
// The page fetch is hardened against SSRF and abuse:
//   - HTTPS only, default port only, max 3 redirects (each re-validated)
//   - DNS answers are checked at *connect time* (custom `lookup`), so private,
//     loopback, link-local and other non-public IPs are refused even if a
//     hostname re-resolves between checks (DNS rebinding)
//   - hard overall deadline, response size cap, HTML content-type only
//   - results are plain text and rendered escaped by React (never as HTML)
import https from "node:https";
import dns from "node:dns";
import net from "node:net";
import type { HNItem } from "./types";

const DEADLINE_MS = 3500;
const MAX_BYTES = 256 * 1024;
const MAX_REDIRECTS = 3;
const MAX_LEN = 280;
const TTL_OK_MS = 60 * 60 * 1000;
const TTL_FAIL_MS = 10 * 60 * 1000;
const CACHE_MAX = 1000;

// ── Non-public address ranges ──────────────────────────────────────────────
const blocked = new net.BlockList();
for (const [addr, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const) {
  blocked.addSubnet(addr, prefix, "ipv4");
}
for (const [addr, prefix] of [
  ["::", 128],
  ["::1", 128],
  // IPv4-mapped (::ffff:a.b.c.d) is matched against the IPv4 rules by BlockList
  ["64:ff9b::", 96], // NAT64
  ["100::", 64], // discard
  ["2001:db8::", 32], // documentation
  ["fc00::", 7], // unique local
  ["fe80::", 10], // link-local
  ["ff00::", 8], // multicast
] as const) {
  blocked.addSubnet(addr, prefix, "ipv6");
}

export function isPublicAddress(address: string): boolean {
  const family = net.isIP(address);
  if (family === 0) return false;
  return !blocked.check(address, family === 6 ? "ipv6" : "ipv4");
}

type LookupCb = (
  err: NodeJS.ErrnoException | null,
  address: string | dns.LookupAddress[],
  family?: number
) => void;

// Used by https.request at connect time, so the IP that is validated is the
// IP that is connected to.
function safeLookup(
  hostname: string,
  options: dns.LookupOptions,
  callback: LookupCb
) {
  dns.lookup(hostname, { all: true }, (err, addresses) => {
    if (err) return callback(err, "");
    if (!addresses.length || !addresses.every((a) => isPublicAddress(a.address))) {
      const e: NodeJS.ErrnoException = new Error(`Blocked address for ${hostname}`);
      e.code = "EBLOCKED";
      return callback(e, "");
    }
    if (options?.all) return callback(null, addresses);
    callback(null, addresses[0].address, addresses[0].family);
  });
}

function isAllowedUrl(url: URL): boolean {
  return (
    url.protocol === "https:" &&
    (url.port === "" || url.port === "443") &&
    !url.username &&
    !url.password
  );
}

function fetchHead(url: URL, signal: AbortSignal, redirectsLeft: number): Promise<string | null> {
  if (!isAllowedUrl(url) || signal.aborted) return Promise.resolve(null);

  return new Promise((resolve) => {
    let settled = false;
    const done = (v: string | null) => {
      if (!settled) {
        settled = true;
        resolve(v);
      }
    };

    const req = https.get(
      url,
      {
        lookup: safeLookup as unknown as typeof dns.lookup,
        signal,
        headers: {
          "User-Agent": "HN-Mirror-LinkPreview/1.0 (+https://github.com/samsiva-dev/hackernews)",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en",
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;

        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          if (redirectsLeft <= 0) return done(null);
          let next: URL;
          try {
            next = new URL(res.headers.location, url);
          } catch {
            return done(null);
          }
          return fetchHead(next, signal, redirectsLeft - 1).then(done);
        }

        const ctype = String(res.headers["content-type"] ?? "");
        if (status !== 200 || !/text\/html|application\/xhtml\+xml/i.test(ctype)) {
          res.resume();
          return done(null);
        }

        const charset = /charset=([\w-]+)/i.exec(ctype)?.[1] ?? "utf-8";
        let decoder: TextDecoder;
        try {
          decoder = new TextDecoder(charset);
        } catch {
          decoder = new TextDecoder("utf-8");
        }

        const chunks: Buffer[] = [];
        let size = 0;
        const finish = () => {
          res.destroy();
          done(decoder.decode(Buffer.concat(chunks)));
        };

        res.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
          size += chunk.length;
          // Descriptions live in <head>; stop once we have it or hit the cap.
          if (size >= MAX_BYTES || /<\/head>/i.test(chunk.toString("latin1"))) finish();
        });
        res.on("end", finish);
        res.on("error", () => done(null));
      }
    );

    req.on("error", () => done(null));
  });
}

// ── HTML helpers ───────────────────────────────────────────────────────────
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "";
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? m;
  });
}

export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<p\b[^>]*>/gi, " ")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(s: string, max = MAX_LEN): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–—-]+$/, "")}…`;
}

export function extractMetaDescription(html: string): string | null {
  const found: Record<string, string> = {};
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs: Record<string, string> = {};
    for (const m of tag.matchAll(/([a-zA-Z:_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
      attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? "";
    }
    const key = (attrs.property ?? attrs.name ?? "").toLowerCase();
    if (key && attrs.content && !(key in found)) found[key] = attrs.content;
  }
  const raw = found["og:description"] ?? found["twitter:description"] ?? found["description"];
  if (!raw) return null;
  const text = htmlToText(raw);
  return text.length >= 20 ? truncate(text) : null;
}

// ── Cache (per server instance) ────────────────────────────────────────────
const cache = new Map<string, { value: Promise<string | null>; expires: number }>();

function cached(key: string, load: () => Promise<string | null>): Promise<string | null> {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expires > now) return hit.value;

  const value = load().catch(() => null);
  cache.set(key, { value, expires: now + TTL_OK_MS });
  value.then((v) => {
    if (v === null) cache.set(key, { value, expires: Date.now() + TTL_FAIL_MS });
  });

  if (cache.size > CACHE_MAX) {
    // Map preserves insertion order: drop the oldest entries.
    for (const k of cache.keys()) {
      cache.delete(k);
      if (cache.size <= CACHE_MAX) break;
    }
  }
  return value;
}

export async function getStoryDescription(item: HNItem): Promise<string | null> {
  if (item.text) {
    const text = htmlToText(item.text);
    return text ? truncate(text) : null;
  }
  if (!item.url) return null;

  let url: URL;
  try {
    url = new URL(item.url);
  } catch {
    return null;
  }
  if (!isAllowedUrl(url)) return null;

  return cached(url.href, async () => {
    const html = await fetchHead(url, AbortSignal.timeout(DEADLINE_MS), MAX_REDIRECTS);
    return html ? extractMetaDescription(html) : null;
  });
}
