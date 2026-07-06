// Catawiki Deal Finder — Live Catawiki auction lots vs the site's own expert estimates — discount %, reserve status and closing time.
// Docs & pricing: https://apify.com/jdepablos/catawiki-deal-finder
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~catawiki-deal-finder/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "query": "game boy",
  "endingWithinHours": 24,
  "minDiscountPct": 30
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
