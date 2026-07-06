// Chrono24 Watch Analyzer — Market analysis for any luxury watch — median, percentiles, market depth and dealer mix from live Chrono24 asks.
// Docs & pricing: https://apify.com/jdepablos/chrono24-watch-analyzer
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~chrono24-watch-analyzer/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "query": "Rolex Submariner 16610",
  "domain": "chrono24.com"
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
