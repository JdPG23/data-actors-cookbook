// Clinical Trials Watch — New & updated clinical trials by condition, sponsor or drug, from the official registry.
// Docs & pricing: https://apify.com/jdepablos/clinical-trials-watch
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~clinical-trials-watch/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "condition": "melanoma",
  "statuses": [
    "RECRUITING"
  ]
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
