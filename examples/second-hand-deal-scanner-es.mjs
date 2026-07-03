// Second-hand Deal Scanner EU — Underpriced Vinted/Wallapop/Milanuncios listings vs real eBay sold prices, ranked by estimated resale profit (ES/FR/DE/IT/UK).
// Docs & pricing: https://apify.com/jdepablos/second-hand-deal-scanner-es
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~second-hand-deal-scanner-es/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "query": "Game Boy Micro",
  "country": "ES",
  "marginMinPct": 25
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
