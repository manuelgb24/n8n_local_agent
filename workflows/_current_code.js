function toMillis(v) {
  if (!v) return null;
  const d = new Date(v);
  const t = d.getTime();
  return Number.isNaN(t) ? null : t;
}

function inNetherlands(text) {
  const t = String(text || '').toLowerCase();
  const keys = ['netherlands', 'nederland', 'amsterdam', 'rotterdam', 'utrecht', 'the hague', 'den haag', 'eindhoven'];
  return keys.some(k => t.includes(k));
}

const input = items[0]?.json || {};
const cvKeywords = String(input.cv_keywords || '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

const terms = String(input.search_terms || '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

const payload = input;
const rows = Array.isArray(payload.results) ? payload.results : [];

const now = Date.now();
const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
const sd = $getWorkflowStaticData('global');
if (!sd.seen) sd.seen = {};

const ttlMs = 45 * 24 * 60 * 60 * 1000;
for (const [k, ts] of Object.entries(sd.seen)) {
  if (!ts || (now - ts) > ttlMs) delete sd.seen[k];
}

let candidates = 0;
let passed = 0;
const out = [];

for (const j of rows) {
  candidates++;

  const title = j?.title || '';
  const company = (j?.company && j.company.display_name) ? j.company.display_name : '';
  const location = (j?.location && j.location.display_name) ? j.location.display_name : '';
  const datePostedRaw = j?.created || null;
  const applyUrl = j?.redirect_url || '';
  const description = String(j?.description || '').replace(/\s+/g, ' ').trim();

  const dateMs = toMillis(datePostedRaw);
  if (!applyUrl || !dateMs) continue;
  if (dateMs < sevenDaysAgo || dateMs > now + 24 * 60 * 60 * 1000) continue;

  const text = `${title} ${description} ${location}`.toLowerCase();

  let termMatch = false;
  for (const t of terms) {
    if (text.includes(t)) { termMatch = true; break; }
  }
  if (!termMatch) continue;

  if (!inNetherlands(location) && !inNetherlands(description)) continue;

  const dedupeId = `adzuna_nl|${applyUrl}`;
  if (sd.seen[dedupeId]) continue;

  let hits = 0;
  for (const kw of cvKeywords) {
    if (text.includes(kw)) hits++;
  }

  let score = 20;
  if (text.includes('analyst')) score += 10;
  score += Math.min(70, hits * 8);
  score = Math.max(0, Math.min(100, Math.round(score)));
  const matchLabel = score >= 75 ? 'High' : (score >= 50 ? 'Medium' : 'Low');

  sd.seen[dedupeId] = now;
  passed++;

  out.push({
    json: {
      datePosted: new Date(dateMs).toISOString(),
      title,
      company,
      location,
      matchScore: score,
      matchLabel,
      matchReasons: `keyword_hits:${hits}`,
      applyUrl,
      source: 'adzuna_nl',
      candidatesScanned: candidates,
      passedFilters: passed
    }
  });
}

out.sort((a, b) => b.json.matchScore - a.json.matchScore);
return out;
