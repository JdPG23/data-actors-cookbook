// Spanish Company Feed (BORME) — Daily structured feed of Spanish Companies Registry acts: incorporations, dissolutions, insolvencies.
// Docs & pricing: https://apify.com/jdepablos/borme-company-feed
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~borme-company-feed/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "provinces": [
    "MADRID"
  ],
  "actTypes": [
    "constitucion"
  ]
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
