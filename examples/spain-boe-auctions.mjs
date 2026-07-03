// Spain Public Auctions (BOE) — Judicial & tax auctions with auction value, cadastral reference, charges and market comparison.
// Docs & pricing: https://apify.com/jdepablos/spain-boe-auctions
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~spain-boe-auctions/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "status": "EJ",
  "provinces": [
    "Madrid"
  ],
  "maxAuctions": 20
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
