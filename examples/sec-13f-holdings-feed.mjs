// SEC 13F Holdings Feed — Any fund manager's portfolio as clean JSON: top holdings with weights and quarter-over-quarter changes.
// Docs & pricing: https://apify.com/jdepablos/sec-13f-holdings-feed
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~sec-13f-holdings-feed/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "managers": [
    "Berkshire Hathaway"
  ],
  "topN": 15,
  "quarterOverQuarter": true
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
