// Airbnb Market Analyzer — Supply and nightly price stats for any city from a geo-scoped Airbnb scan.
// Docs & pricing: https://apify.com/jdepablos/airbnb-market-analyzer
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~airbnb-market-analyzer/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "location": "Madrid, España",
  "radiusKm": 10
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
