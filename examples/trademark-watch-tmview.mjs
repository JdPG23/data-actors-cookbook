// Global Trademark Watch — New trademark filings across USPTO, EUIPO, WIPO and 70+ offices, with opposition deadlines.
// Docs & pricing: https://apify.com/jdepablos/trademark-watch-tmview
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~trademark-watch-tmview/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "query": "acme",
  "offices": [
    "EM",
    "US"
  ],
  "statuses": [
    "Filed"
  ]
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
