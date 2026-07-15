// Vinted Search Feed — Clean Vinted listings and price stats by query, across 9 EU markets.
// Docs & pricing: https://apify.com/jdepablos/vinted-search-feed
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~vinted-search-feed/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "query": "nintendo switch",
  "country": "ES",
  "maxListings": 48
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
