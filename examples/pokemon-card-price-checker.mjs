// Pokemon Card Price Checker — Real market value of any Pokémon card from confirmed eBay sold listings — median, percentiles and cleaned comps.
// Docs & pricing: https://apify.com/jdepablos/pokemon-card-price-checker
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~pokemon-card-price-checker/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "query": "Charizard Base Set Holo"
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
