// eBay Sold Price Appraiser — Real market value of any item from confirmed eBay sold listings — median, percentiles, trend, liquidity + cleaned comps.
// Docs & pricing: https://apify.com/jdepablos/ebay-sold-price-appraiser
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~ebay-sold-price-appraiser/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "query": "Game Boy Micro console",
  "marketplace": "ebay.es"
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
